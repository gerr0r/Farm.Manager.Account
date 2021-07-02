const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AccountCountry extends Model {
    static associate(models) {
      this.belongsTo(models.Account, {
        foreignKey: 'accountId'
      })
    }
  }
  AccountCountry.init(
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
      countryCode: {
        allowNull: false,
        type: DataTypes.STRING
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
      tableName: "AccountCountry",
      modelName: "AccountCountry",
    }
  );
  return AccountCountry;
};
