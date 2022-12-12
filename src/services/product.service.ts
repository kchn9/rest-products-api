import Service from "@/interfaces/service.interface";
import ProductModel, { IProduct } from "@/models/product.model";
import HttpError from "@/utils/errors/HttpError";
import { CreateProductInput } from "@/validators/product.validator";
import mongoose, { Model, UpdateQuery } from "mongoose";

class ProductService implements Service<IProduct> {
    public model: Model<IProduct> = ProductModel;

    /**
     * Returns all products
     */
    public async findAll() {
        try {
            const products = await this.model.find({});
            return products;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Returns specific product
     * @param {string} id
     */
    public async findOne(id: string) {
        try {
            const product = await this.model.findById(id);
            if (!product) {
                throw new HttpError(404, "Product not found");
            }
            return product;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Creates new product
     * @param {CreateProductInput["body"]} newProduct
     */
    public async create(newProduct: CreateProductInput["body"]) {
        try {
            const product = await this.model.create(newProduct);
            return product;
        } catch (e) {
            if (
                e instanceof mongoose.mongo.MongoServerError &&
                e.code === 11000
            ) {
                throw new HttpError(409, "User already exists");
            }
            throw e;
        }
    }

    /**
     * Updates specified product
     * @param {string} id
     * @param {UpdateQuery<IProduct>} query
     */
    public async updateOne(id: string, query: UpdateQuery<IProduct>) {
        try {
            const product = await this.model.findByIdAndUpdate(id, query, {
                new: true,
            });
            if (!product) {
                throw new HttpError(404, "Product not found");
            }
            return product;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Deletes specified product
     * @param {string} id
     */
    public async deleteOne(id: string) {
        try {
            const product = await this.model.findByIdAndDelete(id);
            if (!product) {
                throw new HttpError(404, "Product not found");
            }
            return product;
        } catch (e) {
            throw e;
        }
    }
}

export default ProductService;
