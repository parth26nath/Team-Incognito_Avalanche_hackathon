import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "JWT_SECRET";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    (req as any).user = user;
    next();
  });
}

export function authenticateSocketToken(authHeader: string) {
  const token = authHeader && authHeader.split(" ")[1];

  let userDetails;
  if (!token) userDetails = undefined;

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) userDetails = undefined;
    userDetails = user;
  });
  return userDetails;
}

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function generateNonce(): string {
  return Math.floor(Math.random() * 1000000).toString();
}
