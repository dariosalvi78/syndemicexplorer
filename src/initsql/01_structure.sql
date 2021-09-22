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
  "country_name" varchar NOT NULL,
  "country_code" varchar(3) NOT NULL,
  "level" int4 NOT null,
  "area1_name" varchar null default null,
  "area1_code" varchar null default null,
  "area2_name" varchar null default null,
  "area2_code" varchar null default null,
  "area3_name" varchar null default null,
  "area3_code" varchar null default null,
  "gid" varchar NOT NULL,
  "geometry" geometry NOT NULL
);
ALTER TABLE public.admin_areas OWNER to syndemic;

create table public.epidemiology (
  "source" varchar NOT null,
  "date" date NOT NULL,
  "country_code" varchar(3) NOT NULL,
  "area1_code" varchar null default null,
  "area2_code" varchar null default null,
  "area3_code" varchar null default null,
  "gid" varchar NOT NULL,
  "tested" int null default null,
  "confirmed" int null default null,
  "recovered" int null default null,
  "dead" int null default null,
  "hospitalized" int null default null,
  "hospitalized_icu" int null default null,
  "quarantined" int null default null,
  "vaccianted_partial" int null default null,
  "vaccianted_complete" int null default null,
  CONSTRAINT epidemiology_unique UNIQUE(source, date, country_code, area1_code, area2_code, area3_code)
);
ALTER TABLE public.epidemiology OWNER to syndemic;

CREATE UNIQUE INDEX epidemiology_idx
ON public.epidemiology (source, date, country_code, COALESCE(area1_code, ''), COALESCE(area2_code, ''), COALESCE(area3_code, ''));

