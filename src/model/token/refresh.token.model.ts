import mongoose from "mongoose";
import { Model, Schema } from 'mongoose';

export type RefreshTokenType = {
    deviceFingerPrint: string;
}

type RefreshTokenDocument = RefreshTokenType & Document & {};

const refreshTokenSchema = new Schema({
    deviceFingerPrint: { type: String, required: true },
}, { timestamps: true, versionKey: false });

export const RefreshTokenModel: Model<RefreshTokenDocument> =
    mongoose.model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);