import postgres from 'postgres';

function createClient(): postgres.Sql {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Add it to your environment variables.'
    );
  }
  return postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

let sql: postgres.Sql | undefined;

export function getDb(): postgres.Sql {
  if (!sql) {
    sql = createClient();
  }
  return sql;
}
