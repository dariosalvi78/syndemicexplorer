# Syndemicexplorer
A proof of concept for a COVID19 "syndemic" dashboard

## Pre requisites

You need nodejs installed and a running instance of PostgreSQL.

To setup the database, you can use Docker:

```
docker run --name syndemicdb -e POSTGRES_PASSWORD=syndemic -p 5432:5432 -v /path/to/src/initsql:/docker-entrypoint-initdb.d -d postgis/postgis:13-3.1
```
change /path/to/src/initsql to the actual path.

This will create a running instance of Postgres with Postgis and preloaded maps for Sweden.
The database name, username and password are specified inside the file /initsql/0_structure.sql
Feel free to change them there.

Create a .env file inside the root folder of this project like the follwing:

```
PORT=5000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=syndemic
PG_USER=syndemic
PG_PASSWORD=syndemic
```
Make sure the details for connecting to the database are correct.

## Run

```sh
node ./src/app.js 
``` 

## Develop



## Dump of stuff I need later:
docker exec -it syndemicdb /bin/bash


latitude: ST_Y(ST_Centroid(geom))

longitude: ST_X(ST_Centroid(geom)),

docker run --name syndemicdb -e POSTGRES_PASSWORD=syndemic -p 5432:5432 -v /Users/aj6373/Documents/Research/Projects/covid19db/syndemicexplorer/src/initsql:/docker-entrypoint-initdb.d -d postgis/postgis:13-3.1


upsert query for epidemilogy
INSERT INTO epidemiology (source, country_code, area1_code , area2_code, area3_code, gid, date, tested)  VALUES
    (
      'DARIO',
      'ITA',
      'Campania',
      'Napoli',
      'Centro',
      'ITA.1.1_1.1',
      '2020-03-26',
      1002
    )
    ON CONFLICT (source, date, country_code, COALESCE(area1_code, ''), COALESCE(area2_code, ''), COALESCE(area3_code, ''))
    DO UPDATE SET
    tested= 1002 ;