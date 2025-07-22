export type SessionWithUserId = {
  user_id?: number;
}

export type Contact = {
  conversationID: string | number;
}

export type MessageListViewData = {
  title: string;
  fullName: string;
  status: string;
  contactList: ContactListItem[];
}

export type ContactListItem = {
  id: string | number;
  name: string;
  mute?: boolean;
  img?: string;
  dataTimestamp?: string;
}
