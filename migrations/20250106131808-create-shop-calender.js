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
      day: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      openTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      closeTime: {
        type: DataTypes.TIME,
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
