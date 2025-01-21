"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("ShopCalenders", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      ShopId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      openTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closeTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isOpen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("ShopCalenders");
  },
};
