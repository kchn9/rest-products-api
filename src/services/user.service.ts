import Service from "@/interfaces/service.interface";
import UserModel, { IUser } from "@/models/user.model";
import { Model } from "mongoose";
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
            throw new HttpError(500, "Unable to get all user records");
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
            throw new HttpError(409, "Unable to create user");
        }
    }
}

export default UserService;
