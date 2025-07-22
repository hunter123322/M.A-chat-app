import { initUserConversation } from "../../model/user/user.mongo.model";
import { Request, Response } from "express";
import { MainMessageService } from "../../service/main.message/main.message.service";
import type { SessionWithUserId, ContactListItem } from "../../types/main.message.type";

export const getMainMessage = async (req: Request, res: Response) => {
  try {
    const userId = MainMessageService.getUserIdFromSession(req.session as SessionWithUserId);
    const userContact= await MainMessageService.fetchUserContact(userId);
    let conversations = await initUserConversation(userContact.conversationID);
    if (!conversations?.length) {
      conversations = []
    }
    const { contacts, currentUser } = MainMessageService.processConversations(conversations, userId);
    const staticContacts: ContactListItem[] = [
      { id: "3", name: "new", img: "person2.webp", dataTimestamp: "2752799699925" },
      { id: "1", name: "Charlie", img: "person1.webp", dataTimestamp: "3752799699925" }
    ];
    const contactList = MainMessageService.generateContactList(contacts, staticContacts);
    const viewData = MainMessageService.prepareViewData(currentUser, contactList);
    res.render("messageList", viewData);
  } catch (error) {
    res.status(500).render('error', {
      message: 'Failed to load messages',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};