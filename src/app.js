const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

const config = require('./config');
const sequelize = require('./config').dbConnect();

var app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/Alogin',require('./routes/Alogin'));
app.use('/Per_Information',require('./routes/Per_Information'));
app.use('/userList',require('./routes/userList'));
app.use('/userDetail',require('./routes/userDetail'));
app.use('/orderList',require('./routes/orderList'));
app.use('/orderDetail',require('./routes/orderDetail'));

//诗云前端
app.use('/driver_online',require('./routes/driver_online'));
app.use('/orderbyuser',require('./routes/orderbyuser'));
app.use('/userlistenorder',require('./routes/userlistenorder'));
app.use('/driverlistenorder',require('./routes/driverlistenorder'));
app.use('/driveraccept',require('./routes/driveraccept'));
app.use('/orderstart',require('./routes/orderstart'));
app.use('/updatepos',require('./routes/updatepos'));
app.use('/orderend',require('./routes/orderend'));
app.use('/listenorderfinish',require('./routes/listenorderfinish'));
app.use('/comfirmorderend',require('./routes/comfirmorderend'));

//宇豪前端
app.use('/feedback',require('./routes/feedback'));
app.use('/HistoricalFeedback',require('./routes/HistoricalFeedback'));

//罗某后续添加
app.use('/feedbackList',require('./routes/feedbackList'));
app.use('/feedbackDetail',require('./routes/feedbackDetail'));
app.use('/createCoupon',require('./routes/createCoupon'));
app.use('/couponList',require('./routes/couponList'));
app.use('/couponDetail',require('./routes/couponDetail'));
app.use('/createNotice',require('./routes/createNotice'));
app.use('/noticeList',require('./routes/noticeList'));
app.use('/noticeDetail',require('./routes/noticeDetail'));
app.use('/AdministratorList',require('./routes/AdministratorList'));


var CronJob = require('cron').CronJob;
new CronJob('0 0 0 * * *', function() {
    sequelize.query(`DELETE FROM TokenUser WHERE CURRENT_TIMESTAMP - CreateDate > 3600;`)
    sequelize.query(`DELETE FROM TokenAdministrator WHERE CURRENT_TIMESTAMP - CreateDate > 3600;`)
    console.log("The token is updated daily!!!");
}, null, true);

var server = app.listen(8080, function () {

    var host = server.address().address || 'localhost';
    var port = server.address().port;
 
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});

module.exports = app