'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.changeColumn("Shops","name",{
      unique:true,
      type: DataTypes.STRING,
      allowNull: false,
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.changeColumn("Shops","name",{
      unique:false,
      type: DataTypes.STRING,
      allowNull: false,
    })
  }
};
