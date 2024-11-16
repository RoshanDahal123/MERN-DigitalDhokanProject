import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";
const generateToken = (userId: String) => {
  const token = jwt.sign({ userId: userId }, envConfig.jwtSecretKey as string, {
    expiresIn: envConfig.jwtExpiresIn,
  });
  return token;
};
export default generateToken;
