var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');
//express가 제공하는 route 방식을 활용하면 각각의 처리하는 부분의 request와 response를 각각 구현하기 때문에
//필요한 것들이 잘 모여있다

router.get('/', function(req, res){
  if(req.user && req.user.displayName) {
    var title = 'HOME';
    var html = template.index_HTML(title, 
      `<h1>Hello, ${req.user.displayName}</h1>
      <a href="/user/upload">How about on your head now?</a>
      <a href="/auth/signout">Sign Out</a>`
    );//html
    res.send(html);
  }//if 
  else {
    var title = '';
    var html = template.index_HTML(title, 
      `<h1>Welcome</h1>
      <ul>
        <li><a href="/auth/signin">Sign IN</a></li>
        <li><a href="/auth/signup">Sign UP</a></li>
      </ul>
    `
    );//html
    res.send(html);
  }//else
  /* if(req.file){
    console.log(req.file);
  }//if */
}//function
);//router.get




module.exports = router;