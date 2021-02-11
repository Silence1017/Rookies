const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    
    await sequelize.query(`Select User.UserID,Sex,Balance,Status,PhoneNumber From User, TokenUser Where TokenUser.Value=${token} 
        and User.UserID=TokenUser.UserID and exists (SELECT count(*) From TokenUser where Value=${token})`)     //检查令牌是否有效
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else
            {
                res.send(mes[0][0]);
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })
});

module.exports = router