"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Order, {
        onDelete: "CASCADE",
        scope: true,
      });
      User.hasMany(models.Shop, {
        onDelete: "CASCADE",
        scope: true,
      });
      User.hasMany(models.Chat, {
        onDelete: "CASCADE",
        scope: true,
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "customer",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
