module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user',{
        'UserName': DataTypes.string(15),
        'Password': DataTypes.string(20),
    })
}
