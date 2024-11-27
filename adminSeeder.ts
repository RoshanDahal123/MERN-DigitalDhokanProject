import { envConfig } from "./src/config/config";
import User from "./src/database/models/userModel";
import bcrypt from "bcrypt";
const adminSeeder = async () => {
  const [data] = await User.findAll({
    where: {
      email: envConfig.adminEmail,
    },
  });
  if (!data) {
    await User.create({
      username: envConfig.adminName,
      password: bcrypt.hashSync(envConfig.adminPassword as string, 10),
      email: envConfig.adminEmail,
      role: "admin",
    });
    console.log("Admin Seeded");
  } else {
    console.log("admin already seeded");
  }
};

export default adminSeeder;
