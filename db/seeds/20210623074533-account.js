const table = 'Account'
const date = new Date()
const data = [{
    id: '017915ef-d8d3-443a-b847-6d499996f669',
    email: 'master@yara.com',
    password: '$2b$10$sbdr1rHbPLeP7w/cwMlceOF9QJvQkQfpRIj8OROBg2LYlk7lqL/TW',
    active: true,
    role: 'master',
    admin_id: null,
    createdAt: date,
    updatedAt: date
  }, {
    id: '8fa0fb79-476a-405d-bfdb-51288d577f2e',
    email: 'max@yara.com',
    password: '$2b$10$2Fu1.kuOSd.ABWIfJqcWO.BSb9Kj9Dz3m8Emwy3tSMbJejK8Ng5am',
    active: false,
    role: 'admin',
    admin_id: null,
    createdAt: date,
    updatedAt: date
  }, {
    id: '5588fbf9-08ed-44c5-82a7-9e147dc737db',
    email: 'john@yara.com',
    password: '$2b$10$o7QQBNMoL5XaVsjxMOFfdup8STCL5MFv9t0R3S1k.iMq.2LBxcylW',
    active: false,
    role: 'admin',
    admin_id: null,
    createdAt: date,
    updatedAt: date
  }, {
    id: '21c3571b-af28-46c4-88eb-d08558a8ce5d',
    email: 'bob@yara.com',
    password: '$2b$10$cZsirnlIoPzwyWT9p1oDnOlayWbCNh.3h99nUXdxEMLSiNYenN67q',
    active: false,
    role: 'admin',
    admin_id: null,
    createdAt: date,
    updatedAt: date
  }, {
    id: '11a3671c-ae82-4ac4-80ea-d08448e8ce5e',
    email: 'alice@yara.com',
    password: '$2b$10$YjqV38hXkTQE1V1tF56woe5le128JTB7EONYtkaOl8e82nt.La5y6',
    active: false,
    role: 'admin',
    admin_id: null,
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
}
