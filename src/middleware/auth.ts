import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
require('dotenv').config();

if (!process.env.SECRET_KEY) {
  console.error('The SECRET_KEY environment variable is not set.');
  process.exit(1);
}

const jwtSecret: string = process.env.SECRET_KEY;
const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Authentication token missing." });
        }

        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, jwtSecret);
        (req as any).user = decoded; 
        next();
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(401).json({ message: "Please authenticate." });
    }
};

export { auth };
