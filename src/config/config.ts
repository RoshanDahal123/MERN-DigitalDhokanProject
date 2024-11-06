import { configDotenv } from "dotenv";
configDotenv();
export const envConfig = {
  port: process.env.PORT,
};
