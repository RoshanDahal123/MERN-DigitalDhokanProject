import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { PaymentMethod, PaymentStatus } from "../../globals/types/indes";

@Table({
  tableName: "payment",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM(
      PaymentMethod.COD,
      PaymentMethod.Esewa,
      PaymentMethod.Khalti
    ),
    defaultValue: PaymentMethod.COD,
  })
  declare paymentMethod: string;

  @Column({
    type: DataType.ENUM(PaymentStatus.Paid, PaymentStatus.Unpaid),
    defaultValue: PaymentStatus.Unpaid,
  })
  declare paymentStatus: string;
}
