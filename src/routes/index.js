//目前该部分代码已经作废
const express = require('express');
const router = express.Router();
const sequelize = require('../config').dbConnect();

// 输出测试数据库中的id数量
router.get('/', async (req, res) => {
   // let res_string = "欢迎访问Rookie-team，当前有";
   
   // await sequelize.query('SELECT COUNT(*) AS count FROM User')
   //    .then(function (records) {
   //       res_string += records[0][0].count;
   //       res_string += '名用户';
   //    });

   // res.send(res_string);

   let mes='Username:<br>';
   await sequelize.query('SELECT UserName FROM User')
      .then(function(records){
         for(let i=0;i<records[0].length;i++)
         {
            mes +=records[0][i].UserName;
            mes +='<br>';
         }
      })

      res.send(mes);
});

module.exports = router



//目前该部分代码已经作废
