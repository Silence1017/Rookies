const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.post('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var couponAmount = sequelize.escape(req.body.couponAmount);
    var couponStartTime = sequelize.escape(req.body.couponStartTime);
    var couponDeadline = sequelize.escape(req.body.couponDeadline);
    var couponCrowd = sequelize.escape(req.body.couponCrowd);
    var couponNumber = sequelize.escape(req.body.couponNumber);
    var Description = sequelize.escape(req.body.Description);
    
    await sequelize.query(`SELECT count(*) From TokenAdministrator where Value=${token}`)
        .then(async function (mes) {
            if (mes[0][0]['count(*)'] === 0) {    //注意此处不能用mes[0].length===0
                res.send(label.NON_TOKEN);
            }
            else{
                await sequelize.query(`INSERT INTO Coupon(couponAmount,couponStartTime,couponDeadline,couponCrowd,couponNumber,Description) VALUES(${couponAmount},${couponStartTime},${couponDeadline},${couponCrowd},${couponNumber},${Description})`)
                .then(mes =>{
                    res.json({
                        couponID:mes[0]
                    })
                });
            }
        })

});

module.exports = router