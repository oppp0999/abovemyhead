var db = require('../lib/db');

module.exports = function (app) {

    var passport = require('passport'), //내부적으로 session을 사용하기 때문에 session 아래에 생성해야 됨
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize()); //passport 작동하게 설정함
    app.use(passport.session()); //passport가 내부적으로 session 미들웨어를 사용하므로 추가해줌

    passport.serializeUser(function (user, done) { //아래에서 사용자 데이터를 user로 받음 
        done(null, user.id);
        //그 데이터에서 사용자의 식별자 값(여기서는 email)을 추출해서
        //done을 호출하면 session data(이상한 이름의 파일)의 passport안에 있는 user의 값을 찾아간다.
        //SerializeUser는 login에 성공했을 때 성공했다 라는 사실을 session store에 저장하는 기능을 가진다.
        //그래서 login에 성공하면 SerializeUser가 딱 한번 호출되는 것을 로그 찍어보면 알 수 있다.
    });

    passport.deserializeUser(function (id, done) {
        var user = db.get('users').find({id:id}).value();
        done(null, user);
        //로그인에 성공한 다음에 어떤 페이지에 방문하면
        //그 사람이 로그인한 유저인지 판별해야 됨
        //그걸 체크할 때 passport는 serializeUser에서 저장한 데이터를 가지고
        //deserializeUser를 호출한다.
        //reload 혹은 다른 페이지를 들어갈 때마다 호출됨.
    });

    passport.use(new LocalStrategy( //login 성공, 실패를 판별해줌
        { //auth.js와 전송 형식을 맞추기 위해 객체를 만들어준 것임.(참고: http://www.passportjs.org/docs/ -> Form, Parameters)
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (email, password, done) {
            var user = db.get('users').find({
                email:email,
                password:password
            }).value();
            if(user) {
                return done(null, authData, {
                    message : 'Welcome'
                }); 
            } else {
                return done(null, false, {
                    message: 'Incorrect user information.'
                });
            } 
        }
    ));

    return passport; //외부에서 사용하기 위해 return
}