const db = require('../config/Sequelize').dbConnect()

const User=db.import('./User')
const Administrator=db.import('./Administrator')

module.exports={
    User,
    Administrator
}