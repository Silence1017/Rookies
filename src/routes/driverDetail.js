const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var driverID = sequelize.escape(req.query.driverID);
    let tableName = "`Order`";
    var arr = [];

    await sequelize.query(`Select User.UserID,UserName,Age,Sex,CreditScore,PhoneNumber,Address From User,Driver,
        TokenAdministrator Where TokenAdministrator.Value=${token} AND User.Status=0 AND User.UserID = Driver.UserID 
        and Driver.UserID = ${driverID} and exists (SELECT count(*) From TokenAdministrator where VALUE=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else
            {
                arr.push(mes[0]);
                await sequelize.query(`Select OrderID From ${tableName} Where Order.DriverID = ${driverID}`)
                .then(async function (mes) {
                    arr[0][0].HistoryOrder = mes[0];
                    res.send(arr);
                })
                
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })
});

module.exports = router