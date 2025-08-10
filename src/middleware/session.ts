import { randomUUID } from "crypto";
import session, { SessionOptions } from "express-session";
import MongoStore from "connect-mongo";


const middlewareSession: SessionOptions = {
  genid: function (req) {
    return randomUUID(); // use UUIDs for session IDs
  },
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/session",
    collectionName: "session",
    ttl: 24 * 60 * 60,
    autoRemove: "native",
  }),
  cookie: {
    secure: false,
    // secure: process.env.NODE_ENV === "production", // secure cookies only in production
    httpOnly: true, // Helps to prevent cross-site scripting attacks
    maxAge: 24 * 60 * 60 * 1000, // 1 day expiry for the cookie
    sameSite: "lax"
  },
};

export default session(middlewareSession);