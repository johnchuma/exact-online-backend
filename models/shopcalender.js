"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShopCalender extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ShopCalender.init(
    {
      shopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      openTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closeTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isOpen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ShopCalender",
    }
  );
  return ShopCalender;
};
