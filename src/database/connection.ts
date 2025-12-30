import { BelongsTo, ForeignKey, Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Category from "./models/categoryModel";
import Product from "./models/productModel";
import Order from "./models/orderModel";
import User from "./models/userModel";
import Payment from "./models/paymentDetails";
import OrderDetails from "./models/orderDetails";
import Cart from "./models/cartModel";
import Wishlist from "./models/wishlistModel";
import Review from "./models/reviewModel";
const sequelize = new Sequelize(envConfig.connectionString as string, {
  models: [__dirname + "/models"],
});
try {
  sequelize
    .authenticate()
    .then(() => {
      // Database authenticated successfully
    })
    .catch((err) => {
      // Authentication error
    });
} catch (error) {
  // Connection error
}

export const databaseSync = sequelize.sync({ alter: false }).then(() => {
  // Database successfully synced
});

//ralationships

Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Product, { foreignKey: "categoryId" });
//User x Order
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });
//Payment* Order
Payment.hasOne(Order, { foreignKey: "paymentId" });
Order.belongsTo(Payment, { foreignKey: "paymentId" });
//Order x OrderDetails
OrderDetails.belongsTo(Order, { foreignKey: "orderId" });
Order.hasOne(OrderDetails, { foreignKey: "orderId" });
OrderDetails.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderDetails, { foreignKey: "productId" });

Cart.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });

Cart.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Cart, { foreignKey: "productId" });

// Wishlist relationships
Wishlist.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Wishlist, { foreignKey: "userId" });

Wishlist.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Wishlist, { foreignKey: "productId" });

// Review relationships
Review.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Review, { foreignKey: "userId" });

Review.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Review, { foreignKey: "productId" });

export default sequelize;
