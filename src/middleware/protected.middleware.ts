import { Request, Response, NextFunction } from "express";
import HttpError from "@/utils/errors/HttpError";
import SessionService from "@/services/session.service";

const protectedMiddleware =
    () => async (_req: Request, res: Response, next: NextFunction) => {
        const token = res.locals.user;
        try {
            if (!token || !token.sessionId) {
                throw new HttpError(
                    403,
                    "You are not authorized to access this route"
                );
            }
            const sessions = await new SessionService().findUserSessions({
                _id: token.sessionId,
            });
            if (!sessions || !sessions[0].valid) {
                throw new HttpError(
                    403,
                    "You are not authorized to access this route"
                );
            }
        } catch (e) {
            next(e);
        }

        next();
    };

export default protectedMiddleware;
