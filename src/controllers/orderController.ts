import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod } from "../globals/types/indes";
import Payment from "../database/models/paymentDetails";
import axios from "axios";
interface IProduct {
  productId: string;
  productQuantity: string;
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
    products.forEach((product: IProduct) => {
      OrderDetails.create({
        quantity: product.productQuantity,
        productId: product.productId,
        orderId: orderData.id,
      });
    });
    //for payment

    const paymentData = await Payment.create({
      orderId: orderData.id,
      paymentMethod,
    });

    if (paymentMethod == PaymentMethod.Khalti) {
      //khalti integration
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalAmount * 100,
        purchase_order_id: orderData.id,
        purchase_order_name: "order_" + orderData.id,
      };
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "Key 2092f6cedeff4138a55cadae0e9b6537",
          },
        }
      );
      const khaltiResponse = response.data;

      paymentData.pidx = khaltiResponse.pidx;
      paymentData.save();
      res.status(200).json({
        message: "Order Created Successfully",
        url: khaltiResponse.payment_url,
      });
    } else {
      //esewa integration
    }
  }
}

export default new OrderController();
