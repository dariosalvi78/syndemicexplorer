// use https://experience.arcgis.com/experience/19fc7e3f61ec4e86af178fe2275029c5
// to get stats at regional level
// includes cases, deaths and ICU admissions


fetch("https://utility.arcgis.com/usrsvcs/servers/f336ef7192324210a8708d991a137e01/rest/services/FOHM_Covid_19_region_FME_20201228/FeatureServer/0/query?f=json&cacheHint=true&groupByFieldsForStatistics=veckonr_txt&orderByFields=veckonr_txt%20asc&outFields=*&outStatistics=%5B%7B%22onStatisticField%22%3A%22Kum_antal_fall%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22sum%22%7D%5D&resultType=standard&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=(veckonummer%20IS%20NOT%20NULL)%20AND%20(Region%3D%27Gotland%27)", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en;q=0.9,es;q=0.8,it;q=0.7",
        "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
    },
    "referrer": "https://fohm.maps.arcgis.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
});