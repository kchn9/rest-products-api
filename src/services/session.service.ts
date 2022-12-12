import DecodedToken from "@/interfaces/decodedToken.interface";
import Service from "@/interfaces/service.interface";
import SessionModel, { ISession } from "@/models/session.model";
import { IUser, IUserMethods } from "@/models/user.model";
import HttpError from "@/utils/errors/HttpError";
import jwtUtils from "@/utils/jwt.utils";
import config from "config";
import { FilterQuery, Model, UpdateQuery, HydratedDocument } from "mongoose";
import UserService from "./user.service";

class SessionService implements Service<ISession> {
    public model: Model<ISession> = SessionModel;
    private UserService = new UserService();
    private jwtSettings = config.get<{
        tokenTtl: string;
        refreshTokenTtl: string;
    }>("jwt");

    /**
     * Creates token and refresh token if user succesfully signed in
     * @param {{ username: string, password: string }} credentials username and password
     * @param {string} userAgent
     * @returns {Promise<[string, string]>}
     * @throws {HttpError} if unable to create token
     */
    public async create(
        credentials: { username: string; password: string },
        userAgent: string
    ): Promise<[string, string]> {
        try {
            // verify user password
            const user = (await this.UserService.findOne({
                username: credentials.username,
            })) as HydratedDocument<IUser, IUserMethods>;
            const isValid = user
                ? await user.comparePassword(credentials.password)
                : false;
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

            // generate tokens
            const { tokenTtl } = this.jwtSettings;
            const token = jwtUtils.signJWT(
                {
                    ...user.toJSON(),
                    sessionId: session._id,
                },
                { expiresIn: tokenTtl }
            );
            const { refreshTokenTtl } = this.jwtSettings;
            const refreshToken = jwtUtils.signJWT(
                {
                    ...user.toJSON(),
                    sessionId: session._id,
                },
                { expiresIn: refreshTokenTtl }
            );

            return [token, refreshToken];
        } catch (e) {
            throw e;
        }
    }

    /**
     * Finds specific user sessions
     * @param {FilterQuery<ISession>} query
     */
    public async findUserSessions(
        query: FilterQuery<ISession>
    ): Promise<ISession[] | void> {
        try {
            const sessions = await this.model.find(query);
            return sessions;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Updates specific user session
     * @param {FilterQuery<ISession>} query
     * @param {UpdateQuery<ISession>} update
     */
    public async update(
        query: FilterQuery<ISession>,
        update: UpdateQuery<ISession>
    ): Promise<void> {
        try {
            await this.model.updateOne(query, update);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Refreshes access token using refresh token ('x-refresh' header)
     * @param {string} refreshToken
     */
    public async refresh(refreshToken: string) {
        try {
            // verify token
            const { decoded } = jwtUtils.verifyJWT(refreshToken);
            if (!decoded || typeof decoded === "string") return false;
            const decodedToken = decoded as DecodedToken;

            // get session & verify
            const session = (await this.model.findById(
                decodedToken.sessionId
            )) as HydratedDocument<ISession>;
            if (!session || !session.valid || !session.user) return false;

            // get user & verify
            const userId = session.user;
            const user = (await this.UserService.findOne({
                _id: userId,
            })) as HydratedDocument<IUser, IUserMethods>;
            if (!user) return false;

            // generate token
            const { tokenTtl } = this.jwtSettings;
            const token = jwtUtils.signJWT(
                {
                    ...user.toJSON(),
                    sessionId: session._id,
                },
                { expiresIn: tokenTtl }
            );

            return token;
        } catch (e) {
            throw e;
        }
    }
}

export default SessionService;
