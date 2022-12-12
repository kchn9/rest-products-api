import SessionService from "@/services/session.service";
import jwtUtils from "@/utils/jwt.utils";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

/**
 * Responsible for extracting the access token from header and refreshing it
 */

type Token = {
    valid: boolean;
    expired: boolean;
    decoded: JwtPayload | string | null;
};

const deserializeUserMiddleware =
    () => async (req: Request, res: Response, next: NextFunction) => {
        const bearerHeader: string | undefined = req.headers.authorization;
        if (!bearerHeader) return next();

        const accessToken: string = bearerHeader.replace(/^Bearer\s/, "");
        const verifiedToken: Token = jwtUtils.verifyJWT(accessToken);
        const { expired: isExpired, decoded: decodedToken } = verifiedToken;

        if (decodedToken) res.locals.user = decodedToken;

        if (isExpired) {
            const refreshToken: string | undefined = req.get("x-refresh");
            if (!refreshToken) return next();

            const accessToken = await new SessionService().refresh(
                refreshToken
            );
            if (!accessToken) return next();
            res.setHeader("x-access-token", accessToken);
            const verifiedToken: Token = jwtUtils.verifyJWT(accessToken);
            const { valid, decoded: decodedToken } = verifiedToken;
            if (!valid || !decodedToken || typeof decodedToken === "string")
                return next();
            res.locals.user = decodedToken;
        }

        return next();
    };

export default deserializeUserMiddleware;
