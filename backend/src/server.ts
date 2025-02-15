import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.BACKEND_PORT || 5000);

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:8012",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", routes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
