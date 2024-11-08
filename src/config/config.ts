import { configDotenv } from "dotenv";
configDotenv();
export const envConfig = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTION_STRING,
};
