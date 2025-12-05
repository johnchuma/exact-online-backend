"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create POSSessions table
    await queryInterface.createTable("POSSessions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      ShopId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Shops",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      UserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sessionNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      openingCash: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      closingCash: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      expectedCash: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      cashDifference: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      totalSales: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      totalTransactions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cashSales: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      cardSales: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      mobileMoneySales: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      creditSales: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      refunds: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM("OPEN", "CLOSED"),
        allowNull: false,
        defaultValue: "OPEN",
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      closedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create POSSales table
    await queryInterface.createTable("POSSales", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      receiptNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      ShopId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Shops",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      UserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      POSSessionId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "POSSessions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      subtotal: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      discount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      tax: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.ENUM("CASH", "CARD", "MOBILE_MONEY", "CREDIT"),
        allowNull: false,
        defaultValue: "CASH",
      },
      paymentStatus: {
        type: Sequelize.ENUM("PAID", "PENDING", "REFUNDED", "PARTIAL"),
        allowNull: false,
        defaultValue: "PAID",
      },
      amountPaid: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      amountChange: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customerPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("COMPLETED", "VOIDED", "REFUNDED"),
        allowNull: false,
        defaultValue: "COMPLETED",
      },
      voidedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      voidedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      voidReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      refundedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      refundAmount: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      refundReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create POSSaleItems table
    await queryInterface.createTable("POSSaleItems", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      POSSaleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "POSSales",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ProductId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productSKU: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unitPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      discount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      tax: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      subtotal: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      total: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      cost: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex("POSSales", ["ShopId"]);
    await queryInterface.addIndex("POSSales", ["UserId"]);
    await queryInterface.addIndex("POSSales", ["POSSessionId"]);
    await queryInterface.addIndex("POSSales", ["receiptNumber"]);
    await queryInterface.addIndex("POSSales", ["createdAt"]);
    await queryInterface.addIndex("POSSales", ["status"]);
    await queryInterface.addIndex("POSSaleItems", ["POSSaleId"]);
    await queryInterface.addIndex("POSSaleItems", ["ProductId"]);
    await queryInterface.addIndex("POSSessions", ["ShopId"]);
    await queryInterface.addIndex("POSSessions", ["UserId"]);
    await queryInterface.addIndex("POSSessions", ["status"]);
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes
    await queryInterface.removeIndex("POSSales", ["ShopId"]);
    await queryInterface.removeIndex("POSSales", ["UserId"]);
    await queryInterface.removeIndex("POSSales", ["POSSessionId"]);
    await queryInterface.removeIndex("POSSales", ["receiptNumber"]);
    await queryInterface.removeIndex("POSSales", ["createdAt"]);
    await queryInterface.removeIndex("POSSales", ["status"]);
    await queryInterface.removeIndex("POSSaleItems", ["POSSaleId"]);
    await queryInterface.removeIndex("POSSaleItems", ["ProductId"]);
    await queryInterface.removeIndex("POSSessions", ["ShopId"]);
    await queryInterface.removeIndex("POSSessions", ["UserId"]);
    await queryInterface.removeIndex("POSSessions", ["status"]);

    // Drop tables
    await queryInterface.dropTable("POSSaleItems");
    await queryInterface.dropTable("POSSales");
    await queryInterface.dropTable("POSSessions");
  },
};
