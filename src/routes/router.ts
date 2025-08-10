import express from "express";
import isAuthenticated from "../middleware/authentication.js";
import { postLogin } from "../controller/auth/login.controller.js";
import { logout } from "../controller/auth/logout.controller.js";
import { postInformation } from "../controller/signup/step2/information.controller.js";
import { postLocation } from "../controller/signup/step3/location.controller.js";
import { postSignup } from "../controller/signup/step1/signup.controller.js";
const router = express.Router();

// TODO - Add route for "/home" or "/M.A-Chat-App"

// Login/Logout
router.post("/login", postLogin);

router.post("/logout", isAuthenticated, logout);

router.post("/signup", postSignup);

router.post("/signup/information", isAuthenticated, postInformation);

router.post("/signup/location", isAuthenticated, postLocation);

export default router;
