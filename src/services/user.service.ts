import Service from "@/interfaces/service.interface";
import UserModel, { IUser } from "@/models/user.model";
import mongoose, { Model } from "mongoose";
import HttpError from "@/utils/errors/HttpError";

class UserService implements Service<IUser> {
    public model: Model<IUser> = UserModel;

    /**
     * Returns all users
     */
    public async findAll(): Promise<IUser[] | void> {
        try {
            const users = await this.model.find({});
            return users;
        } catch (e: unknown) {
            throw e;
        }
    }

    /**
     * Creates a user
     * @param {IUser} newUser
     */
    public async create(
        newUser: Omit<IUser, "createdAt" | "updatedAt">
    ): Promise<IUser | void> {
        try {
            const user = await this.model.create(newUser);
            return user;
        } catch (e: unknown) {
            if (
                e instanceof mongoose.mongo.MongoServerError &&
                e.code === 11000
            ) {
                throw new HttpError(409, "Unable to create user");
            }
            throw e;
        }
    }
}

export default UserService;
