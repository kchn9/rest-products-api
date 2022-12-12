import Service from "@/interfaces/service.interface";
import UserModel, { IUser } from "@/models/user.model";
import mongoose, { FilterQuery, Model } from "mongoose";
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
                throw new HttpError(409, "User already exists");
            }
            throw e;
        }
    }

    /**
     * Finds specific user
     * @param {FilterQuery<IUser>} query
     */
    public async findOne(query: FilterQuery<IUser>): Promise<IUser | void> {
        try {
            const user = await this.model.findOne(query);
            if (!user) {
                throw new HttpError(404, "User not found");
            }
            return user;
        } catch (e) {
            throw e;
        }
    }
}

export default UserService;
