// src/controller/contact/create.contact.controller.test.ts
import { describe, it, expect, mock } from "bun:test";
import { createContact } from "./create.contact.controller";

// ✅ Paths must exactly match the ones used inside create.contact.controller.ts
mock.module("../../db/mongodb/mongodb.connection", () => ({
  default: () => Promise.resolve(),
}));

mock.module("../../model/conversation/conversation.model", () => ({
  ConversationList: {
    create: mock(() =>
      Promise.resolve({
        _id: "conv123",
        participant: [],
        contactID: "contact123",
      })
    ),
  },
}));

mock.module("../../model/contact/contact.list.model", () => ({
  Contact: {
    findOneAndUpdate: mock(() =>
      Promise.resolve({
        _id: "contactDoc123",
        conversationID: ["conv123"],
      })
    ),
  },
}));

// Utility to mock Express req/res
function mockReqRes(query: any, session: any = { user_id: 42 }) {
  const json = mock(() => {});
  const status = mock(() => ({ json }));
  return {
    req: { query, session } as any,
    res: { status, json } as any,
  };
}

describe("createContact controller", () => {
  it("should create a contact and conversation successfully", async () => {
    const { req, res } = mockReqRes({
      contactID: "contact123",
      participant: [
        {
          userID: 1,
          firstName: "A",
          lastName: "B",
          nickname: "nick",
          mute: false,
        },
      ],
    });

    await createContact(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status().json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Contact created successfully!",
      })
    );
  });

  it("should return 500 if query is missing", async () => {
    const { req, res } = mockReqRes(undefined);

    await createContact(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
