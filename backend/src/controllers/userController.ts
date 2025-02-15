import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { authenticate } from "../middlewares/authMiddleware";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.checkPassword(password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET! || "secret",
      { expiresIn: "1h" },
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, email } = req.body;

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    await user.update({ username, email });
    res.json({ message: "User updated successfully", user });
  } catch {
    res.status(500).json({ error: "Error updating user" });
  }
};
