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
      status: {
        type: DataTypes.STRING,
        defaultValue: "ON CART",
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
