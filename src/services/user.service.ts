import Service from "@/interfaces/service.interface";
import UserModel, { IUser } from "@/models/user.model";
import logger from "@/utils/logger";
import { Model } from "mongoose";

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
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            logger.error(e);
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
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            logger.error(e);
        }
    }
}

export default UserService;
