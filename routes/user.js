var conn = require('../config/mysql/db')();
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
  storage:storage
});//multer


//image는 input태그의 name 속성, 미들웨어 설정
router.post("/upload/create", upload.single('image') ,(req, res) => {
  console.log(req.file);
  if(req.file == undefined){
    res.send(`<script>alert('image empty');location.href='/user/upload';</script></script>`);
  }
  else{
    readData(req,res);
  }

}//function
);//route.post

/* router.get("/upload/create/", function(req,res){
  res.write(`<img src="../lib/img/Loadding.gif"`);
  res.end();
}); */

router.get("/upload/create/ing", function(req,res){
  var uid = req.user.uid;
  var u_dir = `/Users/kimheejae/Desktop/project/abovemyhead/workspace/assets/${uid}`;
  console.log('ing get');


  var files;
  fs.readdir(`${u_dir}/images/raw/`, (err, results) => {
    files = results.slice();
    console.log(files);
    if(util.imgfiles(u_dir, files)){
     jimp.img_processing(u_dir, files, res);
    }//if
  });//readdir

  //res.render('user/loadding');
}//function
);//router.get


//비동기로 접속하지만 파라미터를 2개 추가하여 테스트에서 문제가 발생할 수 있다.... 분리된 모듈은 웹서버에 의존성을 가지기에 테스트가 불가능함... 콜백으로 다시 재 구성해야함.
var readData = function(req, res) {
    var auth_id = req.user.authId;
    var uid = req.user.uid;
    var displayName = req.user.displayName;
    var title = req.body.title;
    var description = req.body.description;
    var image_file = req.file.filename;
    var image_original = Buffer.from(`images/${req.file.filename}`,'latin1').toString('utf8');
    var area = req.body.area;
    var datas = [auth_id, uid, displayName, title, description, image_original, image_file, area];//datas
    console.log(datas);
    var sql = "INSERT INTO users_img(authId, uid, displayName, title, description, image_file, image_original, area) values(?,?,?,?,?,?,?,?)";
    conn.query(sql, datas, function(err, results){
      if(err){
        res.send(`<script>alert('upload error');location.href='/user/upload';</script></script>`);
        console.error("err : " + err);
      }//if
      else{
        console.log("results: " + JSON.stringify(results));
        res.send(`<script>location.href='/user/upload/create/ing';</script>`);
        //res.redirect('/');
      }//else
    }//function
    );//conn.query 
}//readData
module.exports = router;