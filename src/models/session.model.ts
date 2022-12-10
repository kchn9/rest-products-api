import { Schema, Types, model } from "mongoose";

export interface ISession {
    user: Types.ObjectId;
    valid: boolean;
    updatedAt: number;
    createdAt: number;
}

const sessionSchema = new Schema<ISession>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        valid: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default model<ISession>("session", sessionSchema);
