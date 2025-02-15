import express from "express";
import User from "../models/User";
import { authenticate } from "../middlewares/authMiddleware";
import { Request, Response } from "express";

interface AuthRequest extends Request {
    user?: { id: number };
}

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "username", "email"],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// GET user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ["id", "username", "email"],
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// UPDATE logged in user
router.patch(
    "/update",
    authenticate,
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const userId = req.user.id;
            const { username, email } = req.body;

            const user = await User.findByPk(userId);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            console.log(
                `Updating user: ${userId} with username: ${user.username} -> ${username}, email: ${user.email} -> ${email}`
            );

            console.log("Before update:", user.toJSON());

            await user.update({ username, email });

            console.log("After update:", user.toJSON());

            res.json({ message: "User updated successfully", user });
        } catch (error) {
            console.error("error updating user: ", error);
            res.status(500).json({ error: "Error updating user" });
        }
    }
);

export default router;
