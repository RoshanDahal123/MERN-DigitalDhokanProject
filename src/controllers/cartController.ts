import { Request, Response } from "express";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

class CartController {
  async addToCart(req: AuthRequest, res: Response) {
    //userId,productId,quantity
    const userId = req.user?.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      res.status(400).json({
        message: "Please provide productId,quantity",
      });
      return;
    }
    //check if that items already exuts on that user cart--->if---> just qty++|else insert
    let cartOfUser = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });
    if (cartOfUser) {
      cartOfUser.quantity = quantity;
      await cartOfUser.save();
    } else {
      await Cart.create({
        userId,
        productId,
        quantity,
      });
    }
    const cartData = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: Category,
            },
          ],
        },
      ],
    });
    res.status(200).json({
      message: "Product added to Cart",
      data: cartData,
    });
  }

  async getMyCartItems(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          attributes: ["id", "productName", "productPrice", "productImageUrl"],
        },
      ],
    });
    if (cartItems.length === 0) {
      res.status(400).json({
        message: "No items in the cart , its empty",
      });
    } else {
      res.status(200).json({
        message: "cart items fetched successfully",
        data: cartItems,
      });
    }
  }

  async deleteMyCartItem(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { productId } = req.params;
    //check if product exist or not
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        message: "No product with that id",
      });
      return;
    }
    await Cart.destroy({
      where: {
        productId,
        userId,
      },
    });
    res.status(200).json({
      message: "Product from cart deleted successfully",
    });
  }
  async updateCartItemQuantity(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!quantity) {
      res.status(400).json({
        message: "Please provide quantity",
      });
      return;
    }
    const cartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (!cartItem) {
      res.status(404).json({
        message: "there is no product in the cart with the provided productId",
      });
    } else {
      cartItem.quantity = quantity;
      await cartItem.save();
      res.status(200).json({
        message: "Card updated",
      });
    }
  }
}
export default new CartController();
