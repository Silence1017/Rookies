const express = require('express');
const router = express.Router();
const lb = require('../config/index');
const sequelize = require('../config').dbConnect();

router.get('/', async (req, res) => {
    var label=lb.MESSAGE;
    var token = String(req.query.token);
    token = sequelize.escape(token);
    let tableName = "`Order`";

    await sequelize.query(`Select * From ${tableName}, TokenAdministrator Where TokenAdministrator.Value=${token} and exists (SELECT count(*) From TokenAdministrator where Value=${token})`)     //检查令牌是否有效
        .then(async function (mes) {
            if (mes[0].length === 0) {
                res.send(label.NON_TOKEN);
            }
            else
            {
                res.send(mes[0]);
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("服务器内部错误");
        })

});

module.exports = router