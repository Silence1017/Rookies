const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    let noticeID=req.query.noticeID;

    await sequelize.query(`SELECT count(*) From TokenAdministrator where Value=${token}`)
        .then(async function (mes) {
            if (mes[0][0]['count(*)'] === 0) {
                await sequelize.query(`Select UserID From TokenUser where TokenUser.Value=${token} and exists 
                    (Select count(*) From TokenUser where Value=${token})`)
                    .then(async function (mes) {
                        if (mes[0].length === 0) {
                            res.send(label.NON_TOKEN);
                        }
                        else
                        {
                            await sequelize.query(`SELECT noticeID,noticeTitle,noticeContent,startTime From Notice where noticeID=${noticeID}`)
                                .then(async function(mes){
                                    if(mes[0].length!=0)
                                        res.send(mes[0]);
                                    else
                                        res.send(label.NON_NOTICE);
                                })
                        }
                    })
            }
            else
            {
                await sequelize.query(`SELECT noticeID,noticeTitle,noticeContent,startTime From Notice where noticeID=${noticeID}`)
                    .then(async function(mes){
                        if(mes[0].length!=0)
                            res.send(mes[0]);
                        else
                            res.send(label.NON_NOTICE);
                    })
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router