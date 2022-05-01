const sequelize = require('../db/network')
const { Sequelize } = require("sequelize")
const addressData = sequelize.define('address', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userid: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    address: { type: Sequelize.STRING },
    city: { type: Sequelize.STRING },
    state: { type: Sequelize.STRING },
    phonenumber: { type: Sequelize.INTEGER },
    pincode: { type: Sequelize.INTEGER }

});
addressData.sync();
module.exports = addressData;

