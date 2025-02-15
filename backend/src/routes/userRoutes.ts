import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import authenticateUser from "../middlewares/authMiddleware";
import { asyncHandler } from "../middlewares/asyncHandler";

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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { username, email } = req.body;
    const [updated] = await User.update(
      { username, email },
      { where: { id: req.user.id } },
    );

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", updated });
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

    try {
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        },
      );
      res.json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Token generation failed" });
    }
  }),
);

// GET user profile
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
