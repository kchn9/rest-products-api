import { Request, Response, NextFunction } from "express";
import HttpError from "@/utils/errors/HttpError";
import DecodedToken from "@/interfaces/decodedToken.interface";

const protectedMiddleware =
    () => (_req: Request, res: Response, next: NextFunction) => {
        const decodedToken: DecodedToken = res.locals.user;
        if (decodedToken) {
            return next();
        }
        throw new HttpError(403, "You are not authorized to access this route");
    };

export default protectedMiddleware;
