const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var position=sequelize.escape(req.query.position);
    let tableName = "`Order`";

    await sequelize.query(`SELECT DISTINCT TokenUser.UserID, Status FROM TokenUser, User WHERE User.UserID=TokenUser.UserID 
        AND TokenUser.Value=${token}`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else {
                let userID,status;
                let orderID;
                userID = mes[0][0].UserID;
                status=mes[0][0].Status;
                sequelize.query(`update User set Location = ${position} where UserID = ${userID}`)
                if(status==="司机")
                {
                    await sequelize.query(`Select OrderID from ${tableName} where DriverID=${userID} and status=2`)
                    .then(mes=>{

                        orderID=mes[0][0].OrderID;
                    })
                    sequelize.query(`INSERT INTO Route(OrderID,Position) VALUES(${orderID}, ${position})`);
                    res.json({
                        status:"司机实时位置上传成功，订单已更新"
                    })
                }
                else
                {
                    res.json({
                        status:"乘客实时位置上传成功"
                    })
                }


            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router