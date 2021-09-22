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
The database name, username and password are specified inside the file /initsql/0_structure.sql
Feel free to change them there, but remember to change the content of the .env file to use the actual database name, user name and password.

## Run

```sh
node ./src/app.js 
``` 

## Develop


docker exec -it syndemicdb /bin/bash


latitude: ST_Y(ST_Centroid(geom))

longitude: ST_X(ST_Centroid(geom)),

