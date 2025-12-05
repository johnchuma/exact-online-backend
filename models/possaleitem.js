const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const POSSaleItem = sequelize.define(
  "POSSaleItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    POSSaleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "POSSales",
        key: "id",
      },
    },
    ProductId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productSKU: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
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
    subtotal: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "POSSaleItems",
  }
);

module.exports = POSSaleItem;
