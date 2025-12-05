"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InventoryTransaction extends Model {
    static associate(models) {
      InventoryTransaction.belongsTo(models.Product, {
        foreignKey: "ProductId",
        as: "product",
      });
      InventoryTransaction.belongsTo(models.Shop, {
        foreignKey: "ShopId",
        as: "shop",
      });
      InventoryTransaction.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "user",
      });
    }
  }
  InventoryTransaction.init(
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
      UserId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      transactionType: {
        type: DataTypes.ENUM(
          "RESTOCK",
          "SALE",
          "ADJUSTMENT",
          "RETURN",
          "DAMAGE",
          "TRANSFER",
          "COUNT"
        ),
        allowNull: false,
      },
      quantityChange: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantityBefore: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantityAfter: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      batchNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Order ID, invoice number, or other reference",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      unitCost: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      totalCost: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "InventoryTransaction",
      tableName: "InventoryTransactions",
      timestamps: true,
    }
  );
  return InventoryTransaction;
};
