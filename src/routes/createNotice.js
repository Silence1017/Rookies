const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.post('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var noticeTitle = sequelize.escape(req.body.noticeTitle);
    var startTime = sequelize.escape(req.body.startTime);
    var endTime = sequelize.escape(req.body.endTime);
    var noticeContent = sequelize.escape(req.body.noticeContent);
    var Description = sequelize.escape(req.body.Description);
    
    await sequelize.query(`SELECT count(*) From TokenAdministrator where Value=${token}`)
        .then(async function (mes) {
            if (mes[0][0]['count(*)'] === 0) {
                res.send(label.NON_TOKEN);
            }
            else{
                await sequelize.query(`INSERT INTO Notice(noticeTitle,startTime,endTime,noticeContent,Description) VALUES(${noticeTitle},${startTime},${endTime},${noticeContent},${Description})`)
                .then(mes =>{
                    res.json({
                        noticeID:mes[0]
                    })
                });
            }
        })

});

module.exports = router