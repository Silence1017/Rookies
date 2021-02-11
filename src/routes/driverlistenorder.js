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
                let userID;
                userID = mes[0][0].UserID;
                sequelize.query(`Select OrderID,Destination,Location from ${tableName},User where 
                Order.status = 0 and User.UserID = (Select Distinct PassengerID from ${tableName} where status = 0)`)
                .then(mes=>{
                    res.send(mes[0]);
                })

            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router