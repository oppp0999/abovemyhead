module.exports = function(){
    var express = require('express');
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var bodyParser = require('body-parser');
    var app = express()

    app.set('views', __dirname+'/views'); //view/mysql 지정
    //console.log('views ../../views/mysql');
    app.set('view engine', 'jade'); //제이드로 저장하는 방식

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({
        secret: '1234DSFs@adf1234!@#$asd',
        resave: false,
        saveUninitialized: true,
        store:new MySQLStore({
            host:'localhost',
            port:3306,
            user:'root',
            password:'mysqlroot',
            database:'users_info'
    })//MySQLStore
  })//session
  );//app.use
  return app;
}//module.exports