import express from "express";
const app = express();
import "./database/connection";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";

app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
export default app;
