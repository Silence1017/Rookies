const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
   var E_UserName;
   var records;
   var label=lb.MESSAGE;

   await sequelize.query('SELECT UserName FROM User')
      .then(function (UserN) {
         E_UserName = UserN[0];
      })

   await sequelize.query('SELECT COUNT(*) AS count FROM User')
      .then(function (record) {
         records = record[0][0].count;
      })
   let name = sequelize.escape(req.query.r_username);
   let pwd = sequelize.escape(req.query.r_password);
   let sex = req.query.sex;
   let status = req.query.status;
   let phonenumber = req.query.phonenumber;
   let flag = 0;

   await sequelize.query(`INSERT INTO User(UserName,PassWord,Sex,Balance,status,phonenumber) VALUES(${name}, ${pwd},'${sex}','0','${status}','${phonenumber}')`)
      .catch(err => {
         flag = 1;
         res.send(label.USER_EXIST);
         console.log(name,pwd);
      });
   if (flag === 0)
      res.send(label.REGISTER_SUCCESS);
});

module.exports = router