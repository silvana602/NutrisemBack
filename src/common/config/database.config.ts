const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const databaseConfig = () => ({
  database: {
    host: process.env.DB_HOST ?? process.env.DATABASE_HOST ?? 'localhost',
    port: parsePort(process.env.DB_PORT ?? process.env.DATABASE_PORT, 5432),
    username: process.env.DB_USER ?? process.env.DATABASE_USER ?? 'postgres',
    password:
      process.env.DB_PASSWORD ?? process.env.DATABASE_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? process.env.DATABASE_NAME ?? 'nutrisem',
    ssl: (process.env.DB_SSL ?? process.env.DATABASE_SSL) === 'true',
  },
});
