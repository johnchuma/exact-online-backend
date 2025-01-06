"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoryProductSpecification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CategoryProductSpecification.init(
    {
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expectedDataType: {
        type: DataTypes.STRING,
        defaultValue: "string",
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CategoryProductSpecification",
    }
  );
  return CategoryProductSpecification;
};
