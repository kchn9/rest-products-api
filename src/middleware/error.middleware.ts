import { Request, Response, NextFunction } from "express";
import HttpError from "@/utils/errors/HttpError";
import logger from "@/utils/logger";

const errorMiddleware =
    () =>
    (err: HttpError, _req: Request, res: Response, next: NextFunction) => {
        logger.error(err.message);

        const status = err.status || 500;
        const message = err.message;

        res.status(400).send({
            status,
            message,
        });
        next();
    };

export default errorMiddleware;
