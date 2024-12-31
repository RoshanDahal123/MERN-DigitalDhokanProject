import { Model, Table } from "sequelize-typescript";


@Table({
    tableName:"orderdetails",
    modelName:"OrderDetails",
    timestamps:true
})
class OrderDetails extends Model{
    @Column
}
