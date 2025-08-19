import { test, describe, expect, mock, beforeEach } from "bun:test";
import { postInformation } from "./information.controller"; // adjust path

// ---- Mock UserController ----
const mockUserInformationController = mock();

mock.module("../../user.controller.js", () => ({
  UserController: class {
    userInformationController = mockUserInformationController;
  },
}));

describe("postInformation", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    mockUserInformationController.mockReset();
    console.log = mock(); // suppress console logs in test

    req = {
      body: {
        firstName: "John",
        lastName: "Doe",
        middleName: "M",
        age: "30", // string to test Number conversion
      },
      session: { user_id: 42 },
    };

    res = {
      status: mock().mockReturnThis(),
      json: mock(),
    };
  });

  test("should call userInformationController and return 200", async () => {
    await postInformation(req, res);

    expect(mockUserInformationController).toHaveBeenCalledWith(
      { firstName: "John", lastName: "Doe", middleName: "M", age: 30 },
      42
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "aceepted" });
  });

  test("should set middleName to empty string if missing", async () => {
    req.body.middleName = undefined;

    await postInformation(req, res);

    expect(mockUserInformationController).toHaveBeenCalledWith(
      { firstName: "John", lastName: "Doe", middleName: "", age: 30 },
      42
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "aceepted" });
  });

  test("should return 500 if session user_id is missing", async () => {
    req.session.user_id = undefined;

    await postInformation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error please try again" });
  });

  test("should return 500 if controller throws error", async () => {
    mockUserInformationController.mockImplementationOnce(() => { throw new Error("DB error"); });

    await postInformation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error please try again" });
  });
});
