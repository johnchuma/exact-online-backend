"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShopSubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShopSubscription.belongsTo(models.Shop)
      ShopSubscription.belongsTo(models.Subscription)
    }
  }
  ShopSubscription.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      ShopId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      SubscriptionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      expireDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ShopSubscription",
    }
  );
  return ShopSubscription;
};
