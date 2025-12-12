import express, { Router } from "express";
import WishlistController from "../controllers/wishlistController";
import { isAuthenticated } from "../middleware/userMiddleware";

const router: Router = express.Router();

router.post("/", isAuthenticated, WishlistController.addToWishlist);
router.get("/", isAuthenticated, WishlistController.getWishlist);
router.delete("/:productId", isAuthenticated, WishlistController.removeFromWishlist);
router.get("/:productId", isAuthenticated, WishlistController.checkWishlist);

export default router;
