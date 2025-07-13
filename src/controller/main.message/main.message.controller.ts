import { initUserConversation } from "../../model/user/user.mongo.model";
import { Request, Response } from "express";
import type { SessionWithUserId, ContactListItem } from "../../types/main.message.type";
import { MainMessageService } from "../../service/main.message/main.message.service";
import { log } from "console";

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
      { id: "3", name: "new", img: "person2.webp" },
      { id: "1", name: "Charlie", img: "person1.webp" }
    ];
    const contactList = MainMessageService.generateContactList(contacts, staticContacts);
    log(currentUser, contactList)
    const viewData = MainMessageService.prepareViewData(currentUser, contactList);
    res.render("messageList", viewData);
  } catch (error) {
    console.error('Error in /socket/v1:', error);
    res.status(500).render('error', {
      message: 'Failed to load messages',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};