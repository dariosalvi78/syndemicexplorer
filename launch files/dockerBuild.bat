cd ..
docker run --name syndemicdb -e POSTGRES_PASSWORD=syndemic -p 5432:5432 -v %CD%/src/initsql:/docker-entrypoint-initdb.d -d postgis/postgis:13-3.1
pause