module.exports={
    dbConfig: require('./dbConfig'),
    dbConnect: require('./sequelize'),
    MESSAGE: {
        OK:{
            code:0,
            message:'请求成功',
        },
        NON_TOKEN:{
            code:1,
            message:'无效令牌',
        },
        REGISTER_SUCCESS:{
            code:100,
            message:'注册成功',
        },
        USER_EXIST:{
            code:101,
            message:'用户已存在',
        },
        PASSWORD_ERROR:{
            code:300,
            message:'密码错误',
        },
        USER_NOT_EXIST: {
            code: 404,
            message: '用户不存在',
        },
        AD_NOT_EXIST:{
            code:405,
            message:'管理员不存在',
        },
        NON_ORDER:{
            code:501,
            message:'无效订单ID',
        },
        NON_FEEDBACK:{
            code:501,
            message:'无效反馈ID',
        },
        NON_COUPON:{
            code:502,
            message:'无效优惠券ID',
        },
        NON_NOTICE:{
            code:503,
            message:'无效公告ID',
        }
    }
}
