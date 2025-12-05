"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add productQuantity column to Products table
    await queryInterface.addColumn("Products", "productQuantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // Create InventorySettings table
    await queryInterface.createTable("InventorySettings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      ProductId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "Products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      trackInventory: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lowStockThreshold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      reorderLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 15,
      },
      maxStockLevel: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 100,
      },
      allowBackorder: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      enableLowStockAlert: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      enableExpiryTracking: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expiryAlertDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 30,
      },
      stockValuationMethod: {
        type: Sequelize.ENUM("FIFO", "LIFO", "AVERAGE", "SPECIFIC"),
        allowNull: false,
        defaultValue: "FIFO",
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      supplier: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      leadTimeDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 7,
      },
      buyingPrice: {
        type: Sequelize.DOUBLE,
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

    // Create InventoryTransactions table
    await queryInterface.createTable("InventoryTransactions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      transactionType: {
        type: Sequelize.ENUM(
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
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantityBefore: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantityAfter: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      batchNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      unitCost: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      totalCost: {
        type: Sequelize.DOUBLE,
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

    // Create InventoryBatches table
    await queryInterface.createTable("InventoryBatches", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      batchNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      initialQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      manufacturingDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      supplierInfo: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      costPerUnit: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "EXPIRED", "DEPLETED", "QUARANTINED"),
        allowNull: false,
        defaultValue: "ACTIVE",
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

    // Create InventoryAlerts table
    await queryInterface.createTable("InventoryAlerts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      alertType: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM("INFO", "WARNING", "CRITICAL"),
        allowNull: false,
        defaultValue: "INFO",
      },
      currentQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      thresholdValue: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isResolved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      resolvedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
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
    await queryInterface.addIndex("InventoryTransactions", ["ProductId"]);
    await queryInterface.addIndex("InventoryTransactions", ["ShopId"]);
    await queryInterface.addIndex("InventoryTransactions", ["createdAt"]);
    await queryInterface.addIndex("InventoryBatches", ["ProductId"]);
    await queryInterface.addIndex("InventoryBatches", ["ShopId"]);
    await queryInterface.addIndex("InventoryBatches", ["batchNumber"]);
    await queryInterface.addIndex("InventoryAlerts", ["ProductId"]);
    await queryInterface.addIndex("InventoryAlerts", ["ShopId"]);
    await queryInterface.addIndex("InventoryAlerts", ["isResolved"]);
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes
    await queryInterface.removeIndex("InventoryTransactions", ["ProductId"]);
    await queryInterface.removeIndex("InventoryTransactions", ["ShopId"]);
    await queryInterface.removeIndex("InventoryTransactions", ["createdAt"]);
    await queryInterface.removeIndex("InventoryBatches", ["ProductId"]);
    await queryInterface.removeIndex("InventoryBatches", ["ShopId"]);
    await queryInterface.removeIndex("InventoryBatches", ["batchNumber"]);
    await queryInterface.removeIndex("InventoryAlerts", ["ProductId"]);
    await queryInterface.removeIndex("InventoryAlerts", ["ShopId"]);
    await queryInterface.removeIndex("InventoryAlerts", ["isResolved"]);

    // Drop tables
    await queryInterface.dropTable("InventoryAlerts");
    await queryInterface.dropTable("InventoryBatches");
    await queryInterface.dropTable("InventoryTransactions");
    await queryInterface.dropTable("InventorySettings");

    // Remove productQuantity column from Products
    await queryInterface.removeColumn("Products", "productQuantity");
  },
};
