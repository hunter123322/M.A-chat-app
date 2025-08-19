import { test, describe, expect, mock, beforeEach } from "bun:test";
import { postLocation } from "./location.controller";

// ---- Mock UserController ----
const mockLocationController = mock();

mock.module("../../user.controller.js", () => ({
  UserController: class {
    locationController = mockLocationController;
  },
}));

describe("postLocation", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    mockLocationController.mockReset();

    req = {
      body: {
        country: "Philippines",
        region: "Bicol",
        district: "Albay",
        municipality: "Bacacay",
        barangay: "Barangay 4",
        zone: "Zone 1",
        house_number: "123",
      },
      session: { user_id: 42 },
    };

    res = {
      status: mock().mockReturnThis(),
      json: mock(),
    };
  });

  test("should call locationController and return 200 with redirectUrl", async () => {
    await postLocation(req, res);

    expect(mockLocationController).toHaveBeenCalledWith(req.body, 42);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Signup successful",
      redirectUrl: "/socket/v1",
    });
  });

  test("should return 500 if session user_id is missing", async () => {
    req.session.user_id = undefined;

    await postLocation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error, please try again",
    });
  });

  test("should return 500 if controller throws an error", async () => {
    mockLocationController.mockImplementationOnce(() => { throw new Error("DB error"); });

    await postLocation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error, please try again",
    });
  });
});
