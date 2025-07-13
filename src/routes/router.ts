import express from "express";
import { getLogin, postLogin } from "../controller/auth/login.js";
import isAuthenticated from "../middleware/authentication.js";
import { logout } from "../controller/auth/logout.js";
import { getInformation, postInformation } from "../controller/signup/step2/information.js";
import { getLocation, postLocation } from "../controller/signup/step3/location.js";
import { getSingup, postSignup } from "../controller/signup/step1/signup.js";
import { getMainMessage } from "../controller/main.message/main.message.controller.js";
const router = express.Router();

// TODO - Add route for "/home" or "/M.A-Chat-App"

// Login/Logout
router.get("/login", getLogin);
router.post("/login", postLogin);
router.post("/logout", isAuthenticated, logout);

// Multi-Step Signup
router.get("/signup", getSingup);
router.post("/signup", postSignup);

router.get("/signup/information", isAuthenticated, getInformation);
router.post("/signup/information", isAuthenticated, postInformation);

router.get("/signup/location", isAuthenticated, getLocation);
router.post("/signup/location", isAuthenticated, postLocation);

router.get("/socket/v1", isAuthenticated, getMainMessage);

export default router;
