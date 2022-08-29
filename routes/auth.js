var express = require('express');
var router = express.Router(); 
var template = require('../lib/template.js');
var shortid = require('shortid'); 
var db = require('../lib/db');
module.exports = function(passport) {
    router.get('/login', function (request, response) {
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error){
            feedback = fmsg.error[0];
        }
        var title = 'WEB - login';
        var list = template.list(request.list);
        var html = template.HTML(title, list, `
        <div style="color:red;>${feedback}</div>
            <form action="/auth/login_process" method="post">
                <p><input type="text" name="email" placeholder="email"></p>
                <p><input type="password" name="pwd"
                placeholder="password"></p>
                <p>
                    <input type="submit" value="login">
                </p>
            </form>
            `, '');
        response.send(html);
    });
    
    router.post('/login_process', // /auth/login_process로 인증정보를 보냈을 때 어떻게 처리할 것인지
      passport.authenticate('local', { //passport의 로그인 방식 중 local 방식을 사용하겠다.
        successRedirect: '/', //성공했을 때는 Home으로
        failureRedirect: '/auth/login', //실패했을 때는 다시 로그인 페이지로 보내기
        failureFlash:true,
        successFlash:true
    }));

    router.get('/register', function (request, response) {
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error){
            feedback = fmsg.error[0];
        }
        var title = 'WEB - login';
        var list = template.list(request.list);
        var html = template.HTML(title, list, `
        <div style="color:red;>${feedback}</div>
            <form action="/auth/register_process" method="post">
                <p><input type="text" name="email" placeholder="email" value="egoing@gmail.com"></p>
                <p><input type="password" name="pwd" placeholder="password" value="111111"></p>
                <p><input type="password" name="pwd2" placeholder="password" value="111111"></p>
                <p><input type="text" name="displayName" placeholder=display name" value="egoing"></p> 
                <p>
                    <input type="submit" value="register">
                </p>
            </form>
            `, '');
        response.send(html);
    });
    
    router.post('/register_process', function (request, response) {
        var post = request.body;
        var email = post.email;
        var pwd = post.pwd;
        var pwd2 = post.pwd2;
        var displayName = post.displayName;
        if(pwd !== pwd2) {
            request.flash('error', 'Password must same!');
            response.redirect('/auth/register');
        } else {
            var user = {
                id:shortid.generate(),//랜덤한 아이디 값이 생성됨
                email:email,
                password:pwd,
                displayName:displayName
            }
            db.get('users').push(user).write(); //입력 받은 정보를 db에 추가해줌
            request.login(user, function(err) {
                return response.redirect('/'); // 회원가입하고 바로 로그인 되도록 하는 방법
            })
            response.redirect('/');
        }
    });

    router.get('/logout', function (request, response) {
        request.logout(); //passport의 로그아웃을 하고
        request.session.save(function() {
            response.redirect('/');
        });
    });

    return router;
}