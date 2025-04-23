"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("Topics", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      ChatId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      ProductId: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      ServiceId: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      OrderId: {
        allowNull: true,
        type: DataTypes.UUID,
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
    await queryInterface.dropTable("Topics");
  },
};
