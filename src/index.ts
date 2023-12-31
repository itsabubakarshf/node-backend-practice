import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { ErrorResponse } from "./types/IErrorResponse";
import { Server } from "http";
import connectDB from "./database/index"
import { customLog } from "./utility/common";
import {userRoutes} from "./routes/userRoute";
import {pizzaRoutes} from "./routes/pizzaRoute";
import {authRoutes} from "./routes/authRoutes";

require('dotenv').config()

const app = express();
app.disable('x-powered-by') //Reduce Fingerprinting
app.use(helmet()) //protect the app from some well-known web vulnerabilities
app.use(express.json());

const port = process.env.PORT || 3000;

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("application is running");
});

// All other routes 
app.use('/api', userRoutes);
app.use('/api', pizzaRoutes);
app.use('/api', authRoutes)

// Custom 404 Not Found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: "Sorry, we can't find that!"
  });
});

// Custom error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the stack for debugging purposes

  const response: ErrorResponse = {
    status: 'error',
    message: 'Something broke on the server!'
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(500).json(response);
})

const server: Server = app.listen(port, () => {
  customLog(`Application is running on port ${port}`);
});

//Graceful shutdown
process.on('SIGTERM', () => {
  customLog('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    customLog('HTTP server closed');
  });
});
