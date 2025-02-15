import express from "express";
import dotenv from "dotenv";
import authenticateUser from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";

dotenv.config();

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.findAll({
      attributes: [],
    });
  }),
);
