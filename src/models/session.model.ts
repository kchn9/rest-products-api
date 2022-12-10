import { Schema, Types, model } from "mongoose";

export interface ISession {
    user: Types.ObjectId;
    valid: boolean;
    userAgent: string;
    updatedAt: number;
    createdAt: number;
}

const sessionSchema = new Schema<ISession>(
    {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        valid: { type: Boolean, default: true },
        userAgent: { type: String },
    },
    { timestamps: true }
);

export default model<ISession>("session", sessionSchema);
