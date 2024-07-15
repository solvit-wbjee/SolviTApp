import ErrorHandler from '../utilities/ErrorHandeler';
import { NextFunction, Request, Response } from 'express';
export const ErrorMidllewire = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong MongoDB ID error
    if (err.name === "CastError") {
        const message = `Resource not found, Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = `JSON Web Token is expired. Please try again later.`;
        err = new ErrorHandler(message, 400);
    }

    // JWT invalid error
    if (err.name === "JsonWebTokenError") {
        const message = `JSON Web Token is invalid. Please try again later.`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
