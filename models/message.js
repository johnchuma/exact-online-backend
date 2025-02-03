"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Chat);
      Message.belongsTo(models.Order);
      Message.belongsTo(models.Product);
    }
  }
  Message.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      message: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sentBy: {
        type: DataTypes.ENUM("Shop","User"),
        allowNull: false,
      },
      ChatId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      OrderId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      ProductId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
     
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
