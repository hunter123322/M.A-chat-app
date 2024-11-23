import { request } from "express";
import session from "express-session";

declare global {
  namespace Express {
    interface Session {
      username?: string;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      session?: string;
    }
  }
}
