import { randomUUID } from "crypto";
import session, { SessionOptions } from "express-session";
import MongoStore from "connect-mongo";

const middlewareSession = session({
  genid: function () {
    return randomUUID(); // generate UUIDs for session IDs
  },
  secret: process.env.SESSION_SECRET || "keyboard cat", // use env var in prod
  resave: false,
  saveUninitialized: false, // safer: only save sessions when modified
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/session",
    collectionName: "sessions",
    ttl: 24 * 60 * 60, // session lifetime in seconds (1 day)
    autoRemove: "native",
  }),
  cookie: {
    httpOnly: true, // prevents JS access to cookies
    secure: process.env.NODE_ENV === "production", // only send over HTTPS in prod
    // secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "lax", // helps protect against CSRF
  },
});

export default middlewareSession
