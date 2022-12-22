# postgres-automatic-partitioner
Simple node.js application client developed using ESmodules to demonstrate Postgres partitioning feature on the client side. Includes seed record generation script
S/o goes to original idea and sourcecode owner Hussein Nasser.

## Scripts to spin up dockerized container and check heartbeat
docker command to spin up the database server named pg from postgres docker image (to be automated) >>

docker pull postgres 

docker run -d --name pg  \\ 
-e POSTGRES_PASSWORD=postgres  \\ 
-p 5432:5432  \\ 
postgres

docker command to root into the container >>
docker exec -it pg bash

checking db server status for accepting connections >> 
pg_isready

use psql (should be installed) to connect into the selected database (default postgres db) >>
psql -U postgres

check stat activity from clients >>
select * from pg_stat_activity

listing all the databases in the local database server hosted in docker container >>
\l
connecting to a specific database >>
\c {databaseName}
checking metadata of database objects in the database
\d 
checking metadata and details of logical attributes in a given db table
\d {tableName}