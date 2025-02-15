import express from "express";
import userRoutes from "./userRoutes";

const router = express.Router();

router.use("/u", userRoutes);

export default router;
