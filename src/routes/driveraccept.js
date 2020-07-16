const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.headers.token);
    token = sequelize.escape(token);
    var orderID=req.headers.orderid;
    let tableName = "`Order`";

    await sequelize.query(`Select UserID From TokenUser where TokenUser.Value=${token} and exists (Select count(*) From TokenUser where Value=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else {
                let userID;
                userID = mes[0][0].UserID;
               await sequelize.query(`Select Status from ${tableName} where OrderID=${orderID}`)
               .then(mes=>{
                   if(mes[0][0].Status===0)
                   {
                        sequelize.query(`update ${tableName} set driverID = ${userID} where OrderID=${orderID}`);
                        sequelize.query(`update ${tableName} set status = 1 where OrderID=${orderID}`);
                        res.json({
                            "Status":"成功接单"    //现在先这样写吧，后续需要规范
                         });
                   }
                   else
                    res.json({
                        "Status":"订单已取消或者被其他司机接收"    //现在先这样写吧，后续需要规范
                     });
               })


            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router