'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReadersNotification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReadersNotification.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      NotificationId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    }, {
    sequelize,
    modelName: 'ReadersNotification',
  });
  return ReadersNotification;
};