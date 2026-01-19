import { Request, Response } from "express";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";
import Review from "../database/models/reviewModel";
import { Op } from "sequelize";

// import { File } from "multer";
// interface IProductRequest extends Request {
//   file?: File;
// }

class ProductController {
  async createProduct(req: Request, res: Response): Promise<void> {
    const {
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      productDiscount,
      categoryId,
    } = req.body;
    const filename = req.file
      ? req.file.filename
      : "https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png";
    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productTotalStock ||
      !categoryId ||
      !productDiscount
    ) {
      res.status(400).json({
        message:
          "Please provide productName,productDescription,productPrice,productTotalStock,productDiscount,categoryId",
      });
      return;
    }
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      productDiscount: productDiscount || 0,
      categoryId: categoryId,
      productImageUrl: filename,
    });
    res.status(200).json({
      message: "Product created successfully",
    });
  }
  async getAllProducts(req: Request, res: Response): Promise<void> {
    const products = await Product.findAll({
      include: {
        model: Category,
        attributes: ["id", "categoryName"],
      },
    });

    // Calculate review statistics for each product
    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        const reviews = await Review.findAll({
          where: {
            productId: product.id,
            rating: {
              [Op.between]: [1, 5],
            },
          },
        });

        const validReviews = reviews.filter(
          (review) => review.rating && review.rating >= 1 && review.rating <= 5
        );

        const totalRating = validReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating =
          validReviews.length > 0
            ? parseFloat((totalRating / validReviews.length).toFixed(1))
            : 0;

        return {
          ...product.toJSON(),
          averageRating,
          totalReviews: validReviews.length,
        };
      })
    );

    res.status(200).json({
      message: "Products fetched successfully",
      data: productsWithReviews,
    });
  }

  async getSingleProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const products = await Product.findAll({
      where: {
        id: id,
      },
      include: {
        model: Category,
        attributes: ["id", "categoryName"],
      },
    });

    if (products.length === 0) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    // Calculate review statistics
    const reviews = await Review.findAll({
      where: {
        productId: id,
        rating: {
          [Op.between]: [1, 5],
        },
      },
    });

    const validReviews = reviews.filter(
      (review) => review.rating && review.rating >= 1 && review.rating <= 5
    );

    const totalRating = validReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      validReviews.length > 0
        ? parseFloat((totalRating / validReviews.length).toFixed(1))
        : 0;

    const productWithReviews = {
      ...products[0].toJSON(),
      averageRating,
      totalReviews: validReviews.length,
    };

    res.status(200).json({
      message: "Product fetched successfully",
      data: [productWithReviews],
    });
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const {
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      productDiscount,
      categoryId,
    } = req.body;

    try {
      const product = await Product.findOne({ where: { id } });

      if (!product) {
        res.status(404).json({
          message: "No product with that id",
        });
        return;
      }

      const filename = req.file ? req.file.filename : product.productImageUrl;

      const updatedProduct = await product.update({
        productName: productName || product.productName,
        productDescription: productDescription || product.productDescription,
        productPrice: productPrice ?? product.productPrice,
        productTotalStock: productTotalStock ?? product.productTotalStock,
        productDiscount: productDiscount ?? product.productDiscount,
        categoryId,
        productImageUrl: filename,
      });

      res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error: any) {
      console.error("Update product error:", error);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const datas = await Product.findAll({
      where: {
        id: id,
      },
    });
    if (datas.length === 0) {
      res.status(404).json({
        message: "No product with that id",
      });
    } else {
      await Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "Product deleted successfully",
        data: datas,
      });
    }
  }
}
export default new ProductController();
