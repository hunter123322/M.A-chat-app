import "express-session";

declare module "express-session" {
  interface SessionData {
    user_id?: number | string; // whatever type you use
  }
}
