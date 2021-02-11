const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.post('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.body.token);
    token = sequelize.escape(token);
    var destination=req.body.position;
    let tableName = "`Order`";

    await sequelize.query(`Select UserID From TokenUser where TokenUser.Value=${token} and exists 
        (Select count(*) From TokenUser where Value=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else {
                let userID,orderID;
                userID = mes[0][0].UserID;
                await sequelize.query(`Select OrderID from ${tableName} where DriverID=${userID} and status=2`)
                    .then(mes=>{
                        orderID=mes[0][0].OrderID;
                    })


                    //若没有找到status为2的订单会怎么办呢？下次再说吧
                    console.log(orderID);


                    //不会写计算价格的算法····又留下一个坑
                sequelize.query(`update ${tableName} set fare=123，status=3,Destination='${destination}' where OrderID = ${orderID}`);
                sequelize.query(`INSERT INTO Route(OrderID,Position) VALUES(${orderID}, '${destination}')`);
                res.json({
                    fare:123,  //不会写计算价格的算法····又留下一个坑
                    status:"订单结束"
                })


                //目前司机结束订单后状态为发生改变，需要用上线API告诉系统可以进行下一单

            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router