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

router.get("/", (req, res) => {
    // Check if a session exists
    if (req.session) {
        res.send(`You have visited this page ${req.session} times.`);
    } else {
        res.send('Welcome, please refresh the page!');
    }
    console.log(req.session, req.sessionID);           // print all headers
})
export default router;
