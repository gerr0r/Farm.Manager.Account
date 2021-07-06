const db = require("../db/models");
const bcrypt = require("bcrypt");
const { createToken, verifyToken, hasRights } = require("../helpers/auth");

module.exports = {
  Query: {
    verify(parent, args, context) {
      const { token } = context;
      const decodedToken = verifyToken(token);
      if (!decodedToken) throw new Error("Unauthorized");
      return decodedToken;
    },

    async account(parent, args, context) {
      const { token } = context;
      if (!hasRights(token, "master")) throw new Error("Unauthorized");
      return await db.Account.findByPk(args.id);
    },

    async inactiveAccounts(parent, args, context) {
      const { token } = context;
      if (!hasRights(token, "master")) throw new Error("Unauthorized");
      return await db.Account.findAll({
        where: { active: false, role: "admin" },
      });
    },

    async activeAccounts(parent, args, context) {
      const { token } = context;
      if (!hasRights(token, "master")) throw new Error("Unauthorized");
      return await db.Account.findAll({
        where: { active: true, role: "admin" },
      });
    },

    async login(parent, args, context) {
      const account = await db.Account.findOne({
        where: { email: args.email },
      });
      if (!account) throw new Error("Account not found");

      const validPassword = await bcrypt.compare(
        args.password,
        account.password
      );
      if (!validPassword) throw new Error("Wrong password");
      if (!account.active) throw new Error("Account is not active");

      const token = createToken({
        id: account.id,
        email: account.email,
        role: account.role,
      });

      return {
        token,
        account,
      };
    },
  },

  Mutation: {
    async register(parent, args, context) {
      // all new users
      const password = await bcrypt.hash(args.password, 10);
      // transaction required to prevent changing updatedAt field even on fail
      const transaction = await db.sequelize.transaction();
      try {
        await db.Account.create(
          {
            email: args.email,
            password,
          },
          { transaction }
        );
        await transaction.commit();
        return "Account created. Please wait for aproval";
      } catch (error) {
        await transaction.rollback();
        console.error(error);
        if (error.parent.code === "23505")
          throw new Error("Registration failed: Email already in use");
        throw new Error("Registration failed: Something went wrong. Try again");
      }
    },

    async activate(parent, args, context) {
      // master only
      const { token } = context;
      if (!hasRights(token, "master")) throw new Error("Unauthorized");

      const account = await db.Account.update(
        { active: true },
        {
          where: { id: args.id },
          returning: true,
        }
      );
      return account[1][0].dataValues;
    },

    async deactivate(parent, args, context) {
      // master only
      const { token } = context;
      if (!hasRights(token, "master")) throw new Error("Unauthorized");

      const account = await db.Account.update(
        { active: false },
        {
          where: { id: args.id },
          returning: true,
        }
      );
      return account[1][0].dataValues;
    },

    async addUser(parent, args, context) {
      // farm admin account only
      const { token } = context;
      const adminId = hasRights(token, "admin");
      if (!adminId) throw new Error("Unauthorized");
      // transaction required to prevent changing updatedAt field even on fail
      const password = await bcrypt.hash(args.password, 10);
      const transaction = await db.sequelize.transaction();
      try {
        await db.Account.create(
          {
            email: args.email,
            password,
            role: "user",
            admin_id: adminId,
            active: true,
          },
          { transaction }
        );
        await transaction.commit();
        return "User added to account.";
      } catch (error) {
        await transaction.rollback();
        console.error(error);
        if (error.parent.code === "23505")
          return "Registration failed: User already in use";
        return false;
      }
    },

    async addAssignment(parent, args, context) {
      // master only
      const { token } = context;
      if (!hasRights(token, "master")) throw new Error("Unauthorized");

      const { accountId, countryCode } = args;
      try {
        const checkAssignment = await db.AccountCountry.findOne({
          where: {
            accountId, 
            countryCode
          }
        })
        if (checkAssignment) throw new Error("Country already assigned")
        
        const assignment = await db.AccountCountry.create({
          accountId,
          countryCode
        });
        return assignment
      } catch (error) {
        console.log(error);
      }
    },

    async removeAssignment(parent, args, context) {
      // master only
      const { token } = context;
      if (!hasRights(token, "master")) throw new Error("Unauthorized");

      const { accountId, countryCode } = args;
      try {
        const checkAssignment = await db.AccountCountry.findOne({
          where: {
            accountId, 
            countryCode
          }
        })
        if (!checkAssignment) throw new Error("Assignment not found")

        const assignment = await db.AccountCountry.destroy({
          where: {
            accountId, 
            countryCode
          }
        });
        return checkAssignment
      } catch (error) {
        console.log(error);
        throw new Error(error.message)
      }
    },
  },

  Account: {
    async __resolveReference(account) {
      return await db.Account.findByPk(account.id);
    },
    async countries(account) {
      return await db.AccountCountry.findAll({
        where: { accountId: account.id },
        // attributes: ["id", "accountId", ["countryCode", "code"]],
      });
    },
  },

  AccountCountry: {
    async __resolveReference(accountCountry) {
      return await db.AccountCountry.findByPk(accountCountry.id);
    },
    country(accountCountry) {
      return { __typename: "Country", code: accountCountry.countryCode };
    },
  },
};
