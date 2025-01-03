import express from "express";
const app = express();
import "./database/connection";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";
import orderRoute from "./routes/orderRoute";
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
export default app;
