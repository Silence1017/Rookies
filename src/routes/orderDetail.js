const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    let orderID=req.query.orderID;
    let tableName = "`Order`";
    let tim="`When`";

    await sequelize.query(`Select Order.OrderID,DriverID,PassengerID,Fare,${tim},Position From ${tableName},Route, TokenAdministrator Where TokenAdministrator.Value=${token} and Order.OrderID=${orderID} and Route.OrderID =${orderID} and exists (SELECT count(*) From TokenAdministrator where Value=${token}) order by Route.When`)     //检查令牌是否有效
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else
            {
                res.send(mes[0]);
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })


});

module.exports = router