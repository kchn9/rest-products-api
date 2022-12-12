import Controller from "@/interfaces/controller.interface";
import DecodedToken from "@/interfaces/decodedToken.interface";
import protectedMiddleware from "@/middleware/protected.middleware";
import validationMiddleware from "@/middleware/validation.middleware";
import SessionService from "@/services/session.service";
import HttpError from "@/utils/errors/HttpError";
import sessionValidator, {
    CreateSessionInput,
} from "@/validators/sessions.validator";
import { NextFunction, Request, Response, Router } from "express";

class SessionController implements Controller {
    public path = "/sessions";
    public router = Router();
    private SessionService = new SessionService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        /**
         * @route POST /api/sessions
         */
        this.router.post(
            this.path,
            validationMiddleware(sessionValidator.create),
            this.create
        );

        /**
         * @route GET /api/sessions
         */
        this.router.get(
            this.path,
            protectedMiddleware(),
            this.findUserValidSessions
        );

        /**
         * @route DELETE /api/sessions
         */
        this.router.delete(this.path, protectedMiddleware(), this.invalidate);
    }

    private create = async (
        req: Request<unknown, unknown, CreateSessionInput["body"]>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const [token, refreshToken] = await this.SessionService.create(
                req.body,
                req.get("user-agent") || ""
            );
            if (!token || !refreshToken) {
                return next(
                    new HttpError(
                        500,
                        "Error occured during token/refeshToken generation"
                    )
                );
            }
            return res.status(200).json({
                token,
                refreshToken,
            });
        } catch (e) {
            next(e);
        }
    };

    private findUserValidSessions = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user: DecodedToken = res.locals.user;
            const sessions = await this.SessionService.findUserSessions({
                user: user._id,
                valid: true,
            });
            return res.status(200).json({
                sessions,
            });
        } catch (e) {
            next(e);
        }
    };

    private invalidate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { sessionId } = res.locals.user as DecodedToken;
            await this.SessionService.update(
                {
                    _id: sessionId,
                },
                {
                    valid: false,
                }
            );

            return res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    };
}

export default SessionController;
