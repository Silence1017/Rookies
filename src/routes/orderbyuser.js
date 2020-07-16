const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.post('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.body.token);
    token = sequelize.escape(token);
    var now = sequelize.escape(req.body.now);
    var destination = sequelize.escape(req.body.destination);
    let tableName = "`Order`";

    await sequelize.query(`Select UserID From TokenUser where TokenUser.Value=${token} and exists (Select count(*) From TokenUser where Value=${token})`)
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else {
                let userID=mes[0][0].UserID;

                await sequelize.query(`Update User set Location = ${now} where UserID=${userID}`)
                .catch(err => {});
                
                await sequelize.query(`Insert into ${tableName}(PassengerID,Destination) Values(${userID},${destination}) `)
                .then(mes=>{
                    res.json({
                        "orderID": mes[0],
                        "Destination":destination,
                        "Status":0
                     });
                })


            }
        })
});

module.exports = router