import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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
  // check if token starts with 'Bearer ' first.
  const authHeader = req.headers.authorization?.split(" ");
  if (!authHeader || authHeader.length !== 2 || authHeader[0] !== "Bearer") {
    res.status(401).json({ error: "Unauthorized: Invalid token format" });
    return;
  }
  const token = authHeader[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded.id) {
      res.status(403).json({ error: "Invalid token structure" });
      return;
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    res.status(500).json({ error: "Server error" });
  }
};

const verifyToken = (token: string): { id: number } => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
};

export default authenticateUser;
