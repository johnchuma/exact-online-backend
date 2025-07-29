module.exports = {
  async up(queryInterface, DataTypes) {
    // Step 1: Add a temporary column to store converted values
    await queryInterface.addColumn("Products", "SubcategoryId", {
      type: DataTypes.UUID,
      allowNull: true, // Allow null temporarily
    });
  },

  async down(queryInterface, DataTypes) {
    // Step 1: Add a temporary column to store converted values
    await queryInterface.removeColumn("Products", "SubcategoryId");
  },
};
