import Controller from "@/interfaces/controller.interface";
import SessionService from "@/services/session.service";
import { Request, Response, NextFunction, Router } from "express";
import validationMiddleware from "@/middleware/validation.middleware";
import sessionValidator, {
    CreateSessionInput,
} from "@/validators/sessions.validator";

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
            return res.status(200).json({
                token,
                refreshToken,
            });
        } catch (e) {
            next(e);
        }
    };
}

export default SessionController;
