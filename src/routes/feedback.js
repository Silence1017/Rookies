const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.post('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.body.token);
    token = sequelize.escape(token);
    var title = sequelize.escape(req.body.title);
    var content = sequelize.escape(req.body.content);

    await sequelize.query(`Select UserID From TokenUser where TokenUser.Value=${token} and exists (Select count(*) From TokenUser where Value=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else {
                let userID=mes[0][0].UserID;

                await sequelize.query(`INSERT INTO Feedback(UserID,Title,content) VALUES(${userID}, ${title},${content})`)
                .then(mes =>{
                    //var feedbackID=mes[0];
                    res.json({
                        feedabckID:mes[0]
                    })
                });
               

            }
        })
});

module.exports = router