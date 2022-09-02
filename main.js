var express = require('express');
var app = express()
var session = require('express-session') //session을 사용하기 위해 필요한 미들웨어
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');


////-----오류
app.use(session({ //session을 미들웨어로서 application에 설치해줌
    secret: 'asadlfkj!@#!@#dfgasdg', //required option
    resave: false, //false : 세션 데이터가 바뀌기 전까지는 세션 저장소의 값을 저장하지 않음, true : 값이 바뀌건 바뀌지 않건 계속 저장소에 저장을 함.
    saveUninitialized: true, //true : 세션이 필요하기 전까지는 세션을 구동하지 않는다. false : 세션이 필요하건 필요하지 않건 무조건 구동시킴 -> 서버에 부담을 준다.
    store:new FileStore()
  })//session
  );//app.use
  //내부적으로 request 객체의 property로 session이라는 객체를 추가해준다.(req.session을 보면 알 수 있음)
  //HttpOnly:true를 통해 자바스크립트를 통해서 session cookie를 사용할 수 없도록 강제할 수 있다.

app.use(flash()); //session을 내부적으로 사용하기 있기 때문에 session 다음에 설치해야함.

var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');


app.use('/', indexRouter);
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
