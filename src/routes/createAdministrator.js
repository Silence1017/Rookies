const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.post('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    var ADname = sequelize.escape(req.body.ADname);
    var password = sequelize.escape(req.body.password);
    var AdminType = sequelize.escape(req.body.AdminType);
    
    await sequelize.query(`SELECT count(*) From TokenAdministrator where Value=${token}`)
        .then(async function (mes) {
            if (mes[0][0]['count(*)'] === 0) {
                res.send(label.NON_TOKEN);
            }
            else{
                await sequelize.query(`SELECT AdminType From Administrator a where a.AdministratorID = 
                    (SELECT AdministratorID From TokenAdministrator where VALUE = ${token})`)
                    .then(async function (mes) {
                        if(mes[0][0][AdminType] === 0) {
                            res.send(label.AD_NOT_SUPER);
                        }
                        else{
                            await sequelize.query(`INSERT INTO Administrator(Adm_Name,Password,AdminType) 
                                VALUES(${ADname},${password},${AdminType})`)
                                .then(res.send(label.ADD_SUCCESS));
                        }
                    })
            }

        }).catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })
    })

module.exports = router