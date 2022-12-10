import { Request, Response, NextFunction } from "express";
import HttpError from "@/utils/errors/HttpError";

const errorMiddleware = () =>
    (err: HttpError, _req: Request, res: Response, next: NextFunction) => {
        const status = err.status || 500;
        const message = err.message;

        res.status(400).json({
            status,
            message,
        });

        next();
    };

export default errorMiddleware;
