import mongoose, { Schema, Model } from "mongoose";
import type { ContactList } from "../../types/contact.list.type";


const contactListSchema = new Schema<ContactList>({
    userID: { type: String, required: true, trim: true },
    conversationID: [{ type: String, required: true }],
},
    {
        timestamps: true, 
        versionKey: false, 
        _id: false,
        collection: "contactList"
    }
);

export const Contact: Model<ContactList> = mongoose.models.Contact ||
    mongoose.model<ContactList>("ContactList", contactListSchema);

