import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { envConfig } from "../config/config";
class UserMiddleware {
  async isUserLoggedIn(
    req: Request,
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
    jwt.verify(token, envConfig.jwtSecretKey as string, async (err, result) => {
      if (err) {
        res.status(403).json({
          message: "Invalid token!!!",
        });
      } else {
        console.log(result);
        next();
      }
    });
  }
}
export default new UserMiddleware();
