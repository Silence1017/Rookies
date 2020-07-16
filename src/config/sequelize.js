const Sequelize=require('sequelize');

const DB=require('./dbConfig')

module.exports = function(){
    return new Sequelize('Message', DB.USER, DB.PASSWORD,
    {
        dialect: DB.dialect,
        host: DB.HOST,
    })
}