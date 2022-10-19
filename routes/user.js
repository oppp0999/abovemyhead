var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var multer = require('multer');
var jimp = require('../lib/imgprocess_test');
const { connect } = require('http2');
var fs = require('fs');
var path = require ('path');
var AWS = require('aws-sdk');
var util = require ('../lib/util');
var db_util = require('../lib/db_util');
var file_util = require('../lib/file_util');




router.get('/upload' , function(req, res){
    console.log('upload get');
    //deserializeUser으로인해서 세션에 담긴 값을 넘겨받을 수 있다. console.log(req.user.);
    //res.render('auth/signup',{errtext:'The id that already exists.'});
    var forder_uid= req.user.uid;
    var dir = `/Users/kimheejae/Desktop/project/abovemyhead/workspace/assets/${forder_uid}`
    console.log(forder_uid);
    util.makeFolder(dir);

    res.render('user/upload');
    }//function
);//route.get

//이미지 처리를 위한 미들웨어 생성 파일 업로드를 담당하는 post 라우터에 미들웨어를 설정 
var storage = multer.diskStorage({
  destination:function(req, file, cd){
    cd(null, `assets/${req.user.uid}/images/raw/`);
  },//destination:function
  filename:function(req, file, cd){
    const ext = path.extname(file.originalname);
    var data_now = Date.now();
    cd(null, Buffer.from(`${path.basename(file.originalname, ext)}-${data_now}.png`,'latin1').toString('utf8'))//1970년 1월 1일 00:00:00(UTC)을 기점으로 현재 시간까지 경과한 밀리초를 숫자로 반환한다.
    console.log('storage');
  },//filename:function
});//multer.diskStorage

var upload = multer({
  storage:storage,
});//multer


//image는 input태그의 name 속성, 미들웨어 설정
router.post("/upload/create", upload.single('image') , (req, res) => {
  console.log(req.file);
  if(req.file == undefined){
    res.send(`<script>alert('image empty');location.href='/user/upload';</script></script>`);
  }
  else{
    var u_dir = `/Users/kimheejae/Desktop/project/abovemyhead/workspace/assets/${req.user.uid}`;
    file_util.resize(u_dir, req.file.filename);
    db_util.upload(req,res,util);
  }

}//function
);//route.post


router.get("/upload/create/ing", function(req,res){
  
  var uid = req.user.uid;
  var u_dir = `/Users/kimheejae/Desktop/project/abovemyhead/workspace/assets/${uid}`;
  console.log('ing get');

  var files;
  fs.readdir(`${u_dir}/images/raw/`, (err, results) => {
    files = results.slice();
    console.log(files, files.length);
    var i = 0;
    while(i<files.length){
      if(files[i].includes('resize_')){
        console.log('resize file check ok');
        if(util.imgfiles_raw(u_dir, files[i])){
          
          jimp.img_processing(u_dir, files[i], res);
        }//if
      }//if
      i++;
    }//while
  });//readdir
  //res.render('user/loadding');
}//function
);//router.get


module.exports = router;