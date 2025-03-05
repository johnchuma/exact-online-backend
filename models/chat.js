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
      Chat.belongsTo(models.User);
      Chat.belongsTo(models.Shop);
      Chat.hasMany(models.Topic)
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
    
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
