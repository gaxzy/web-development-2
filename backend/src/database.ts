import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "notes_database",
    process.env.DB_USER || "user",
    process.env.DB_PASSWORD || "userp",
    {
        dialect: "mariadb",
        host: process.env.DB_HOST || "notes_mariadb",
        port: Number(process.env.DB_PORT) || 3306,
        logging: console.log,
    }
);

sequelize
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.error("Error connection to database:", err));

export default sequelize;
