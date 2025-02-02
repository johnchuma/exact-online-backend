"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Shop)
      Product.hasMany(models.Favorite)
      Product.hasMany(models.OrderedProduct)
      Product.hasMany(models.PromotedProduct, {
        onDelete: "CASCADE",
        scope: true,
      });
      Product.hasMany(models.ProductReview, {
        onDelete: "CASCADE",
        scope: true,
      });
      Product.hasMany(models.ProductStat, {
        onDelete: "CASCADE",
        scope: true,
      });
      Product.hasMany(models.ProductImage, {
        onDelete: "CASCADE",
        scope: true,
      });
      Product.hasMany(models.ProductColor, {
        onDelete: "CASCADE",
        scope: true,
      });
      Product.hasMany(models.ProductCategory, {
        onDelete: "CASCADE",
        scope: true,
      });
    }
  }
  Product.init(
    {
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

      isHidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      ShopId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      CategoryId: {
        type: DataTypes.UUID,
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
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
