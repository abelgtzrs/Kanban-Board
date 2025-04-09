import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  username: string;
}

// Extend the Request type to include a custom user object
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: "Access token missing" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const user = jwt.verify(token, secret) as JwtPayload;
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};
