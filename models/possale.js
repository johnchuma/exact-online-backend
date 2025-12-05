"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class POSSale extends Model {
    static associate(models) {
      POSSale.belongsTo(models.Shop, {
        foreignKey: "ShopId",
        as: "shop",
      });
      POSSale.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "cashier",
      });
      POSSale.belongsTo(models.User, {
        foreignKey: "customerId",
        as: "customer",
      });
      POSSale.belongsTo(models.User, {
        foreignKey: "voidedBy",
        as: "voider",
      });
      POSSale.belongsTo(models.POSSession, {
        foreignKey: "POSSessionId",
        as: "session",
      });
      POSSale.hasMany(models.POSSaleItem, {
        foreignKey: "POSSaleId",
        as: "items",
      });
    }
  }

  POSSale.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      receiptNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ShopId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Shops",
          key: "id",
        },
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      POSSessionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "POSSessions",
          key: "id",
        },
      },
      subtotal: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      tax: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.ENUM("CASH", "CARD", "MOBILE_MONEY", "CREDIT"),
        allowNull: false,
        defaultValue: "CASH",
      },
      paymentStatus: {
        type: DataTypes.ENUM("PAID", "PENDING", "REFUNDED", "PARTIAL"),
        allowNull: false,
        defaultValue: "PAID",
      },
      amountPaid: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      amountChange: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      customerId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customerPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("COMPLETED", "VOIDED", "REFUNDED"),
        allowNull: false,
        defaultValue: "COMPLETED",
      },
      voidedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      voidedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      voidReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refundedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      refundAmount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      refundReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "POSSale",
      tableName: "POSSales",
      timestamps: true,
    }
  );

  return POSSale;
};
