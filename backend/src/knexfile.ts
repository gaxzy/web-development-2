import { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: Knex.Config = {
    client: "mariadb",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3306,
    },
    pool: { min: 2, max: 10 },
    migrations: {
        tableName: "knex_migrations",
        directory: "./migrations",
    },
    seeds: {
        directory: "./seeds",
    },
};

export default config;
