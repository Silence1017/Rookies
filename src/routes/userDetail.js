const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var userID=req.query.userID;
    let tableName = "`Order`";

    //console.log(userID);
    await sequelize.query(`Select UserID,UserName,Sex, Balance,'Status',PhoneNumber From User Where userID = ${userID} and exists (SELECT count(*) From TokenAdministrator where Value=${token})`)
            .then(async function (mes) {
                if (mes[0].length === 0) {
                    res.send(label.NON_TOKEN);
                }
                else
                {
                    var orderID;
                    await sequelize.query(`Select orderID From ${tableName} where DriverID = ${mes[0][0].UserID} or PassengerID =${mes[0][0].UserID}`)
                    .then(async function(mess){
                        orderID=mess[0];
                    })
                    //添加orderID的数组
                    mes[0][0].orderID=orderID;
                    //res.json(mes[0]);
                    res.send(mes[0][0]);
                }
            })
            .catch((err) => {
                console.log(err);
                res.send("服务器内部错误");
            })
});

module.exports = router