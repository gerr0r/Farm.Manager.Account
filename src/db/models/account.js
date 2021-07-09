const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      this.hasMany(models.AccountCountry, {
        sourceKey: "id",
        foreignKey: "accountId",
      }),
      this.hasMany(models.UserFarm, {
        sourceKey: "id",
        foreignKey: "accountId",
      })
    }
  }
  
  Account.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "admin",
      },
      admin_id: {
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
    },
    {
      sequelize,
      tableName: "Account",
      modelName: "Account",
    }
  );
  return Account;
};
