"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subscription.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hint: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      percentSaved: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      freeDays: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Subscription",
    }
  );
  return Subscription;
};
