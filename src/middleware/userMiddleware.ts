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

export interface AuthRequest extends Request {
  userId?: string;
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

const userMiddleware = new UserMiddleware();

// Export a standalone isAuthenticated function for new routes
export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).json({
      message: "Token must be provided",
    });
    return;
  }

  jwt.verify(
    token,
    envConfig.jwtSecretKey as string,
    async (err, result: any) => {
      if (err) {
        res.status(403).json({
          message: "Invalid token!!!",
        });
        return;
      }
      const userData = await User.findByPk(result.userId);
      if (!userData) {
        res.status(404).json({
          message: "No user with that userId",
        });
        return;
      }
      req.userId = userData.id;
      req.user = userData;
      next();
    }
  );
};

export default userMiddleware;
