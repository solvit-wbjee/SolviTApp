require('dotenv').config()

import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { ErrorMidllewire } from './middlewire/error';



//body parser
app.use(express.json({ limit: "50mb" }));

//cookie-parser
app.use(cookieParser());



//cors=>cors origin resources sharing
app.use(cors({
    origin: process.env.ORIGIN
}))

//testing api
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is Working"
    })
})

// Error handling for unknown routes (catch-all)
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.StatusCode = 404 // Set the error status code to 404 (Not Found)
    next(err); // Pass the error to the error handler middleware
});
// Use the error handler middleware
app.use(ErrorMidllewire);