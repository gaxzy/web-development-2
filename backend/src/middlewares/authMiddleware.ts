import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    if (!decoded || !decoded.id) {
      res.status(403).json({ error: "Invalid token structure" });
      return;
    }

    req.user = { id: decoded.id }; // Ensure `user.id` is explicitly set
    next();
  } catch (e) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default authenticateUser;
