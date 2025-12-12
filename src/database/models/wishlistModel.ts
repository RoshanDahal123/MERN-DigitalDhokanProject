import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "wishlists",
  modelName: "Wishlist",
  timestamps: true,
})
class Wishlist extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare productId: string;
}

export default Wishlist;
