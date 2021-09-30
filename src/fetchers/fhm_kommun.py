# Copyright (C) 2020 University of Oxford
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#
# Folkhälsomyndigheten (FHM)
# Cumulative 
# https://experience.arcgis.com/experience/a6d20c1544f34d33b60026f45b786230/page/page_0/
#

import logging
from datetime import date, timedelta, datetime
import time
from typing import Dict
from numpy import string_
import requests
import psycopg2
import pandas as pd

__all__ = ('SWE_FHMFetcher',)

from utils.fetcher.base_epidemiology import BaseEpidemiologyFetcher

logger = logging.getLogger(__name__)

class SWE_FHMFetcher(BaseEpidemiologyFetcher):
    LOAD_PLUGIN = True
    SOURCE = 'SWE_FHM'


    def get_adm_areas(self, adm_level: int) -> dict:
        '''Fetches the name and gid of all the areas of a single adm_level and returns a dict'''
        logger.debug(f'Fetching names and gid of administrative areas of level {adm_level}')

        conn = psycopg2.connect(
            #host='covid19db.org',
            host='localhost',
            port=5432,
            #dbname='covid19',
            dbname='covid19database',
            #user='covid19',
            user='postgres',
            #password='covid19'
            password='password')

        sql = f"SELECT adm_area_{adm_level}, gid FROM covid19_schema.administrative_division WHERE country = 'Sweden' AND adm_level = '{adm_level}'"
        df_adm_div = pd.read_sql(sql, conn)

        conn.close()

        nested_dict = df_adm_div.to_dict()

        # Boolean allows adm_level 1 dict to have gid as keys and 
        # region names as values
        gid_as_key = True if adm_level == 1 else False
        merged_dict = self.merge_dict(nested_dict, gid_as_key)

        return merged_dict


    def merge_dict(self, dict: dict, gid_as_key: bool) -> dict:
        '''Returns a dictionary of two nested dictionaries into one.
        
        If gid_as_key is True, the gid is the key and the name of the
        administrative area is the value in the dictionary. This is done
        for adm_area_1, to facilitate quering for region names by using 
        gid for the upsert_obj.
        '''
        adm_areas_dict = list(dict.values())[0]
        gid_dict = list(dict.values())[1]

        merged_dict = {}

        if gid_as_key == False:
            for key in adm_areas_dict:
                merged_dict[adm_areas_dict[key]] = gid_dict[key]
        else:
            for key in adm_areas_dict:
                merged_dict[gid_dict[key]] = adm_areas_dict[key]

        return merged_dict

    
    def get_region(self, gid, region_list) -> str:
        '''Gets the adm_area_1 name from an adm_area_2 gid'''
        adm_area_1_gid = 'SWE.' + gid.strip('SWE.').split('.')[0] + '_1'
        region = region_list.get(adm_area_1_gid)

        return region


    def create_upsert_obj(self, **kwargs) -> dict:
        '''Returns a database upsert object containing values from arguments'''
        upsert_obj = {
            'source': self.SOURCE,
            'date': kwargs.get('upsert_date'),
            'country': 'Sweden',
            'countrycode': 'SWE',
            'confirmed': kwargs.get('confirmed'),
            'adm_area_1': kwargs.get('adm_area_1'),
            'adm_area_2': kwargs.get('adm_area_2'),
            'gid': '{' + kwargs.get('gid') + '}'
        }

        if kwargs.get('adm_area_3'):
            upsert_obj['adm_area_3'] = kwargs.get('adm_area_3')

        return upsert_obj


    def fetch(self, day):
        '''Fetches API data from FHM and returns a JSON object'''
        year = day.year
        week = day.isocalendar()[1]
        logger.debug(f'Getting epidemiology data for SWE for {day} week {week}')

        url =  'https://utility.arcgis.com/usrsvcs/servers/63de09e702d142eb9ddd865838f80bd5/rest/services/FOHM_Covid_19_kommun_FME_20201228/FeatureServer/0/query?' \
            f'f=geojson&where=veckonr_txt%3D%27{year}-{week}%27' \
            '&returnGeometry=false' \
            '&outFields=*' \
            '&outSR=4326' \
            '&cacheHint=true'

        headers = {
            'origin': 'https://fohm.maps.arcgis.com',
            'referer': 'https://fohm.maps.arcgis.com/apps/opsdashboard/index.html'
        }

        r = requests.request("GET", url, headers=headers)
        return r.json()
    

    def run(self):
        '''Runs the SWE_FHM fetcher'''

        # Populates dicts on three adm_levels with adm_areas and their gid
        adm_1 = self.get_adm_areas(1)
        adm_2 = self.get_adm_areas(2)
        adm_3 = self.get_adm_areas(3)

        today = date.today()

        # Calculate how many days of data should be fetched
        if self.sliding_window_days:
            # Number of days in the past to process
            sliding_window_days = self.sliding_window_days
        else:
            # Number of days since first FHM data (2020-03-05)
            sliding_window_days = (today - date(2020, 3, 5)).days

        
        # For each days since today
        for days in range(sliding_window_days):

            # Accumulate data for three kommuner (adm_area_2) since
            # data only exists for stadsdelar (adm_area_3) within them
            malmo_count = 0
            goteborg_count = 0
            stockholm_count = 0

            day = today - timedelta(days=days) # The date of days since today
            data = self.fetch(day)
            features = data.get('features')
            #time.sleep(2)

            next_sunday = datetime.strptime(day.strftime('%Y-%W') + '-0', '%Y-%W-%w')

            upsert_date = next_sunday

            if len(features) == 0:
                logger.debug('There is no new data for this week')
            else:
                for i in features:
                    confirmed_cumulative = i.get('properties').get('cumfreq')
                    kommun = i.get('properties').get('KnNamn')
                    stadsdel = i.get('properties').get('Stadsdel')

                    if kommun == 'Upplands Väsby':
                        # Fix naming difference between FHM and OxCOVID19 database
                        kommun = 'Upplands-Väsby'
                    elif kommun == 'Malmö':
                        # Add to the total for adm_area_2 = Malmö
                        malmo_count += confirmed_cumulative
                    elif kommun == 'Göteborg':
                        # Add to the total for adm_area_2 = Göteborg
                        goteborg_count += confirmed_cumulative
                    elif kommun == 'Stockholm':
                        # Add to the total for adm_area_2 = Stockholm
                        stockholm_count += confirmed_cumulative

                    region = self.get_region(
                        gid=adm_2.get(kommun), 
                        region_list=adm_1
                    )
                    print('REGION:', region)
                    print('ADM_AREA_3:', stadsdel)
                    print('ADM_AREA_2:', kommun)
                    print('CUMULATIVE:', confirmed_cumulative)


                    # c, a1, a2, a3, g = self.data_adapter.get_adm_division(
                    #     'Sweden',
                        
                    # )

                    if stadsdel != None:
                        gid = adm_3.get(stadsdel)

                        upsert_obj = self.create_upsert_obj(
                            upsert_date=upsert_date,
                            confirmed=confirmed_cumulative,
                            adm_area_1=region,
                            adm_area_2=kommun,
                            adm_area_3=stadsdel,
                            gid=gid
                        )
                    else:
                        gid = adm_2.get(kommun)

                        upsert_obj = self.create_upsert_obj(
                            upsert_date=upsert_date,
                            confirmed=confirmed_cumulative,
                            adm_area_1=region,
                            adm_area_2=kommun,
                            gid=gid
                        )

                    self.upsert_data(**upsert_obj)


                malmo_upsert_obj = self.create_upsert_obj(
                    upsert_date=upsert_date,
                    confirmed=malmo_count,
                    adm_area_1='Skåne',
                    adm_area_2='Malmö',
                    gid='SWE.13.19_1'
                )

                goteborg_upsert_obj = self.create_upsert_obj(
                    upsert_date=upsert_date,
                    confirmed=goteborg_count,
                    adm_area_1='Västra Götaland',
                    adm_area_2='Göteborg',
                    gid='SWE.21.11_1'
                )

                stockholm_upsert_obj = self.create_upsert_obj(
                    upsert_date=upsert_date,
                    confirmed=stockholm_count,
                    adm_area_1='Stockholm',
                    adm_area_2='Stockholm',
                    gid='SWE.15.18_1'
                )

                self.upsert_data(**malmo_upsert_obj)
                self.upsert_data(**goteborg_upsert_obj)
                self.upsert_data(**stockholm_upsert_obj)