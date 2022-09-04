var express = require('express');
var app = express()
var session = require('express-session') //session을 사용하기 위해 필요한 미들웨어
//var FileStore = require('session-file-store')(session);//파일형식으로 저장하는 방법
var MySQLStore = require('express-mysql-session')(session);//MySQL 방식으로 세션 값을 저장하는 방법
var flash = require('connect-flash');

var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use(function(req, res, next) {//404 error 처리하는 미들웨어
    res.status(404).send('Sorry cant find that!');
  }//function
);//app.use


//error handling middleware
app.use(function(err, req, res, next) { //err에는 next를 통해서 전달받을 error 데이터가 담김
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });



app.listen(3000, function(){
    console.log('listen -> port 3000');
    } //function
);//app.listen
