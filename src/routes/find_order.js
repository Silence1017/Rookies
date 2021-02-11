const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.post('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var position = sequelize.escape(req.query.position);
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
                                var pos = position.split(",");
                                await sequelize.query(`Select OrderID,PassengerID,UserName,Sex,PhoneNumber,StartPlace,Destination From ${tableName} a,User b where a.status = 0 and DriverID is NULL and a.PassengerID = b.UserID`)
                                    .then(async function (mes) {
                                        var distance = new Array();
                                        var sqlDistance = new Array();
                                        var longitude, latitude, minIndex = 0;
                                        for(var i, temp = 0; i < mes[0].length; i++) {
                                            sqldistance = mes[0][i].StartPlace.split(",");
                                            longitude = parseFloat(sqlDistance[0].substr(1));
                                            latitude = parseFloat(sqlDistance[1].slice(0, -1));
                                            distance[i] = Math.sqrt(Math.pow(longitude - parseFloat(pos[0]), 2) + Math.pow(latitude - parseFloat(pos[1]), 2));
                                            if(i == 0) {
                                                temp = distance[0];
                                            } else if(temp >= distance[i]) {
                                                minIndex = i;
                                            } else {
                                                continue; 
                                            }
                                        }
                                        res.send(mes[0][minIndex]);
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