import { object, string, TypeOf } from "zod";

const create = object({
    body: object({
        username: string({
            required_error: "Username is required",
        })
            .min(4, "Username is too short - should be at leat 4 chars long")
            .max(
                28,
                "Username is too long - should be less than 24 chars long"
            ),
        password: string({
            required_error: "Password is required",
        }).min(6, "Password is too short - should be at least 6 chars long"),
        passwordConfirmation: string({
            required_error: "Password confirmation is required",
        }),
        email: string({
            required_error: "Email is required",
        }).email("Not a valid email"),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    }),
});
export type CreateUserInput = TypeOf<typeof create>;

export default { create };
