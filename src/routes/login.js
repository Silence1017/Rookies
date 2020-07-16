const express = require('express');
var randomstring = require("randomstring");
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
   var UserMES;
   var userID;
   var records;
   var label=lb.MESSAGE;
   
   await sequelize.query('SELECT UserName, Password FROM User')
      .then(function (UserMes) {
         UserMES = UserMes;
      })

   await sequelize.query('SELECT COUNT(*) AS count FROM User')
      .then(function (record) {
         records = record;
      })

   let name = req.query.username;
   let password = req.query.password;

   let flag = 0;
   for (let i = 0; i < records[0][0].count; ++i) {
      if (UserMES[0][i].UserName === name) {
         if (UserMES[0][i].Password === password)
            flag = 1;
         else
            flag = 2;
      }
   
   }
   if (flag === 0)
      res.send(label.USER_NOT_EXIST);
   else if (flag === 1)
      {
         
         await sequelize.query(`SELECT UserID FROM User where UserName ='${name}'`)
            .then(function (mes) {
               userID=mes[0][0].UserID;
                //console.log(mes[0][0].UserID);
            })

         var token=randomstring.generate(15);
         await sequelize.query('SELECT Value From TokenUser') //避免token重复
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

         await sequelize.query(`INSERT INTO TokenUser(Value,UserID) VALUES( '${token}','${userID}')`)
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