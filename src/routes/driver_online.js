const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.headers.token);
    token = sequelize.escape(token);

    await sequelize.query(`Select UserID From TokenUser where TokenUser.Value=${token} and exists (Select count(*) From TokenUser where Value=${token})`)
            .then(async function (mes) {
                if (mes[0].length === 0) {
                    res.send(label.NON_TOKEN);
                }
                else
                    {   
                        let userID ;
                        userID=mes[0][0].UserID;
                        await sequelize.query(`Update User Set OrderProceeding = '1' where UserID = ${userID}`)
                        .then(function (mes) {
                            res.send('用户已经上线');
                        })
                    }
            })
            .catch((err) => {
                console.log(err);
                res.send("服务器内部错误");
            })
            
});

module.exports = router