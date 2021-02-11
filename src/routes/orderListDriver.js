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
            else
            {
                var userID = mes[0][0].UserID;
                await sequelize.query(`Select Status From User where UserID = ${userID} and Status = 0`)
                    .then(async function (mes) {
                        if (mes[0].length === 0) {
                            res.send(label.DR_NOT_SUPER);
                        }
                        else
                        {
                            await sequelize.query(`Select * From ${tableName} where DriverID = ${userID}`)
                                .then(async function (mes) {
                                    res.send(mes[0]);
                                })
                        }
                    })
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router