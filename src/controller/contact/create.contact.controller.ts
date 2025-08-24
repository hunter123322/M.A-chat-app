import { Request, Response } from "express";
import mongoDBconnection from "../../db/mongodb/mongodb.connection";
import { ConversationList } from "../../model/conversation/conversation.model";
import { Contact } from "../../model/contact/contact.list.model";
import type { Participant } from "../../types/conversation.list.type";

type ContactQuery = {
    participant: Participant,
    contactID: string
}

export async function createContact(req: Request, res: Response) {
    try {
        await mongoDBconnection();
        const user_id = (req.session as { user_id?: number }).user_id;

        const query: ContactQuery = req.query as any;
        if (!query) {
            console.log("Empty query");
            throw new Error("Try again");
        }

        // Create Conversation 
        const createConversation = await ConversationList.create({
            participant: query.participant, // must be array
            contactID: query.contactID
        });

        if (!createConversation) {
            throw new Error("Failed to create Conversation!");
        }

        // Add to the ContactList in mongoDB
        const addContact = await Contact.findOneAndUpdate(
            { userID: user_id },
            { $push: { conversationID: createConversation._id } },
            { new: true }
        );

        // Add to the ContactList of receiver in mongoDB
        const addReceiverContact = await Contact.findOneAndUpdate(
            { userID: query.participant.userID },
            { $push: { conversationID: createConversation._id } },
            { new: true } 
        );

        if (!addContact || !addReceiverContact) {
            throw new Error("Failed to create Contact!");
        }

        res.status(201).json({
            message: "Contact created successfully!",
            contact: addContact,
            conversation: createConversation
        });

    } catch (error) {
        console.error(error);

        // normalize error message (could be string or Error object)
        const message = error instanceof Error ? error.message : "Server error";

        res.status(500).json({
            message,
            error: process.env.NODE_ENV === "development" ? error : "Failed to Create conversation"
        });
    }
}

