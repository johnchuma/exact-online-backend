"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("Messages", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      TopicId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      from: {
        type: DataTypes.ENUM("user", "shop"),
        allowNull: false,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true, // Can be null if message type is "image"
      },
      type: {
        type: DataTypes.ENUM("normal", "reply", "image"),
        defaultValue: "normal",
      },
      MessageId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Only applicable when type is "image"
      },
      delivered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
    await queryInterface.dropTable("Messages");
  },
};
