const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    let couponID=req.query.couponID;

    await sequelize.query(`SELECT count(*) From TokenAdministrator where Value=${token}`)     //检查令牌是否有效
        .then(async function (mes) {
            if (mes[0][0]['count(*)'] === 0) {
                res.send(label.NON_TOKEN);
            }
            else
            {
                await sequelize.query(`SELECT couponID,couponAmount,couponStartTime,couponDeadline,couponCrowd,couponNumber,couponUsedNumber From Coupon where CouponID=${couponID}`)
                    .then(async function(mes){
                        if(mes[0].length!=0)
                            res.send(mes[0]);
                        else
                            res.send(label.NON_COUPON);
                    })
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })


});

module.exports = router