import pg from 'pg'; 

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

  const db_client_customers = new pg.Client({
    "user": "postgres",
    "password": "postgres",
    "host": "OSE",
    "port": "5432",
    "database": "customers"
  })
  
  console.log("connecting to customers database..")
  await db_client_customers.connect();
  
  /* This psql script block insters 1B records into the customers table */

  for (let i=0; i<100; i++) {
    const psql = `insert into customers(name) (select random() 
                from generate_series(1, 10000000))`;
    console.log(`inserting ${i+1}. 10M customer records into customers table`);
    await db_client_customers.query(psql);
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