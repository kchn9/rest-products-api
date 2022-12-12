import { Schema, model } from "mongoose";

export interface IProduct {
    name: string;
    quantity: number;
    price: number;
    description: string;
    image: string;
    createdAt: number;
    updatedAt: number;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default model<IProduct>("product", productSchema);
