import { object, string, number, TypeOf } from "zod";

const create = object({
    body: object({
        name: string({
            required_error: "Name is required",
        }),
        quantity: number(),
        price: number(),
        description: string({
            required_error: "Description is required",
        }).min(120, "Description should be at least 120 characters long"),
        image: string({
            required_error: "Image is required",
        }),
    }),
});

const update = object({
    body: object({
        name: string({}),
        quantity: number(),
        price: number(),
        description: string({}),
        image: string({}),
    }).partial(),
});

const requireId = object({
    params: object({
        id: string(),
    }),
});

export type CreateProductInput = TypeOf<typeof create>;
export type UpdateProductInput = TypeOf<typeof update>;
export type RequiresProductId = TypeOf<typeof requireId>;

export default { create, update, requireId };
