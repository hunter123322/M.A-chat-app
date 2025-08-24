// src/controller/contact/search.contact.controller.test.ts
import { describe, it, expect, mock, beforeEach } from "bun:test";
import { searchContact } from "./search.contact.controller";

// A shared mock object we can mutate between tests
const mockDb = {
  query: mock(() => Promise.resolve([[{ id: 1, firstName: "Alice" }]])),
  release: mock(() => {}),
};

// ✅ Mock SQLConn using the shared object
mock.module("../../db/mysql/mysql.connection-pool", () => {
  return {
    SQLConn: Promise.resolve(mockDb),
  };
});

// Utility to fake req/res
function mockReqRes(query: any = {}) {
  const json = mock(() => {});
  const status = mock(() => ({ json }));
  return {
    req: { query } as any,
    res: { status, json } as any,
  };
}

describe("searchContact controller", () => {
  beforeEach(() => {
    // reset mocks before each test
    mockDb.query.mockReset();
    mockDb.release.mockReset();
    // default query returns one user
    mockDb.query.mockImplementation(() =>
      Promise.resolve([[{ id: 1, firstName: "Alice" }]])
    );
  });

  it("should return 200 and matching users", async () => {
    const { req, res } = mockReqRes({ contactSearch: "Alice" });

    await searchContact(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status().json).toHaveBeenCalledWith([
      { id: 1, firstName: "Alice" },
    ]);
  });

  it("should return 400 if no query provided", async () => {
    const { req, res } = mockReqRes({});

    await searchContact(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status().json).toHaveBeenCalledWith({
      message: "Missing search query",
    });
  });

  it("should return 204 if no results found", async () => {
    mockDb.query.mockImplementation(() => Promise.resolve([[]])); // empty

    const { req, res } = mockReqRes({ contactSearch: "Bob" });

    await searchContact(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.status().json).toHaveBeenCalledWith({
      message: "No such user!",
    });
  });

  it("should return 500 if query throws error", async () => {
    mockDb.query.mockImplementation(() => {
      throw new Error("SQL error");
    });

    const { req, res } = mockReqRes({ contactSearch: "Crash" });

    await searchContact(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status().json).toHaveBeenCalledWith({
      message: "Server error",
    });
  });
});
