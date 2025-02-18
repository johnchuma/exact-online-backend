"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.User)
      Chat.belongsTo(models.Shop)
    }
  }
  Chat.init(
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
      lastMessage: {
        type: DataTypes.TEXT,
        defaultValue:"Tap to start conversation"
      },
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
