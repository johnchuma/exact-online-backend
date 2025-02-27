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
      Message.belongsTo(models.Topic);
      Message.belongsTo(models.User);
      Message.belongsTo(models.Message);
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
      TopicId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      from: {
        type: DataTypes.ENUM("user", "shop"),
        allowNull: false,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true, // Can be null if message type is "image"
      },
      type: {
        type: DataTypes.ENUM("normal", "reply", "image"),
        allowNull: false,
        defaultValue: "normal",
      },
      MessageId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Only applicable when type is "image"
      },
      delivered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
