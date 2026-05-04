import { Request, Response } from "express";
import Review from "../database/models/reviewModel";
import Product from "../database/models/productModel";
import User from "../database/models/userModel";
import sendResponse from "../services/sendResponse";
import { AuthRequest } from "../middleware/userMiddleware";

class ReviewController {
  // Add a review
  async addReview(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      sendResponse(res, 400, "Please provide productId and rating");
      return;
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      sendResponse(res, 400, "Rating must be between 1 and 5");
      return;
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      sendResponse(res, 404, "Product not found");
      return;
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment?.trim() || "";
      await existingReview.save();
      sendResponse(res, 200, "Review updated successfully", existingReview);
      return;
    }

    // Create new review
    const review = await Review.create({
      userId: userId,
      productId: productId,
      rating: rating,
      comment: comment?.trim() || "",
    });

    sendResponse(res, 201, "Review added successfully", review);
  }

  // Get reviews for a product
  async getProductReviews(req: Request, res: Response) {
    const { productId } = req.params;

    const allReviews = await Review.findAll({
      where: {
        productId: productId,
      },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Filter out invalid reviews (only include reviews with valid ratings)
    const validReviews = allReviews.filter(
      (review) => review.rating && review.rating >= 1 && review.rating <= 5
    );

    // Calculate average rating from valid reviews only
    const totalRating = validReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      validReviews.length > 0 ? (totalRating / validReviews.length).toFixed(1) : "0";

    sendResponse(res, 200, "Reviews fetched successfully", {
      reviews: validReviews,
      averageRating: averageRating,
      totalReviews: validReviews.length,
    });
  }

  // Get user's reviews
  // async getUserReviews(req: AuthRequest, res: Response) {
  //   const userId = req.userId;

  //   const reviews = await Review.findAll({
  //     where: {
  //       userId: userId,
  //     },
  //     include: [
  //       {
  //         model: Product,
  //         attributes: [
  //           "id",
  //           "productName",
  //           "productImageUrl",
  //           "productPrice",
  //         ],
  //       },
  //     ],
  //     order: [["createdAt", "DESC"]],
  //   });

  //   sendResponse(res, 200, "User reviews fetched successfully", reviews);
  // }

  // Delete a review
  async deleteReview(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const { reviewId } = req.params;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      sendResponse(res, 404, "Review not found");
      return;
    }

    // Check if user owns the review
    if (review.userId !== userId) {
      sendResponse(
        res,
        403,
        "You are not authorized to delete this review"
      );
      return;
    }

    await review.destroy();
    sendResponse(res, 200, "Review deleted successfully");
  }

  // Get user's review for a specific product
  async getUserProductReview(req: AuthRequest, res: Response) {
    const userId = req.userId;
    const { productId } = req.params;

    const review = await Review.findOne({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    sendResponse(res, 200, "Review fetched successfully", review);
  }
}

export default new ReviewController();
