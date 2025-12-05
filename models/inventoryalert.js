"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InventoryAlert extends Model {
    static associate(models) {
      InventoryAlert.belongsTo(models.Product, {
        foreignKey: "ProductId",
        as: "product",
      });
      InventoryAlert.belongsTo(models.Shop, {
        foreignKey: "ShopId",
        as: "shop",
      });
    }
  }
  InventoryAlert.init(
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
      },
      ShopId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      alertType: {
        type: DataTypes.ENUM(
          "LOW_STOCK",
          "OUT_OF_STOCK",
          "EXPIRY_WARNING",
          "EXPIRED",
          "REORDER_POINT",
          "OVERSTOCK"
        ),
        allowNull: false,
      },
      severity: {
        type: DataTypes.ENUM("INFO", "WARNING", "CRITICAL"),
        allowNull: false,
        defaultValue: "INFO",
      },
      currentQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thresholdValue: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isResolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "InventoryAlert",
      tableName: "InventoryAlerts",
      timestamps: true,
    }
  );
  return InventoryAlert;
};
