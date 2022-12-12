import { Request, Response, NextFunction } from "express";
import HttpError from "@/utils/errors/HttpError";
import logger from "@/utils/logger";

function errorMiddleware(
    error: HttpError,
    _req: Request,
    res: Response,
    next: NextFunction
): void {
    logger.error(error);

    const status = error.status || 500;
    const message = error.message || "Something went wrong";

    res.status(status).send({
        status,
        message,
    });

    next(error);
}

export default errorMiddleware;
