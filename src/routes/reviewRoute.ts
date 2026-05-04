import express, { Router } from "express";
import ReviewController from "../controllers/reviewController";
import { isAuthenticated } from "../middleware/userMiddleware";

const router: Router = express.Router();

// Public routes
router.route("/product/:productId").get(ReviewController.getProductReviews);

// Protected routes
router
  .route("/")
  .post(isAuthenticated, ReviewController.addReview);
  // .get(isAuthenticated, ReviewController.getUserReviews);

router
  .route("/user-product/:productId")
  .get(isAuthenticated, ReviewController.getUserProductReview);

router
  .route("/:reviewId")
  .delete(isAuthenticated, ReviewController.deleteReview);

export default router;
