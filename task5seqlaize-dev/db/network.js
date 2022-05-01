const sequelize= require("sequelize")
require("dotenv").config();
const db = new sequelize('userstore','anmol', 'Java@1234', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
      timestamps: false
  } 
  });
  db.authenticate().then(() => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Error: ' + err);
})
module.exports = db;