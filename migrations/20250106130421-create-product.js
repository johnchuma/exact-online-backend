"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sellingPrice: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      priceIncludesDelivery: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      deliveryScope: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      productLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isHidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      shopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      specifications: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("Products");
  },
};
