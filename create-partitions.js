import pg from 'pg';

/* Scrıpts and QA check cheatsheet
docker command to spin up the database server named pg from postgres docker image >>
docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
docker command to root into the container >>
docker exec -it pg bash
checking db server status for accepting connections >> 
pg_isready
bash script to connect into the database engine >>
psql -U postgres
check stat activity from clients >>
select * from pg_stat_activity
listing all the databases in the database server hosted in docker container >>
\l
connecting to the correct database >>
\c {databaseName}
checking definitons of database objects in the database
\d 
checking details of logical attributes in a given db table
\d {tableName}
*/

try {
  const db_client_postgres = new pg.Client({
    "user": "postgres",
    "password": "postgres",
    "host": "OSE",
    "port": "5432",
    "database": "postgres"
  })

  console.log("connecting to postgres...")  
  await db_client_postgres.connect();
  console.log("dropping customers database if exists")
  await db_client_postgres.query("drop database customers")
  console.log("(re)creating customers database")
  await db_client_postgres.query("create database customers")

  const db_client_customers = new pg.Client({
    "user": "postgres",
    "password": "postgres",
    "host": "OSE",
    "port": "5432",
    "database": "customers"
  })

  console.log("connecting to customers database..")
  await db_client_customers.connect();
  console.log("creating customers table...")
  await db_client_customers.query("create table customers (id serial, name text) partition by range (id)");

  /* This loop creates 100 partitions as the table 1B will be divided
  into 100 different horizontal partititons where each partition will
  persist 10M records */

  for (let i=0; i<100; i++) {
    const idFrom = i*10000000;
    const idTo = (i+1)*10000000;
    const partitionName = `customers_${idFrom}_${idTo}`;
    const psql1 = `create table ${partitionName}
                  (like customers including indexes)`; 
    const psql2 = `alter table customers
                  attach partition ${partitionName}
                  for values from (${idFrom}) to (${idTo})`;
    console.log(`creating partition ${partitionName}`);
    await db_client_customers.query(psql1);
    await db_client_customers.query(psql2);
  }

  console.log("closing connection to customers db and postgres...")
  await db_client_customers.end();
  await db_client_postgres.end();
  console.log("Done.");
}

catch (ex) {
    console.error(`Something went wrong ${JSON.stringify(ex)}!`)
}

console.log("End of program");