"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InventorySettings extends Model {
    static associate(models) {
      InventorySettings.belongsTo(models.Product, {
        foreignKey: "ProductId",
        as: "product",
      });
      InventorySettings.belongsTo(models.Shop, {
        foreignKey: "ShopId",
        as: "shop",
      });
    }
  }
  InventorySettings.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      ProductId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      ShopId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      trackInventory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lowStockThreshold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      reorderLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15,
      },
      maxStockLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 100,
      },
      allowBackorder: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      enableLowStockAlert: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      enableExpiryTracking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expiryAlertDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 30,
      },
      stockValuationMethod: {
        type: DataTypes.ENUM("FIFO", "LIFO", "AVERAGE", "SPECIFIC"),
        allowNull: false,
        defaultValue: "FIFO",
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      barcode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      supplier: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      leadTimeDays: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 7,
      },
      buyingPrice: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "InventorySettings",
      tableName: "InventorySettings",
      timestamps: true,
    }
  );
  return InventorySettings;
};
