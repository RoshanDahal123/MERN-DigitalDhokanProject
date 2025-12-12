import { Response } from "express";
import { AuthRequest } from "../middleware/userMiddleware";
import Wishlist from "../database/models/wishlistModel";
import Product from "../database/models/productModel";
import sendResponse from "../services/sendResponse";

class WishlistController {
  // Add product to wishlist
  async addToWishlist(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      sendResponse(res, 400, "Please provide productId");
      return;
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      sendResponse(res, 404, "Product not found");
      return;
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingWishlist) {
      sendResponse(res, 400, "Product already in wishlist");
      return;
    }

    // Add to wishlist
    await Wishlist.create({
      userId: userId,
      productId: productId,
    });

    sendResponse(res, 201, "Product added to wishlist successfully");
  }

  // Get user's wishlist
  async getWishlist(req: AuthRequest, res: Response) {
    const userId = req.userId;

    const wishlistItems = await Wishlist.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: Product,
          attributes: [
            "id",
            "productName",
            "productDescription",
            "productPrice",
            "productImageUrl",
            "productDiscount",
            "productTotalStock",
          ],
        },
      ],
    });

    sendResponse(
      res,
      200,
      "Wishlist fetched successfully",
      wishlistItems
    );
  }

  // Remove product from wishlist
  async removeFromWishlist(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const { productId } = req.params;

    if (!productId) {
      sendResponse(res, 400, "Please provide productId");
      return;
    }

    const wishlistItem = await Wishlist.findOne({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (!wishlistItem) {
      sendResponse(res, 404, "Product not found in wishlist");
      return;
    }

    await wishlistItem.destroy();
    sendResponse(res, 200, "Product removed from wishlist successfully");
  }

  // Check if product is in wishlist
  async checkWishlist(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    sendResponse(res, 200, "Wishlist status checked", {
      inWishlist: !!wishlistItem,
    });
  }
}

export default new WishlistController();
