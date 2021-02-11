const express = require('express');
var randomstring = require("randomstring");
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var ADMES;
    
    await sequelize.query('SELECT Adm_Name, Password FROM Administrator')
        .then(function (UserMes) {
            ADMES = UserMes;
        })
    let name = req.query.ADname;
    let password = req.query.password;
    let flag = 0;
    for (let i = 0; i < ADMES[0].length; ++i) {
        if (ADMES[0][i].Adm_Name === name) {
            if (ADMES[0][i].Password === password)
                flag = 1;
            else
                flag = 2;
        }
    }
    if (flag === 0)
        res.send(label.AD_NOT_EXIST);
    else if (flag === 1) {
        
        var ADID;
        await sequelize.query(`SELECT AdministratorID FROM Administrator where Adm_Name ='${name}'`)
            .then(function (mes) {
                ADID=mes[0][0].AdministratorID;
            })
        var token=randomstring.generate(15);
        await sequelize.query('SELECT Value From TokenAdministrator') //避免token重复
           .then(function(mes){
              for(let i=0;i<mes[0].length;i++)
              {
                 if(token===mes[0][i].Value)
                 {
                    token=randomstring.generate(15);
                    i=0; 
                 }
              }
           })
        await sequelize.query(`INSERT INTO TokenAdministrator(Value,AdministratorID) VALUES( '${token}','${ADID}')`)
     .catch(err => {
        console.log(err);
     });

        res.json({
        "token": token
        });
    }
    else if (flag === 2)
        res.send(label.PASSWORD_ERROR);

});

module.exports = router