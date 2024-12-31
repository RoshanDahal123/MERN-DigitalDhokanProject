import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
} from "sequelize-typescript";
import OrderStatus from "../../globals/types/indes";
import { defaultMaxListeners } from "nodemailer/lib/xoauth2";
// @Table is a decorators that tells Sequelize that this class is a table
@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [10, 10],
        msg: "Phone number must be 10 digits . ",
      },
    },
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM(
      OrderStatus.Cancelled,
      OrderStatus.Delivered,
      OrderStatus.Ontheway,
      OrderStatus.Pending,
      OrderStatus.Preparation
    ),
    defaultValue: OrderStatus.Pending,
  })
  declare orderStatus: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare shippingAddress: string;
}
export default Order;
