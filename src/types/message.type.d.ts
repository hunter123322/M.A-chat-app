export type IReaction = {
  userID: string;
  emoji?: string;
}

export type MessageDataType = {
  senderID: string,
  receiverID: string,
  conversationID: string,
  reactions: Array<IReaction>,
  content: string,
  createdAt?: Date
}

type MessageStatus = "sent" | "sending" | "delivered" | "seen" | "invalid";
type ContentType = "text" | "image" | "video" | "file" | "audio";

export type IMessage = {
  senderID: string;
  receiverID: string;
  conversationID: string;
  content: string;
  contentType: ContentType;
  status: MessageStatus;
  reactions: IReaction[];
  hide: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}