const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const POSSession = sequelize.define(
  "POSSession",
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
  },
  {
    timestamps: true,
    tableName: "POSSessions",
  }
);

module.exports = POSSession;
