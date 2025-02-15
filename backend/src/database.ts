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
  },
);

// Database Sync
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synchronized!"))
  .catch((err) => console.error("Error syncing database:", err));

export default sequelize;
