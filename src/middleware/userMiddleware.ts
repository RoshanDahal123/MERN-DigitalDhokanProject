import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { envConfig } from "../config/config";
import User from "../database/models/userModel";

export enum Role {
  Admin = "admin",
  Customer = "customer",
}
interface IExtendedRequest extends Request {
  user?: {
    username: string;
    email: string;
    role: string;
    password: string;
    id: string;
  };
}

class UserMiddleware {
  async isUserLoggedIn(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    //receive token
    const token = req.headers.authorization;
    if (!token) {
      res.status(403).json({
        message: "Token must be provided",
      });
      return;
    }
    //validate
    jwt.verify(
      token,
      envConfig.jwtSecretKey as string,
      async (err, result: any) => {
        if (err) {
          res.status(403).json({
            message: "Invalid token!!!",
          });
        } else {
          const userData = await User.findByPk(result.userId);
          if (!userData) {
            res.status(404).json({
              message: "No user with that userId",
            });
            return;
          }

          req.user = userData;

          next();
        }
      }
    );
  }

  accessTo(...roles: Role[]) {
    return (req: IExtendedRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      //console.log(userRole, "Role");
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "You dont have permission!!",
        });
        return;
      }
      next();
    };
  }
}

export default new UserMiddleware();
