import { Model } from "mongoose";
import Service from "@/interfaces/service.interface";
import UserModel, { IUser } from "@/models/user.model";
import SessionModel, { ISession } from "@/models/session.model";
import HttpError from "@/utils/errors/HttpError";
import jwtUtils from "@/utils/jwt.utils";
import config from "config";
import logger from "@/utils/logger";

class SessionService implements Service<ISession> {
    public model: Model<ISession> = SessionModel;

    /**
     * Creates token and refresh token if user succesfully signed in
     * @param {Omit<IUser, "createdAt" | "updatedAt" | "email">} credentials login and password
     * @param {string} userAgent
     * @returns {Promise<[string, string]>}
     * @throws {HttpError} if unable to create token
     */
    public async create(
        credentials: Omit<IUser, "createdAt" | "updatedAt" | "email">,
        userAgent: string
    ): Promise<[string, string]> {
        try {
            // verify user password
            const user = await UserModel.findOne({
                username: credentials.username,
            });
            const isValid =
                user === null
                    ? false
                    : await user.comparePassword(credentials.password);
            if (!user || !isValid) {
                throw new HttpError(
                    401,
                    "Invalid combination of username and password"
                );
            }
            // create session
            const session = await this.model.create({
                user: user._id,
                userAgent,
            });
            const jwt = config.get<{
                tokenTtl: string;
                refreshTokenTtl: string;
            }>("jwt");
            logger.info(jwt);

            // generate tokens
            const { tokenTtl } = jwt;
            const token = jwtUtils.signJWT(
                {
                    ...user,
                    session: session._id,
                },
                { expiresIn: tokenTtl }
            );
            const { refreshTokenTtl } = jwt;
            const refreshToken = jwtUtils.signJWT(
                {
                    ...user,
                    session: session._id,
                },
                { expiresIn: refreshTokenTtl }
            );

            return [token, refreshToken];
        } catch (e) {
            logger.error(e);
            throw new HttpError(500, "Unable to create session");
        }
    }
}

export default SessionService;
