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