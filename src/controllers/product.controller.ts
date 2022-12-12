import Controller from "@/interfaces/controller.interface";
import protectedMiddleware from "@/middleware/protected.middleware";
import validationMiddleware from "@/middleware/validation.middleware";
import ProductService from "@/services/product.service";
import productValidator, {
    RequiresProductId,
    CreateProductInput,
    UpdateProductInput,
} from "@/validators/product.validator";
import { Request, Response, NextFunction, Router } from "express";

class ProductController implements Controller {
    public path = "/products";
    public router = Router();
    private ProductService = new ProductService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        /**
         * @route GET /api/products
         */
        this.router.get(this.path, protectedMiddleware(), this.findAll);

        /**
         * @route GET /api/products/:id
         */
        this.router.get(
            `${this.path}/:id`,
            [
                validationMiddleware(productValidator.requireId),
                protectedMiddleware(),
            ],
            this.findOne
        );

        /**
         * @route POST /api/products
         */
        this.router.post(
            this.path,
            [
                validationMiddleware(productValidator.create),
                protectedMiddleware(),
            ],
            this.create
        );

        /**
         * @route PUT /api/products/:id
         */
        this.router.put(
            `${this.path}/:id`,
            [
                validationMiddleware(productValidator.requireId),
                validationMiddleware(productValidator.update),
                protectedMiddleware(),
            ],
            this.updateOne
        );

        /**
         * @route DELETE /api/products/:id
         */
        this.router.delete(
            `${this.path}/:id`,
            [
                validationMiddleware(productValidator.requireId),
                protectedMiddleware(),
            ],
            this.deleteOne
        );
    }

    private findAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const products = await this.ProductService.findAll();
            res.status(200).json(products);
        } catch (e) {
            next(e);
        }
    };

    private findOne = async (
        req: Request<RequiresProductId["params"]>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const productId: string = req.params.id;
            const product = await this.ProductService.findOne(productId);
            res.status(200).json(product);
        } catch (e) {
            next(e);
        }
    };

    private create = async (
        req: Request<unknown, unknown, CreateProductInput["body"]>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const product = await this.ProductService.create(req.body);
            res.status(201).json(product);
        } catch (e) {
            next(e);
        }
    };

    private updateOne = async (
        req: Request<
            RequiresProductId["params"],
            object,
            UpdateProductInput["body"]
        >,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const productId: string = req.params.id;
            const product = await this.ProductService.updateOne(
                productId,
                req.body
            );
            res.status(200).json(product);
        } catch (e) {
            next(e);
        }
    };

    private deleteOne = async (
        req: Request<RequiresProductId["params"]>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const productId: string = req.params.id;
            const product = await this.ProductService.deleteOne(productId);
            res.status(200).json(product);
        } catch (e) {
            next(e);
        }
    };
}

export default ProductController;
