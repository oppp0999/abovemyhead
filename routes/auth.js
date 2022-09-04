var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');
var ERRtext = require('../lib/errtext');
var shortid = require('shortid');



router.get('/signup', function(request, response){
    var feedback = '';
    ERRtext(request,response, feedback);
    var title = 'Sign UP';
    var map = '';
    var html = template.HTML(title, map, `
    <div style="color:red;>${feedback}</div>
        <form action="/auth/signup_process" method="post">
            <p><input type="text" name="email" placeholder="email" value=""></p>
            <p><input type="password" name="pwd" placeholder="password" value=""></p>
            <p><input type="password" name="pwd2" placeholder="password" value=""></p>
            <p><input type="text" name="displayName" placeholder=display name" value=""></p> 
            <p>
                <input type="submit" value="submit">
            </p>
        </form>
    `,'');//template.HTML

   response.send(html);
}//function
);//router.get

router.post('/signup_process', function(request, response){
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;

    if(pwd !== pwd2){
        request.flash('error','Password must same');
        response.redirect('/auth/signup');
    }//if
    else {
        var user = {
            id:shortid.generate(), //랜던 아이디 값 생성
            email:email,
            password:pwd,
            displayNameL:displayName
        }//user
        
    }//else

}//function
)//router.post