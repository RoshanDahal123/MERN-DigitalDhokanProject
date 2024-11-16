import { Request, Response } from "express";
import User from "../src/database/models/userModel";
import bcrypt from "bcrypt";
import generateToken from "../src/services/generateToken";
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
      password: bcrypt.hashSync(password, 12),
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
}
export default UserController;
