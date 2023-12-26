import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { ErrorResponse } from "./types/ErrorResponse";
import { Server } from "http";

require('dotenv').config()

const app = express();
app.disable('x-powered-by') //Reduce Fingerprinting
app.use(helmet()) //protect your app from some well-known web vulnerabilities
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("application is running");
});

// All other routes 
//  app.use('/api', apiRouter);

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
  console.log(`Application is running on port ${port}`);
});

//Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
