import mongoose, { Schema, model, Model, HydratedDocument } from "mongoose";
import config from "config";
import bcrypt from "bcrypt";
import logger from "@/utils/logger";

export interface IUser {
    username: string;
    email: string;
    password: string;
    createdAt: number;
    updatedAt: number;
}

interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, unknown, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// hash user password before save
userSchema.pre(
    "save",
    async function (
        next: mongoose.CallbackWithoutResultAndOptionalError
    ): Promise<void> {
        const user = this as HydratedDocument<IUser>;
        if (!user.isModified("password")) {
            return next();
        }
        const { saltRounds } = config.get<{ saltRounds: number }>("bcrypt");
        const salt = await bcrypt.genSalt(saltRounds);
        const oldPassword: string = user.password;
        user.password = await bcrypt.hash(oldPassword, salt);
        return next();
    }
);

// login method
userSchema.method(
    "comparePassword",
    async function (candidatePassword: string): Promise<boolean> {
        try {
            const user = this as HydratedDocument<IUser>;
            const isPasswordCorrect = await bcrypt.compare(
                candidatePassword,
                user.password
            );
            return isPasswordCorrect;
        } catch (e) {
            logger.error(e);
            return false;
        }
    }
);

userSchema.set("toJSON", {
    transform(_doc, ret) {
        delete ret["password"];
        return ret;
    },
});

export default model<IUser>("user", userSchema);
