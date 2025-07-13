import type { SessionWithUserId, ContactListItem, MessageListViewData} from "../../types/main.message.type"
import type { Participant, Conversation,  } from "../../types/conversation.list.type";
import type { ContactList } from "../../types/contact.list.type";
import { initUserContact } from "../../model/user/user.mongo.model";

export class MainMessageService {
    public static getUserIdFromSession = (session: SessionWithUserId): number => {
        if (!session.user_id) {
            throw new Error('User not authenticated');
        }
        return session.user_id;
    };

    public static fetchUserContact = async (userId: number): Promise<ContactList> => {
      const contact = await initUserContact(userId);
      if (!contact) {
        return {conversationID:[]}
      }
      return contact;
    };

    public static processConversations = (
      conversations: Conversation[],
      userId: number
    ): { contacts: Participant[]; currentUser: Participant } => {
      const result = conversations.reduce<{
        contacts: Participant[];
        currentUser?: Participant;
      }>((acc, conversation) => {
        const [participantA, participantB] = conversation.participant;
    
        if (participantA.userID == userId) {
          acc.contacts.push(participantB);
          acc.currentUser = participantA;
        } else {
          acc.contacts.push(participantA);
          acc.currentUser = participantB;
        }
    
        return acc;
      }, { contacts: [] });
    
      if (!result.currentUser) {
        throw new Error('Current user data not found in conversations');
      }
    
      return { contacts: result.contacts, currentUser: result.currentUser };
    };

    public static generateContactList = (
      dynamicContacts: Participant[],
      staticContacts: ContactListItem[] = []
    ): ContactListItem[] => {
      const mappedContacts = dynamicContacts.map(contact => ({
        id: contact.userID,
        name: contact.nickname || contact.firstName,
        mute: contact.mute
      }));
    
      return [...mappedContacts, ...staticContacts];
    };

    public static prepareViewData = (
      currentUser: Participant,
      contactList: ContactListItem[]
    ): MessageListViewData => ({
      title: "M.A-Chat-App",
      fullName: `${currentUser.firstName} ${currentUser.lastName}`,
      status: "Active",
      contactList
    });

}