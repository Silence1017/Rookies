const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
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
                await sequelize.query(`Select OrderID,status from ${tableName} where PassengerID =${userID} and Status != 2`)
                    .then(async function (mes) {
                        orderID=mes[0][0].OrderID;
                        if (mes[0][0].Status === 0)
                            res.send(mes[0][0]);
                        else {
                            
                            await sequelize.query(`SELECT OrderID,a.status,UserID,UserName,Sex,PhoneNumber,Location FROM ${tableName} a,User b WHERE UserId=(SELECT DriverID FROM ${tableName} WHERE OrderID=${orderID})`)
                                .then(mes => {
                                    res.send(mes[0][0]);
                                }
                                );
                        }
                    }
                    )
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router