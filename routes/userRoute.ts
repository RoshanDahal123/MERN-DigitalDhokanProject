import express from "express";
import UserController from "../src/controllers/userController";
const router = express.Router();

//router.post("/register",UserController.register)

router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router.route("/forget-password").post(UserController.handleForgotPassword);
router.route("/verify-otp").post(UserController.verifyOtp);
router.route("/reset-password").post(UserController.resetPassword);
export default router;
