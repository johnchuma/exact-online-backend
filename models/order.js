"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User);
      Order.belongsTo(models.Shop);
      Order.hasMany(models.OrderedProduct,{
        onDelete: "CASCADE",
        scope: true,
      });
      // define association here
    }
  }
  Order.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      ShopId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      totalPrice:{
        type: DataTypes.DOUBLE,
        defaultValue:0
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "NEW ORDER",  //NEW ORDER, IN PROGRESS, CONFIRMED ORDERS
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
