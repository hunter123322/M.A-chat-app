import { test, describe, expect, mock, beforeEach } from "bun:test";
import { MainMessageService } from "./main.message.service";
import { Conversation, Participant } from "../../types/conversation.list.type";

const mockInitUserContact = mock();
mock.module("../../model/user/user.mongo.model", () => ({
    initUserContact: mockInitUserContact,
}));

describe("MainMessageService", () => {
    const sampleUser = {
        user_id: 123,
        firstName: "John",
        lastName: "Doe",
        nickname: "Johnny",
        mute: false,
        profilePicture: "profile.jpg",
    };

    // Sample session
    const sampleSession = {
        user_id: 123,
    };

    // Conversations now include `contactID`
    const sampleConversations: Conversation[] = [
        {
            userID: "1",
            contactID: "456",
            participant: [
                {
                    userID: 456,
                    firstName: "Jane",
                    lastName: "Smith",
                    nickname: "Janie",
                    mute: false,
                },
                {
                    userID: 123,
                    firstName: "John",
                    lastName: "Doe",
                    nickname: "Johnny",
                    mute: false,
                },
            ],
        },
        {
            userID: "1",
            contactID: "789",
            participant: [
                {
                    userID: 123,
                    firstName: "John",
                    lastName: "Doe",
                    nickname: "Johnny",
                    mute: false,
                },
                {
                    userID: 789,
                    firstName: "Peter",
                    lastName: "Jones",
                    nickname: "", // empty string, required by type
                    mute: true,
                },
            ],
        },
    ];


    beforeEach(() => {
        mockInitUserContact.mockReset();
    });

    describe("getUserIdFromSession", () => {
        test("should return the user ID from a valid session", () => {
            const userId = MainMessageService.getUserIdFromSession(sampleSession);
            expect(userId).toBe(123);
        });

        test("should throw an error if the user is not authenticated", () => {
            const invalidSession = { user_id: undefined };
            expect(() =>
                MainMessageService.getUserIdFromSession(invalidSession)
            ).toThrow("User not authenticated");
        });
    });

    describe("fetchUserContact", () => {
        test("should return user contact list if found", async () => {
            const mockContactList = { conversationID: ["convo-1", "convo-2"] };
            mockInitUserContact.mockResolvedValueOnce(mockContactList);

            const result = await MainMessageService.fetchUserContact(123);
            expect(mockInitUserContact).toHaveBeenCalledWith(123);
            expect(result).toEqual(mockContactList);
        });

        test("should return an empty object if no contact is found", async () => {
            mockInitUserContact.mockResolvedValueOnce(null);

            const result = await MainMessageService.fetchUserContact(123);
            expect(mockInitUserContact).toHaveBeenCalledWith(123);
            expect(result).toEqual({ conversationID: [] });
        });
    });

    describe("processConversations", () => {
        test("should process conversations and return contacts and current user", () => {
            const { contacts, currentUser } = MainMessageService.processConversations(
                sampleConversations,
                123
            );
            expect(contacts.length).toBe(2);
            expect(contacts).toEqual([
                sampleConversations[0].participant[0],
                sampleConversations[1].participant[1],
            ]);
            expect(currentUser.userID).toBe(123);
        });

        test("should throw an error if current user is not found in conversations", () => {
            const conversationsWithoutUser: Conversation[] = [];

            expect(() =>
                MainMessageService.processConversations(conversationsWithoutUser, 123)
            ).toThrow("Current user data not found in conversations");
        });
    });

    describe("generateContactList", () => {
        test("should correctly map dynamic contacts", () => {
            const dynamicContacts: Participant[] = [
                {
                    userID: 456,
                    firstName: "Jane",
                    lastName: "Smith",
                    nickname: "Janie",
                    mute: false,
                },
                {
                    userID: 789,
                    firstName: "Peter",
                    lastName: "Jones",
                    nickname: "Pete",
                    mute: true,
                },
            ];

            const result = MainMessageService.generateContactList(dynamicContacts);
            expect(result).toEqual([
                {
                    id: 456,
                    name: "Janie",
                    mute: false,
                }, {
                    id: 789,
                    name: "Pete",
                    mute: true,
                }
            ]);
        });

        test("should combine dynamic and static contacts", () => {
            const dynamicContacts: Participant[] = [
                {
                    userID: 456,
                    firstName: "Jane",
                    lastName: "Smith",
                    nickname: "Janie",
                    mute: false,
                },
                {
                    userID: 789,
                    firstName: "Peter",
                    lastName: "Jones",
                    nickname: "Pete",
                    mute: true,
                },
            ];
            const staticContacts = [{ id: 101, name: "Support", mute: false }];
            const result = MainMessageService.generateContactList(
                dynamicContacts,
                staticContacts
            );
            expect(result).toEqual([
                {
                    id: 456,
                    name: "Janie",
                    mute: false,
                }, {
                    id: 789,
                    name: "Pete",
                    mute: true,
                }, {
                    id: 101,
                    name: "Support",
                    mute: false,
                }
            ]);
        });
    });

    describe("prepareViewData", () => {
        test("should format view data correctly", () => {
            const contactList = [{ id: 456, name: "Jane", mute: false }];
            const result = MainMessageService.prepareViewData(
                sampleUser as any,
                contactList
            );
            expect(result).toEqual({
                title: "M.A-Chat-App",
                fullName: "John Doe",
                status: "Active",
                contactList,
            });
        });
    });
});
