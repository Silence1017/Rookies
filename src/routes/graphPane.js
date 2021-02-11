const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var arr = [];
    await sequelize.query(`SELECT count(*) From TokenAdministrator where Value=${token}`)     //检查令牌是否有效
        .then(async function (mes) {
            if (mes[0][0]['count(*)'] === 0) {
                res.send(label.NON_TOKEN);
            }
            else
            {
                await sequelize.query(`SELECT 0m,5m,15m,20m,25m,30m,35m,40m,45m,50m,55m FROM HourDetail WHERE HourID = 1`)
                    .then(function (mes) {
                        arr.push(mes[0]);
                    })

                await sequelize.query(`SELECT 0h,1h,2h,3h,4h,5h,6h,7h,8h,9h,10h,11h,12h,13h,14h,15h,16h,17h,18h,19h,20h,21h,22h,23h FROM TodayDetail WHERE TodayID = 1`)
                    .then(function (mes) {
                        arr.push(mes[0]);
                    })

                await sequelize.query(`SELECT Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday FROM WeekDetail WHERE WeekID = 1`)
                    .then(function (mes) {
                        arr.push(mes[0]);
                        res.send(arr);
                    })
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })


});

module.exports = router