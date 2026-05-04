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

export const databaseSync = sequelize.sync({ alter: true }).then(() => {
  // Database successfully synced
});

// relationships

Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Product, { foreignKey: "categoryId" });
//User x Order
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
//Payment* Order
Payment.hasOne(Order, { foreignKey: "paymentId" });
Order.belongsTo(Payment, { foreignKey: "paymentId" });
//Order x OrderDetails
OrderDetails.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });
Order.hasOne(OrderDetails, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderDetails.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(OrderDetails, { foreignKey: "productId", onDelete: "CASCADE" });

Cart.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasOne(Cart, { foreignKey: "userId", onDelete: "CASCADE" });

Cart.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(Cart, { foreignKey: "productId", onDelete: "CASCADE" });

// Wishlist relationships
Wishlist.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Wishlist, { foreignKey: "userId", onDelete: "CASCADE" });

Wishlist.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(Wishlist, { foreignKey: "productId", onDelete: "CASCADE" });

// Review relationships
Review.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Review, { foreignKey: "userId", onDelete: "CASCADE" });

Review.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });
Product.hasMany(Review, { foreignKey: "productId", onDelete: "CASCADE" });

export default sequelize;
