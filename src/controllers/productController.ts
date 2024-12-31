import { Request, Response } from "express";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

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
      discount,
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
      !categoryId
    ) {
      res.status(400).json({
        message:
          "Please provide productName,productDescription,productPrice,productTotalStock,discount,categoryId",
      });
      return;
    }
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount: discount || 0,
      categoryId: categoryId,
      productImageUrl: filename,
    });
    res.status(200).json({
      message: "Product created successfully",
    });
  }
  async getAllProducts(req: Request, res: Response): Promise<void> {
    const datas = await Product.findAll({
      include: {
        model: Category,
        attributes: ["id", "categoryName"],
      },
    });
    res.status(200).json({
      message: "Products fethced successfully",
      data: datas,
    });
  }

  async getSingleProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const datas = await Product.findAll({
      where: {
        id: id,
      },
      include: {
        model: Category,
        attributes: ["id", "categoryName"],
      },
    });
    res.status(200).json({
      message: "Products fethced successfully",
      data: datas,
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

    const product = await Product.findOne({
      where: { id },
    });
    if (!product) {
      res.status(400).json({
        message: "No product with that id",
      });
      return;
    }

    const filename = req.file ? req.file.filename : product?.productImageUrl;

    try {
      await product.update({
        productName: productName || product.productName,
        productDescription: productDescription || product.productDescription,
        productPrice: productPrice || product.productPrice,
        productTotalStock: productTotalStock || product.productTotalStock,
        productDiscount:
          productDiscount !== undefined
            ? productDiscount
            : product.productDiscount,
        categoryId,
        productImageUrl: filename,
      });
      res.status(400).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error: any) {
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
