var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);

var authRouter = require('./routes/auth')(passport);
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');


app.use('/', indexRouter);
app.use('/auth/', authRouter);
app.use('/user/', userRouter);

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
