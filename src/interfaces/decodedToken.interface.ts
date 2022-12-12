import { Document, Types } from "mongoose";
import { IUser } from "@/models/user.model";

interface DecodedToken extends Document<IUser> {
    sessionId: Types.ObjectId;
    iat: number;
    exp: number;
}

export default DecodedToken;
