const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    
    await sequelize.query(`SELECT Administrator.AdministratorID,Adm_Name,Password,AdminType,CreateCoupon,ModifyCoupon,
        ModifyUser,CreateNotice,ModifyNotice FROM Administrator,TokenAdministrator a WHERE a.Value = ${token} and exists 
        (SELECT count(*) From TokenAdministrator where Value=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
                return;
            } else {
                res.send(mes[0]);
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })
});

module.exports = router
