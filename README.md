# Syndemicexplorer
A proof of concept for a COVID19 "syndemic" dashboard

## Pre requisites

You need nodejs installed and a running instance of PostgreSQL.

To setup the database, you can use Docker:

```
docker run --name syndemicdb -e POSTGRES_PASSWORD=syndemic -p 5432:5432 -v /path/to/src/initsql:/docker-entrypoint-initdb.d -d postgis/postgis:13-3.1
```
change /path/to/src/initsql to the actual path.

This will create a running instance of Postgres with Postgis and a preloaded dataset for Sweden.

## 


docker exec -it syndemicdb /bin/bash



shp2pgsql 


docker run --name syndemicdb -e POSTGRES_PASSWORD=syndemic -p 5432:5432 -v /Users/aj6373/Documents/Research/Projects/covid19db/syndemicexplorer/src/initsql:/docker-entrypoint-initdb.d -d postgis/postgis:13-3.1

latitude: ST_Y(ST_Centroid(geom))

longitude: ST_X(ST_Centroid(geom)),

