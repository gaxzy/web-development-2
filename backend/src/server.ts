import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import sequelize from "./database";

dotenv.config();

const app = express();
const PORT = Number(process.env.BACKEND_PORT || 5000);

app.use(cors());
app.use(express.json());

// Database Sync
sequelize
    .sync({ alter: true }) // Ensures DB schema updates
    .then(() => console.log("Database synchronized!"))
    .catch((err) => console.error("Error syncing database:", err));

// Routes
app.use("/api", routes);

// Health check endpoint
app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
