"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InventoryBatch extends Model {
    static associate(models) {
      InventoryBatch.belongsTo(models.Product, {
        foreignKey: "ProductId",
        as: "product",
      });
      InventoryBatch.belongsTo(models.Shop, {
        foreignKey: "ShopId",
        as: "shop",
      });
    }
  }
  InventoryBatch.init(
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
      batchNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      initialQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      manufacturingDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      supplierInfo: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      costPerUnit: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ACTIVE", "EXPIRED", "DEPLETED", "QUARANTINED"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "InventoryBatch",
      tableName: "InventoryBatches",
      timestamps: true,
    }
  );
  return InventoryBatch;
};
