import pinoHttp from "pino-http";
import pinoPretty from "pino-pretty";
import logger from "@/utils/logger";
import { IncomingMessage } from "http";
import { Request, Response, NextFunction } from "express";

const prettier = pinoPretty({
    colorize: true,
});

const httpLogger = pinoHttp(
    {
        logger: logger,
        customProps: function (req: IncomingMessage) {
            const { body } = req as Request;
            return {
                body: body,
            };
        },
    },
    prettier
);

const httpLoggerMiddleware =
    () => (req: Request, res: Response, next: NextFunction) => {
        httpLogger(req, res);
        next();
    };

export default httpLoggerMiddleware;
