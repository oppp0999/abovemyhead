var express = require('express');
var app = express()
var session = require('express-session') //session을 사용하기 위해 필요한 미들웨어
//var FileStore = require('session-file-store')(session);//파일형식으로 저장하는 방법
var MySQLStore = require('express-mysql-session')(session);//MySQL 방식으로 세션 값을 저장하는 방법
var flash = require('connect-flash');


//MySQL session을 위한 접속 옵션을 설정
var options = {
    host:'localhost',
    port: 3306, //기본적인 mysql port
    user: 'root',
    password: 'mysqlroot',
    database: 'users_session'
  }//options
  
  
  //session-mysql
  app.use(session({ //session을 미들웨어로서 application에 설치해줌
      secret: 'asadlfkj!@#!@#dfgasdg', //required option
      resave: false, //false : 세션 데이터가 바뀌기 전까지는 세션 저장소의 값을 저장하지 않음, true : 값이 바뀌건 바뀌지 않건 계속 저장소에 저장을 함.
      saveUninitialized: true, //true : 세션이 필요하기 전까지는 세션을 구동하지 않는다. false : 세션이 필요하건 필요하지 않건 무조건 구동시킴 -> 서버에 부담을 준다.
      store:new MySQLStore(options)
    })//sessions
    );//app.use
    //내부적으로 request 객체의 property로 session이라는 객체를 추가해준다.(req.session을 보면 알 수 있음)
    //HttpOnly:true를 통해 자바스크립트를 통해서 session cookie를 사용할 수 없도록 강제할 수 있다.
  
  //리다이랙센에 대해서 다시 짜기 -_!_!_!_


app.use(flash()); //session을 내부적으로 사용하기 있기 때문에 session 다음에 설치해야함.