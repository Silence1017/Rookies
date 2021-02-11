const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.post('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var adminID = sequelize.escape(req.query.adminID);
    var ModifyUser = sequelize.escape(req.body.ModifyUser);
    var CreateCoupon = sequelize.escape(req.body.CreateCoupon);
    var ModifyCoupon = sequelize.escape(req.body.ModifyCoupon);
    var CreateNotice = sequelize.escape(req.body.CreateNotice);
    var ModifyNotice = sequelize.escape(req.body.ModifyNotice);
    
    await sequelize.query(`Update Administrator Set ModifyUser = ${ModifyUser},CreateCoupon = ${CreateCoupon},
        ModifyCoupon = ${ModifyCoupon},CreateNotice = ${CreateNotice},ModifyNotice = ${ModifyNotice} Where 
        AdministratorID = ${adminID} and exists (SELECT count(*) From TokenAdministrator where Value=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
                return;
            } else {
                res.send(label.UPDATE_SUCCESS);
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })
});

module.exports = router
