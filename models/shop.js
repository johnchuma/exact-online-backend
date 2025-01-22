"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Shop.hasMany(models.Reel, {
        onDelete: "CASCADE",
        scope: true,
      });
      Shop.hasMany(models.Product, {
        onDelete: "CASCADE",
        scope: true,
      });
      Shop.hasMany(models.Order, {
        onDelete: "CASCADE",
        scope: true,
      });
      Shop.hasMany(models.ShopCalender, {
        onDelete: "CASCADE",
        scope: true,
      });
      Shop.hasMany(models.ShopSubscription, {
        onDelete: "CASCADE",
        scope: true,
      });
      Shop.hasMany(models.ShopDocument, {
        onDelete: "CASCADE",
        scope: true,
      });
      Shop.hasMany(models.ShopView, {
        onDelete: "CASCADE",
        scope: true,
      });
      Shop.belongsTo(models.User);
    }
  }
  Shop.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      registeredBy: {
        type: DataTypes.STRING,
        defaultValue: "Business",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shopLong: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      shopLat: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Shop",
    }
  );
  return Shop;
};
