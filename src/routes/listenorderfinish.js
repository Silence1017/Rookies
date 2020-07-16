const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var orderID=req.query.orderID;
    var destination=req.body.position;
    let tableName = "`Order`";

    await sequelize.query(`Select UserID From TokenUser where TokenUser.Value=${token} and exists (Select count(*) From TokenUser where Value=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else {
                let userID;
                userID = mes[0][0].UserID;
                await sequelize.query(`Select Status,fare from ${tableName} where OrderID=${orderID}`)
                .then(mes =>{
                    res.send(mes[0][0]);
                })
                //价格方面可能也有bug

            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router