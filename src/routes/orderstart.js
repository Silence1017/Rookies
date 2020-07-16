const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.headers.token);
    token = sequelize.escape(token);
    var orderID=req.headers.orderid;
    var position=sequelize.escape(req.headers.position);

    console.log('1');
    let tableName = "`Order`";
    await sequelize.query(`Select UserID From TokenUser where TokenUser.Value=${token} and exists (Select count(*) From TokenUser where Value=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else {
                let userID;
                console.log('2');
                userID = mes[0][0].UserID;
                sequelize.query(`update ${tableName} set Status = 2, Startplace = ${position} where OrderID=${orderID}`)//Status 1订单
                .then(mes=>{
                    console.log('3');
                    res.json({
                        status:"订单开始进行"
                    })
                })
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router