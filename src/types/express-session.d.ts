import "http";
import "express-session";

declare module "http" {
  interface IncomingMessage {
    session?: {
      user_id?: number;
      [key: string]: any;
    };
  }
}
