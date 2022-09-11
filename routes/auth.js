module.exports = function(passport){
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password()
    var conn = require('../config/mysql/db')();
    var route = require('express').Router();
    var template = require('../lib/template');

    //기본적으로/auth 로 위임이 되어있기에 뺀다
    route.post('/signin',
      passport.authenticate(
        'local',
        {
            successRedirect: '/',
            failureRedirect: '/auth/signin',
            failureFlash: false
        }
      )//passport.authenticate
    );//route.post

    route.post('/signup', function(req, res){
      hasher({password:req.body.password}, function(err, pass, salt, hash){
        var user = {
          authId:'local:'+req.body.username,
          username:req.body.username,
          password:hash,
          salt:salt,
          displayName:req.body.displayName
        };//user
        var dir = __dirname;
        var sql = 'INSERT INTO users SET ?';
        conn.query(sql, user, function(err2, results){
            if(err2){
                console.log(err2);
                res.send(`
                <a href="/">Back</a>`
                +template.ERRPAGE('The username that already exists.'));
            }//if
            else {
                    //패스포트의 로그인함수 requset.login
                req.login(user, function(err){
                    req.session.save(function(){
                    res.redirect('/');
                    });//req.session.save
                });//req.signin
            }//else
        });//conn.query
    });//hasher
    });//route.post

    route.get('/signup', function(req, res){
        res.render('auth/signup');
      /* var sql = 'SELECT id,title FROM topic';
      conn.query(sql, function(err, topics, fields){
        res.render('auth/signup', {topics:topics});
      }); */
    });//route.get

    route.get('/signin', function(req, res){
        res.render('auth/signin');
      /* var sql = 'SELECT id,title FROM topic';
      conn.query(sql, function(err, topics, fields){
        res.render('auth/signin', {topics:topics});
      }); */
    });//route.get

    route.get('/signout', function(req, res){
      //패스포트의 로그아웃함수 requset.logout
      req.logout();
      req.session.save(function(){
        res.redirect('/');
      });
    });//route.get
    return route;
  }//module.exports