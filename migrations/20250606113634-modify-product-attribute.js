module.exports = {
  async up(queryInterface, DataTypes) {
    // Step 1: Add a temporary column to store converted values
    await queryInterface.addColumn("Products", "temp_sellingPrice", {
      type: DataTypes.DOUBLE,
      allowNull: true, // Allow null temporarily
    });

    // Step 2: Convert existing data to DOUBLE and store in temp column
    await queryInterface.sequelize.query(`
      UPDATE "Products"
      SET "temp_sellingPrice" = CAST(COALESCE(NULLIF("sellingPrice", ''), '0') AS DOUBLE PRECISION)
    `);

    // Step 3: Drop the original column
    await queryInterface.removeColumn("Products", "sellingPrice");

    // Step 4: Rename the temporary column to the original name
    await queryInterface.renameColumn("Products", "temp_sellingPrice", "sellingPrice");

    // Step 5: Modify the column to ensure allowNull: false
    await queryInterface.changeColumn("Products", "sellingPrice", {
      type: DataTypes.DOUBLE,
      allowNull: false,
    });
  },

  async down(queryInterface, DataTypes) {
    // Step 1: Add a temporary column to store converted values
    await queryInterface.addColumn("Products", "temp_sellingPrice", {
      type: DataTypes.STRING,
      allowNull: true, // Allow null temporarily
    });

    // Step 2: Convert DOUBLE back to STRING
    await queryInterface.sequelize.query(`
      UPDATE "Products"
      SET "temp_sellingPrice" = CAST("sellingPrice" AS VARCHAR)
    `);

    // Step 3: Drop the original column
    await queryInterface.removeColumn("Products", "sellingPrice");

    // Step 4: Rename the temporary column to the original name
    await queryInterface.renameColumn("Products", "temp_sellingPrice", "sellingPrice");

    // Step 5: Modify the column to ensure allowNull: false
    await queryInterface.changeColumn("Products", "sellingPrice", {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};