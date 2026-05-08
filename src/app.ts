import express from "express";
const app = express();
import "./database/connection";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute";
import orderRoute from "./routes/orderRoute";
import cartRoute from "./routes/cartRoute";
import wishlistRoute from "./routes/wishlistRoute";
import reviewRoute from "./routes/reviewRoute";
import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "https://digital-dokan-front-end.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/review", reviewRoute);

app.use(express.static("./src/uploads"));
export default app;
