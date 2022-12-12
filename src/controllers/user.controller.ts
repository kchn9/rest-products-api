import Controller from "@/interfaces/controller.interface";
import protectedMiddleware from "@/middleware/protected.middleware";
import validationMiddleware from "@/middleware/validation.middleware";
import UserService from "@/services/user.service";
import userValidator, { CreateUserInput } from "@/validators/user.validator";
import { NextFunction, Request, Response, Router } from "express";

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        /**
         * @route GET /api/users
         */
        this.router.get(this.path, protectedMiddleware(), this.findAll);

        /**
         * @route POST /api/users
         */
        this.router.post(
            this.path,
            validationMiddleware(userValidator.create),
            this.create
        );
    }

    private findAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const users = await this.UserService.findAll();
            res.status(200).json(users);
        } catch (e) {
            next(e);
        }
    };

    private create = async (
        req: Request<unknown, unknown, CreateUserInput["body"]>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const user = await this.UserService.create(req.body);
            res.status(201).json(user);
        } catch (e: unknown) {
            next(e);
        }
    };
}

export default UserController;
