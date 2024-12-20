import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Category from "./models/categoryModel";
import Product from "./models/productModel";
const sequelize = new Sequelize(envConfig.connectionString as string, {
  models: [__dirname + "/models"],
});
try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("authentication is correct");
    })
    .catch((err) => {
      console.log("error occured", err);
    });
} catch (error) {
  console.log(error);
}

sequelize.sync({ force: false, alter: true }).then(() => {
  console.log("local changes injected to database successfully synced");
});

//ralationships

Product.belongsTo(Category);
Category.hasOne(Product);

export default sequelize;
