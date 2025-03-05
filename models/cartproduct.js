'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartProduct.belongsTo(models.Product)
      CartProduct.belongsTo(models.User)
    }
  }
  CartProduct.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    ProductId: {
      allowNull: true,
      type: DataTypes.UUID,
    },
    quantity: {
      type: DataTypes.DOUBLE,
      defautlValue: 1,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'CartProduct',
  });
  return CartProduct;
};