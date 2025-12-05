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
      CategoryProductSpecification.belongsTo(models.Category);
    }
  }
  CategoryProductSpecification.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expectedDataType: {
        type: DataTypes.ENUM("string", "number", "boolean", "date"),
        defaultValue: "string",
      },
      inputStyle: {
        type: DataTypes.ENUM(
          "single-select",
          "multi-select",
          "toggle",
          "range"
        ),
        defaultValue: "single-select",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      values: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      CategoryId: {
        type: DataTypes.UUID,
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
