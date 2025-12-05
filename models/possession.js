"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class POSSession extends Model {
    static associate(models) {
      POSSession.belongsTo(models.Shop, {
        foreignKey: "ShopId",
        as: "shop",
      });
      POSSession.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "cashier",
      });
      POSSession.belongsTo(models.User, {
        foreignKey: "closedBy",
        as: "closer",
      });
      POSSession.hasMany(models.POSSale, {
        foreignKey: "POSSessionId",
        as: "sales",
      });
    }
  }

  POSSession.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      sessionNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      openingCash: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      closingCash: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      expectedCash: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      cashDifference: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      totalSales: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      totalTransactions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cashSales: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      cardSales: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      mobileMoneySales: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      creditSales: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      refunds: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("OPEN", "CLOSED"),
        allowNull: false,
        defaultValue: "OPEN",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      closedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "POSSession",
      tableName: "POSSessions",
      timestamps: true,
    }
  );

  return POSSession;
};
