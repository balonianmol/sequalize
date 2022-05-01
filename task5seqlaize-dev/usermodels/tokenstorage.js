const sequelize = require('../db/network')
const { Sequelize } = require("sequelize")
const tokenstorage = sequelize.define('tokenstorage', {
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
    token: { type: Sequelize.STRING },


});
tokenstorage.sync();
module.exports=tokenstorage;