This tutorial shows how to convert shapefiles, like the ones from GADM, to the table used in this project.

Download the shape files into a folder, for example from: https://gadm.org/download_country_v3.html

Then we need a running instance of linux with mounted a local folder where you place the shape files:

```sh
docker run --name base -e POSTGRES_PASSWORD=mysecretpassword -v /path/to/shapefiles:/shapefiles -d postgres:13
```

Enter the container:

```sh
docker exec -it base /bin/bash
```

Inside the container, run:

```sh
apt-get update
apt-get install postgis
```

The check what's the name of the shapefile and run:

```sh
cd /shapefiles
shp2pgsql -I -s 4326 ./shapefile.shp tmp > tmp.sql
```
(change shapefile.shp to the actual name of your file)

Now you should have a big .sql file in the folder.
Copy the file into the Postgis container:

```sh
docker cp /path/to/tmp.sql syndemicdb:/
```

Connect to the postgis instance and run:
```sh
docker exec -it syndemicdb psql postgresql://syndemic:syndemic@localhost:5432/syndemic -f /tmp.sql
```
Make sure the username, password and databasename are correct.

Now the tmp table should be copied inside the database. You need to convert it. Run the following query with a database client like with psql:

```sql
insert into admin_areas (country_name, country_code, level , area1_name , area1_code , area2_name , area2_code , gid, geometry )
SELECT name_0, gid_0, 2, name_1, gid_1, name_2, gid_2, gid_2, geom
FROM tmp
```

This is supposing that the GADM data contains level 2 (like municipalities). For other levels, you need to customise this query.

Then delete the temporary table and file:

```sql
drop table tmp
```

```sh
docker exec -it syndemicdb rm /tmp.sql
docker stop base
docker rm base
```

