var express = require('express')
var app = express()
var fs = require('fs');
var compression = require('compression');
var bodyParser = require('body-parser');
var helmet = require('helmet'); 
var session = require('express-session') //session을 사용하기 위해 필요한 미들웨어
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');
var db = require('./lib/db');

//미들웨어는 순차적으로 실행됨
app.use(express.static('public'));//public 디렉토리 안에서 static 파일을 찾겠다 라는 뜻
//form data는 이걸 사용하면됨.
app.use(bodyParser.urlencoded({ 
  extended: false
})); //실행되면서 결과로 미들웨어가 들어옴
app.use(compression()); //웹서버가 웹브라우저에게 응답할 때 그 데이터를 압축하는 것
app.use(helmet());//보안 관련 단골 손님 알아서 해결해줌
app.use(session({ //session을 미들웨어로서 application에 설치해줌
  secret: 'asadlfkj!@#!@#dfgasdg', //required option
  resave: false, //false : 세션 데이터가 바뀌기 전까지는 세션 저장소의 값을 저장하지 않음, true : 값이 바뀌건 바뀌지 않건 계속 저장소에 저장을 함.
  saveUninitialized: true, //true : 세션이 필요하기 전까지는 세션을 구동하지 않는다. false : 세션이 필요하건 필요하지 않건 무조건 구동시킴 -> 서버에 부담을 준다.
  store:new FileStore()
}));//내부적으로 request 객체의 property로 session이라는 객체를 추가해준다.(req.session을 보면 알 수 있음)
//HttpOnly:true를 통해 자바스크립트를 통해서 session cookie를 사용할 수 없도록 강제할 수 있다.

app.use(flash()); //session을 내부적으로 사용하고 있기 때문에 session 다음에 설치해야됨

var passport = require('./lib/passport')(app); //이런식으로 app이란 인자를 passport.js에 넘겨줄 수 있다.


app.get('*', function(request, response, next){ //get 방식으로 들어오는 요청에 대해서만 file 목록을 가져옴
  request.list = db.get('topics').value(); //이건 모든 값을 가져오는거, 실제 사용할 때에는 .take(100) 이런 식으로 제한을 둬야함
  next(); //그 다음에 호출되어야 할 미들웨어가 담기게 됨.
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter); // /topic으로 시작되는 주소들에게 topicRouter라는 middleware를 적용하겠다 라는 뜻
// 여기서 이미 /topic을 대상으로 호출했기 때문에 topic.js에서 /topic을 붙일 필요 없음
app.use('/auth', authRouter);

app.use(function(req, res, next) {//404 error 처리하는 미들웨어
  res.status(404).send('Sorry cant find that!');
});

//error handling middleware
app.use(function(err, req, res, next) { //err에는 next를 통해서 전달받을 error 데이터가 담김
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000');
});