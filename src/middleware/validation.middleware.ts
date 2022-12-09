import { AnyZodObject, ZodError } from "zod";
import { Response, Request, NextFunction } from "express";

const validationMiddleware = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body, query, params } = req;
            schema.parse({
                body,
                query,
                params,
            });
            return next();
        } catch (e: unknown) {
            const errors: string[] = [];
            if (e instanceof ZodError) {
                e.issues.forEach((issue) => errors.push(issue.message));
            }
            return res.status(400).send(errors || e);
        }
    };
};

export default validationMiddleware;
