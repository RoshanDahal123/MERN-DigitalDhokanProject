import express, { Router } from "express";
import userMiddleware, { Role } from "../middleware/userMiddleware";
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
  .route("/all")
  .get(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(orderController.fetchAllOrder)
  );
router
  .route("/verify-transaction")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.verifyTransaction)
  );
router
  .route("/admin/change-status/:id")
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(orderController.changeOrderStatus)
  );
router
  .route("/admin/delete-order/:id")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(orderController.deleteOrder)
  );
router
  .route("/cancel-order/:id")
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Customer),
    errorHandler(orderController.CancelMyOrder)
  );
router.route("/:id").get(
  userMiddleware.isUserLoggedIn,
  // userMiddleware.accessTo(Role.Admin),
  errorHandler(orderController.fetchMyOrderDetail)
);

export default router;
