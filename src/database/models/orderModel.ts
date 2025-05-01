import { Table, Column, Model, DataType } from "sequelize-typescript";

import { OrderStatus } from "../../globals/types";
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
  })
  declare addressLine: string;

  @Column({
    type: DataType.STRING,
  })
  declare city: string;
  @Column({
    type: DataType.STRING,
  })
  declare state: string;
  @Column({
    type: DataType.STRING,
  })
  declare zipcode: string;
  @Column({
    type: DataType.STRING,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "Anonymous@gmail.com ",
  })
  declare email: string;
}
export default Order;
