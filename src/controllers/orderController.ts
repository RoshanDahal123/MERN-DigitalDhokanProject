import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentDetails";
import axios from "axios";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";
interface IProduct {
  productId: string;
  quantity: string;
}
interface OrderRequest extends Request {
  user?: {
    id: string;
  };
}
class OrderWithPaymentId extends Order {
  declare paymentId: string | null;
}

class OrderController {
  async createOrder(req: OrderRequest, res: Response) {
    const userId = req.user?.id;
    const {
      phoneNumber,
      addressLine,
      state,
      city,
      zipCode,
      totalAmount,
      paymentMethod,
      firstName,
      lastName,
      email,
    } = req.body;
    const products: IProduct[] = req.body.products;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !addressLine ||
      !state ||
      !city ||
      !zipCode ||
      !totalAmount ||
      products.length == 0
    ) {
      res.status(400).json({
        message:
          "Please provide phoneNumber, shippingAddress,totalAmount and Product",
      });
      return;
    }
    let data;
    const paymentData = await Payment.create({
      paymentMethod,
    });
    //for order
    const orderData = await Order.create({
      phoneNumber,
      addressLine,
      state,
      city,
      zipCode,
      totalAmount,
      userId,
      firstName,
      lastName,
      email,
      paymentId: paymentData.id,
    });

    products.forEach(async function (product: IProduct) {
      data = await OrderDetails.create({
        quantity: product.quantity,
        productId: product.productId,
        orderId: orderData.id,
      });

      await Cart.destroy({
        where: {
          productId: product.productId,
          userId: userId,
        },
      });
    });
    //for payment

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
        pidx: khaltiResponse.pidx,
        data,
      });
    } else if (paymentMethod == PaymentMethod.Esewa) {
      //esewa integration
    } else {
      res.status(200).json({
        message: "Order Created Successfully",
        data,
      });
    }
  }
  async verifyTransaction(req: OrderRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {
      res.status(400).json({
        message: "Please provide pidx",
      });
      return;
    }
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      {
        pidx: pidx,
      },
      {
        headers: {
          Authorization: "Key 2092f6cedeff4138a55cadae0e9b6537",
        },
      }
    );
    const data = response.data;
    if (data.status === "Completed") {
      await Payment.update(
        { paymentStatus: PaymentStatus.Paid },
        {
          where: {
            pidx: pidx,
          },
        }
      );
      res.status(200).json({
        message: "Payment verified successfully!!",
      });
    } else {
      res.status(200).json({
        message: "Payment not verified or cancelled",
      });
    }
  }

  async fetchMyOrder(req: OrderRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId,
      },
      attributes: ["totalAmount", "id", "orderStatus"],
      include: {
        model: Payment,
        attributes: ["paymentMethod", "paymentStatus"],
      },
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "Orders fetched successsfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No order found",
        data: [],
      });
    }
  }
  async fetchAllOrder(req: OrderRequest, res: Response): Promise<void> {
    const orders = await Order.findAll({
      attributes: ["totalAmount", "id", "orderStatus"],
      include: {
        model: Payment,
        attributes: ["paymentMethod", "paymentStatus"],
      },
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "Orders fetched successsfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No order found",
        data: [],
      });
    }
  }

  async fetchMyOrderDetail(req: OrderRequest, res: Response) {
    // const userId = req.user?.id;
    const orderId = req.params.id;
    console.log("this is the order idof the product", orderId);
    const orders = await OrderDetails.findAll({
      where: {
        orderId,
      },
      //joining the order that includes payment model and product model
      include: [
        {
          model: Order,
          include: [
            {
              model: Payment,
              attributes: ["paymentMethod", "paymentStatus"],
            },
          ],
          attributes: [
            "orderStatus",
            "addressLine",
            "state",
            "city",
            "totalAmount",
            "phoneNumber",
            "firstName",
            "lastName",
            "email",
          ],
        },
        {
          model: Product,
          include: [
            {
              model: Category,
            },
          ],
          attributes: ["productImageUrl", "productName", "productPrice"],
        },
      ],
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "Orders fetched successsfully",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No order found",
        data: [],
      });
    }
  }
  async CancelMyOrder(req: OrderRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = req.params.id;
    const [order] = await Order.findAll({
      where: {
        userId: userId,
        id: orderId,
      },
    });
    // console.log(order);
    if (!order) {
      res.status(400).json({
        message: "No order with that Id",
      });
      return;
    }
    //check order Status

    if (
      order.orderStatus === OrderStatus.Ontheway ||
      order.orderStatus === OrderStatus.Preparation
    ) {
      res.status(400).json({
        message:
          "You cannot cancelled order, it is on the way or preparation mode",
      });
      return;
    }
    await Order.update(
      { orderStatus: OrderStatus.Cancelled },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "Order Cancelled successfully",
      data: order.orderStatus,
    });
  }

  async changeOrderStatus(req: OrderRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const { orderStatus } = req.body;
    if (!orderId || !orderStatus) {
      res.status(400).json({
        message: "Please Provide OrderId and OrderStatus",
      });
      return;
    }
    await Order.update(
      { orderStatus: orderStatus },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "OrderStatus updated successfully",
    });
  }
  async deleteOrder(req: OrderRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const order: OrderWithPaymentId = (await Order.findByPk(
      orderId
    )) as OrderWithPaymentId;
    const paymentId = order?.paymentId;
    if (!order) {
      res.status(404).json({
        message: "You don't have that orderId order",
      });
      return;
    }
    await OrderDetails.destroy({
      where: {
        orderId: orderId,
      },
    });
    await Payment.destroy({
      where: {
        id: paymentId,
      },
    });
    await Order.destroy({
      where: {
        id: orderId,
      },
    });
    res.status(200).json({
      message: "Order deleted successfully",
    });
  }
}

export default new OrderController();
