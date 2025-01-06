"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PromotedProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PromotedProduct.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      budget: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      startDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      endDate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "PromotedProduct",
    }
  );
  return PromotedProduct;
};
