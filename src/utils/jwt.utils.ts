import jwt from "jsonwebtoken";
import config from "config";

const keys = config.get<{ privateKey: string; publicKey: string }>("jwt");
const { privateKey, publicKey } = keys;

const signJWT = (
    payload: string | object | Buffer,
    options?: jwt.SignOptions | undefined
) => {
    return jwt.sign(payload, privateKey, {
        ...(options && options),
        algorithm: "RS256",
    });
};

const verifyJWT = (token: string) => {
    try {
        const decoded = jwt.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded,
        };
    } catch (e) {
        return {
            valid: false,
            expired: true,
            decoded: null,
        };
    }
};

export default { signJWT, verifyJWT };
