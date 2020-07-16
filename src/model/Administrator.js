module.exports = (sequelize, DataTypes) => {
    return sequelize.define('administrator',{
        'ADID': DataTypes.string(15),
        'Password': DataTypes.string(20),
    })
}
