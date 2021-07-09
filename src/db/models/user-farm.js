const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserFarm extends Model {
    static associate(models) {
      this.belongsTo(models.Account, {
        foreignKey: 'accountId'
      })
    }
  }
  UserFarm.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      farmId: {
        allowNull: false,
        type: DataTypes.UUID
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      tableName: "UserFarm",
      modelName: "UserFarm",
    }
  );
  return UserFarm;
};
