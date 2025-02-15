import express from "express";
import dotenv from "dotenv";
import User from "../models/User";
import jwt from "jsonwebtoken";
import authenticateUser from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";

dotenv.config();

const router = express.Router();

// GET all users
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.findAll({
      attributes: ["id", "username", "email"],
    });
    res.json(users);
  }),
);

// GET user by ID
router.get(
  "/:id(\\d+)",
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "username", "email"],
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }),
);

// PATCH update logged in user
router.patch(
  "/update",
  authenticateUser,
  asyncHandler(async (req, res) => {
    console.log("User making the request:", req.user); // Debug log

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    console.log("Extracted userId:", userId); // Debug log

    const { username, email } = req.body;
    console.log("Update data received:", { username, email }); // Debug log

    const user = await User.findByPk(userId);
    if (!user) {
      console.error("User not found in database for ID:", userId); // Debug log
      return res.status(404).json({ error: "User not found" });
    }

    const newUser = await user.update({ username, email });
    console.log("User updated successfully:", newUser); // Debug log

    res.json({ message: "User updated successfully", newUser });
  }),
);

// POST register new user
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = await User.create({ username, email, password });
    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser.id });
  }),
);

// POST login user
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    if (!user.checkPassword(password))
      return res.status(401).json({
        error: "Invalid credentials",
      });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  }),
);

// PROTECTED: Get user profile (Example usage of `authenticateUser`)
router.get(
  "/profile",
  authenticateUser,
  asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  }),
);

export default router;
