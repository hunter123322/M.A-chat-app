import { describe, it, expect, mock } from "bun:test";
import { joinConversationEvent } from "./room.event";


describe("joinConversationEvent", () => {
    it("should join a conversation when 'joinConversation' is emitted", () => {
        const mockJoin = mock();
        const socket = {
            id: "socket123",
            join: mockJoin,
            on: (event: string, handler: Function) => {
                // simulate emitting "joinConversation"
                if (event === "joinConversation") {
                    handler("conversationABC");
                }
            },
        } as any;

        joinConversationEvent(socket)



        expect(mockJoin).toHaveBeenCalledWith("conversationABC");
    });
});
