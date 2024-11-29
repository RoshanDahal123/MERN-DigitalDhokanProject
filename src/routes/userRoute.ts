import express, { Router } from "express";

import UserController from "../controllers/userController";
const router: Router = express.Router();

//router.post("/register",UserController.register)

router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router.route("/forget-password").post(UserController.handleForgotPassword);
router.route("/verify-otp").post(UserController.verifyOtp);
router.route("/reset-password").post(UserController.resetPassword);
export default router;