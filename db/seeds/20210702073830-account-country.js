const table = 'AccountCountry'
const date = new Date()
const data = [{
    id: '7065da16-fc2f-4593-9ff2-135bb662273a',
    accountId: '21c3571b-af28-46c4-88eb-d08558a8ce5d',
    countryCode: "276",
    createdAt: date,
    updatedAt: date
  }, {
    id: '2ace0f8a-bb0c-435c-b7a9-59e04f8e5ee4',
    accountId: '21c3571b-af28-46c4-88eb-d08558a8ce5d',
    countryCode: "100",
    createdAt: date,
    updatedAt: date
}]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(table, data, {})
  },
  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete(table, null, {})
  }
};
