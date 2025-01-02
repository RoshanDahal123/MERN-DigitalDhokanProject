import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod } from "../globals/types/indes";
import Payment from "../database/models/paymentDetails";
interface IProduct {
  productId: string;
  prductQty: number;
}
interface OrderRequest extends Request {
  user?: {
    id: string;
  };
}

class OrderController {
  async createOrder(req: OrderRequest, res: Response) {
    const userId = req.user?.id;
    const { phoneNumber, shippingAddress, totalAmount, paymentMethod } =
      req.body;
    const products: IProduct[] = req.body.products;

    if (
      !phoneNumber ||
      !shippingAddress ||
      !totalAmount ||
      products.length == 0
    ) {
      res.status(400).json({
        message:
          "Please provide phoneNumber, shippingAddress,totalAmount and Product",
      });
      return;
    }
    //for order
    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
    });

    //for orderdetails
    products.forEach((product) => {
      OrderDetails.create({
        quantity: product.prductQty,
        productId: product.productId,
        orderId: orderData.id,
      });
    });
    //for payment

    if (paymentMethod == PaymentMethod.COD) {
      await Payment.create({
        orderId: orderData.id,
        paymentMethod,
      });
    } else if (paymentMethod == PaymentMethod.Khalti) {
      //khalti integration
    } else {
      //esewa integration
    }
    res.status(200).json({
      message: "Order Created Successfully",
    });
  }
}

export default new OrderController();
