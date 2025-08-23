export type Participant = {
    userID: string | number,
    firstName: string,
    lastName: string,
    nickname: string,
    mute: boolean
}

export type Conversation = {
    userID: string,
    participant: Array<Participant>,
    contactID: string,
    _id?: boolean
}
