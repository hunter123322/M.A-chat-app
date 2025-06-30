import express from "express";
import signup from "./signup.js";
import login from "./login.js";
import isAuthenticated from "../controller/authentication.js";
import logout from "./logout.js";
const router = express.Router();

router.get("/signup", signup.getSingup);
router.get("/signup/information", isAuthenticated, signup.getSingupInformation);
router.get("/signup/location", isAuthenticated, signup.getSingupLocation);
router.get("/login", login.getLogin);

router.post("/signup", signup.postSignup);
router.post("/signup/information", isAuthenticated, signup.userInformation);
router.post("/signup/location", isAuthenticated, signup.userLocation);
router.post("/login", login.postlogin);

router.post("/logout", isAuthenticated, logout.logout)

export default router;
