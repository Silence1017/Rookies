const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.post('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.body.token);
    token = sequelize.escape(token);
    var orderID=req.body.orderID;
    let tableName = "`Order`";

    await sequelize.query(`Select UserID From TokenUser where TokenUser.Value=${token} and exists (Select count(*) From TokenUser where Value=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else {
                let userID,fare;
                userID = mes[0][0].UserID;
                await sequelize.query(`Select fare from ${tableName} where OrderID=${orderID}`)
                .then(async function(mes) {
                    fare=mes[0][0].fare;
                })
                console.log(fare);
                await sequelize.query(`update User set Balance=Balance-${fare},OrderProceeding=0 where UserID=${userID}`)
                .then(mes=>{
                    console.log(mes);
                })
                res.json({
                    status:"订单确定结束，费用已扣除"
                })
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router