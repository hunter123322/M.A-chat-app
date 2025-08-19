import { test, describe, expect, mock, beforeEach } from "bun:test";
import { getMessage, postMessage } from "./message.socket.service";

// ---- Setup Message model mock ----
const mockSave = mock();
const mockFind = mock();
let sortMock: ReturnType<typeof mock>;
let limitMock: ReturnType<typeof mock>;


mockFind.mockReturnValue({
    sort: mock().mockReturnThis(),
    limit: mock().mockResolvedValue([]),
});

const MockMessageConstructor = mock(() => ({
    save: mockSave,
}));

Object.assign(MockMessageConstructor, {
    find: mockFind,
});

// Replace actual Message model with mock
mock.module("../../model/messages.model", () => ({
    __esModule: true,
    default: MockMessageConstructor,
}));

// ---- Setup crypto mock ----
const mockUUID = mock();
mock.module("crypto", () => ({
    randomUUID: mockUUID,
}));

describe("Message Service", () => {
    const sampleMessage = {
        _id: "65e640673d6118336341279a",
        senderID: "user123",
        receiverID: "user456",
        conversationID: "convo-123",
        content: "Hello, world!",
        reactions: [],
        createdAt: new Date("2024-03-04T10:00:00Z"),
    };

    beforeEach(() => {
        mockSave.mockReset();
        mockFind.mockReset();
        mockUUID.mockReset();
        MockMessageConstructor.mockReset();

        sortMock = mock().mockReturnThis();
        limitMock = mock().mockResolvedValue([]);

        mockFind.mockReturnValue({
            sort: sortMock,
            limit: limitMock,
        });
    });



    describe("getMessage", () => {
        test("should return messages for a conversation", async () => {
            limitMock.mockResolvedValueOnce([sampleMessage]);

            const convoId = "convoAB";
            const lastTimestamp = new Date("2025-08-09T09:47:11.447+00:00");

            const result = await getMessage(convoId, lastTimestamp);
            
            expect(mockFind).toHaveBeenCalledWith({
                conversationalID: convoId,
                createdAt: { $lt: lastTimestamp },
            });

            expect(result).toEqual([sampleMessage]);
        });


        test("should throw if no messages found", async () => {
            const convoId = "nonexistent";
            const lastTimestamp = new Date();

            await expect(getMessage(convoId, lastTimestamp)).rejects.toThrow(
                "No messages found"
            );
        });
    });

    describe("postMessage", () => {
        test("should save a message with given convoId", async () => {
            MockMessageConstructor.mockImplementation(() => ({
                save: mock().mockResolvedValue(sampleMessage),
            }));

            const result = await postMessage(
                sampleMessage.content,
                sampleMessage.senderID,
                sampleMessage.receiverID,
                sampleMessage.reactions,
                sampleMessage.conversationID
            );

            expect(MockMessageConstructor).toHaveBeenCalledWith({
                senderID: sampleMessage.senderID,
                receiverID: sampleMessage.receiverID,
                conversationID: sampleMessage.conversationID,
                reactions: sampleMessage.reactions,
                content: sampleMessage.content,
            });

            expect(result).toEqual(sampleMessage);
        });

        test("should generate new UUID if convoId not provided", async () => {
            mockUUID.mockReturnValue("mock-uuid-123");

            const expectedMessage = {
                ...sampleMessage,
                conversationID: "mock-uuid-123",
            };

            MockMessageConstructor.mockImplementation(() => ({
                save: mock().mockResolvedValue(expectedMessage),
            }));

            const result = await postMessage(
                sampleMessage.content,
                sampleMessage.senderID,
                sampleMessage.receiverID,
                sampleMessage.reactions
            );

            expect(mockUUID).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedMessage);
        });

        test("should throw if save fails", async () => {
            const saveError = new Error("Database connection failed");
            MockMessageConstructor.mockImplementation(() => ({
                save: mock().mockRejectedValue(saveError),
            }));

            await expect(
                postMessage("content", "sender", "receiver", [])
            ).rejects.toThrow("Post message Error!");
        });
    });
});
