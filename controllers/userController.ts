import { Request, Response } from "express";
import User from "../src/database/models/userModel";

class UserController {
  static async register(req: Request, res: Response) {
    //incoming user data receive
    // const { username, email, password } = req.body;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
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
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  }
}
export default UserController;
