import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";
import generateToken from "../services/generateToken";
import generateOtp from "../services/generateOtp";
import sendMail from "../services/sendMail";
class UserController {
  static async register(req: Request, res: Response) {
    //incoming user data receive
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide username,email,password",
      });
      return;
    }
    //data--> users table ma insert garne
    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 12),
    });
    await sendMail({
      to: email,
      subject: "Registration successful on Digital Dookan",
      text: "Welcome to Digital Dokaan, Thank you for supporting",
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  }
  static async login(req: Request, res: Response) {
    //accept incoming data-->email,password
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email,message",
      });
      return;
    }
    //check email exist or not at first
    const [user] = await User.findAll({
      //find->findAll --array,findById-->findByPk--object
      where: {
        email: email,
      },
    });

    //if yes-->email exist -->check password too
    if (!user) {
      res.status(400).json({
        message: "No user with that email😪",
      });
    } else {
      const isEqual = bcrypt.compareSync(password, user.password);
      if (!isEqual) {
        res.status(400).json({
          message: "Invalid response",
        });
      } else {
        const token = generateToken(user.id);

        res.status(200).json({
          message: "login successful",
          token,
        });
      }
    }

    //if password is correct ,token generated(jwt)
  }
  static async handleForgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Please Provide email" });
      return;
    }

    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(400).json({ message: "Email not registered" });
      return;
    }
    const otp = generateOtp();
    await sendMail({
      to: email,
      subject: "Digital Dookan Password change Request",
      text: `you just request reset Password,here is your otp,${otp}`,
    });
    user.otp = otp.toString();
    user.otpGeneratedTime = Date.now().toString();
    await user.save();
    res.status(200).json({ message: "Password Reset Otp sent" });
  }
}
export default UserController;