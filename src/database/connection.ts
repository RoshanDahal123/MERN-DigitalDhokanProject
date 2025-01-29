import { BelongsTo, ForeignKey, Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Category from "./models/categoryModel";
import Product from "./models/productModel";
import Order from "./models/orderModel";
import User from "./models/userModel";
import Payment from "./models/paymentDetails";
import OrderDetails from "./models/orderDetails";
import Cart from "./models/cartModel";
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

sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("local changes injected to database successfully synced");
});

//ralationships

Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Product, { foreignKey: "categoryId" });
//User x Order
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });
//Payment* Order
Payment.belongsTo(Order, { foreignKey: "orderId" });
Order.hasOne(Payment, { foreignKey: "orderId" });
//Order x OrderDetails
OrderDetails.belongsTo(Order, { foreignKey: "orderId" });
Order.hasOne(OrderDetails, { foreignKey: "orderId" });
OrderDetails.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderDetails, { foreignKey: "productId" });

Cart.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });

Cart.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Cart, { foreignKey: "productId" });

export default sequelize;
