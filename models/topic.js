"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Topic.belongsTo(models.Chat)
      Topic.belongsTo(models.Product)
      Topic.belongsTo(models.Order)
      Topic.hasMany(models.Message)
    }
  }
  Topic.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      ChatId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      ProductId: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      OrderId: {
        allowNull: true,
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "Topic",
    }
  );
  return Topic;
};
