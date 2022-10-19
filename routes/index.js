var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');
var util = require('../lib/util');
var db_util = require('../lib/db_util');
var path = require('path');
var file_util = require('../lib/file_util');
//express가 제공하는 route 방식을 활용하면 각각의 처리하는 부분의 request와 response를 각각 구현하기 때문에
//필요한 것들이 잘 모여있다

var while_newly = async function (){
  var i = 1;
  while(i<17){
    await db_util.newly(i);
    i++;
  };
}

router.get('/', async function(req, res){
  while_newly();

  var filePath = path.join(__dirname, '../data', 'map_icon_random.json');
  var stn = 'st1';
  file_util.read_exportFile(filePath, stn);

  let location;
  if (typeof document !== "undefined") {
    location = window.document.location;
  }
  console.log(`location(index) : ${location}`);

  if(req.user && req.user.displayName) {
    var title = 'HOME';
    var html = template.index_HTML(title, 
      `<h1>Hello, ${req.user.displayName}</h1>
      <a href="/user/upload">How about on your head now?</a>
      <a href="/auth/signout">Sign Out</a>`,{st1:`<img src="../lib/img/icon2.png">`}
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