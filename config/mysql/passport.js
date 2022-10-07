module.exports = function(app){
  var fs = require('fs');
  var path = require('path');
  //var ciqlJson = require('ciql-json')
  var conn = require('./db')();
  var bkfd2Password = require("pbkdf2-password");
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  //var FacebookStrategy = require('passport-facebook').Strategy;
  var hasher = bkfd2Password();
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
  });//passport.serrializeUser

  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function(err, results){
      if(err){
        console.log(err);
        done('There is no user.');
      }//if 
      else {
        done(null, results[0]);
      }//else
    });//conn.query
  });//passport.deserializeUser

  passport.use(new LocalStrategy(
    function(username, password, done){
      var uname = username;
      var pwd = password;
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, ['local:'+uname], function(err, results){
        if(err){
          return done('There is no user.');
        }
        var user = results[0];
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            /* var filepath = path.join(__dirname,'../../data', 'user_info.json');
            var filedata = fs.readFileSync(filepath);
            var user_info = JSON.parse(filedata); */
            //user_info.push(user.authId, user.username, user.displayName);
            //fs.writeFileSync(filepath, JSON.stringify(user_info));
/*               ciqlJson
                  .open('data/user_info.json')
                  .set('user_info', {auth_id: user.authId, displayName: user.displayName})
                  .save()
*/
            done(null, user);
          }//if 
          else {
            done(null, false);
          }//else
        }//hasher
        );//conn.query
      });//function
    }//LocalStrategy
  ));//passport.use
  return passport;
}//module.exports