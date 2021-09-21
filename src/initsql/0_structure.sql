--- Use this only if the user does not exist yet
CREATE USER syndemic WITH
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'syndemic';

--- use this if the DB does not exist yet
CREATE DATABASE syndemic OWNER syndemic;

\connect syndemic

CREATE EXTENSION IF NOT EXISTS "postgis";

create table public.admin_areas (
  "country_name" varchar NOT null,
  "country_code" varchar NOT NULL,
  "level" int4 NOT null,
  "area1_name" varchar,
  "area1_code" varchar,
  "area2_name" varchar,
  "area2_code" varchar,
  "area3_name" varchar,
  "area3_code" varchar,
  "gid" varchar,
  "geometry" geometry
)
ALTER TABLE public.admin_areas OWNER to syndemic;

