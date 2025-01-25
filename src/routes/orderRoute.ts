import express, { Router } from "express";
import userMiddleware from "../middleware/userMiddleware";
import orderController from "../controllers/orderController";
import errorHandler from "../services/errorHandler";
const router: Router = express.Router();

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.createOrder)
  );
router
  .route("/verify-transaction")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.verifyTransaction)
  );

export default router;
