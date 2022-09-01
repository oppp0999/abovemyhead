var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');

//express가 제공하는 route 방식을 활용하면 각각의 처리하는 부분의 request와 response를 각각 구현하기 때문에
//필요한 것들이 잘 모여있다

router.get('/', function(request, response){
    //console.log('/', request.user);를 해보면 email, password, nickname이 나온다.
    //passport를 사용하지 않으면 request는 user 객체가 없다.
    //하지만 passport를 사용하면 passport가 request에 user 객체를 주입해줌
    //그러면 우리는 user의 값을 기준으로 사용자가 로그인 했는지 하지 않았는지를 체크할 수 있다.
    console.log('/', request.user);    
    //response.send('test');

    var fmsg = request.flash(); //일회성 메세지
    var feedback = '';
    if(fmsg.success){
        feedback = fmsg.success[0];
    }//if
    var map = '<img src="../img/map_gray.ai" style="width:300px display:block; margin-top:10px;">';

    var html = template.HTML(map,
        `<div style="color:blue;">${feedback}</div>`,
        auth.statusUI(request,response)
        );//html
    
}//function
)//router.get

module.exports = router;