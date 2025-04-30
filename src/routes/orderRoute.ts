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
  )
  .get(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.fetchMyOrder)
  );
router
  .route("/verify-transaction")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.verifyTransaction)
  );

router
  .route("/:id")
  .get(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.fetchMyOrderDetail)
  );

export default router;
