var conn = require('../config/mysql/db')();
var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var multer = require('multer');
var path = require('path');
const { connect } = require('http2');

router.get('/upload', function(req, res){
    console.log('upload get');
    //deserializeUser으로인해서 세션에 담긴 값을 넘겨받을 수 있다. console.log(req.user.);
    //res.render('auth/signup',{errtext:'The username that already exists.'});
    res.render('user/upload');
    }//function
);//route.get

//이미지 처리를 위한 미들웨어 생성 파일 업로드를 담당하는 post 라우터에 미들웨어를 설정 
var storage = multer.diskStorage({
  destination:function(req, file, cd){
    cd(null, "public/images/");
  },//destination:function
  filename:function(req, file, cd){
    const ext = path.extname(file.originalname);
    cd(null, path.basename(file.originalname, ext) + "-" + `${Date.now()}.png`) //1970년 1월 1일 00:00:00(UTC)을 기점으로 현재 시간까지 경과한 밀리초를 숫자로 반환한다.
  },//filename:function
});//multer.diskStorage

var upload = multer({
  storage:storage
});//multer

//image는 input태그의 name 속성, 미들웨어 설정
router.post("/upload/create", upload.single('image'), function(req, res, next){

    var auth_id = req.user.authId;
    var username = req.user.username;
    var displayName = req.user.displayName;
    var title = req.body.title;
    var description = req.body.description;
    var image_file = req.file.filename;
    var image_original = Buffer.from(`/images/${req.file.filename}`,'latin1').toString('utf8');
    var area = req.body.area;
    var datas = [auth_id, username, displayName, title, description, image_original, image_file, area];//datas
    console.log(datas);

     var sql = "INSERT INTO users_img(authId, username, displayName, title, description, image_file, image_original, area) values(?,?,?,?,?,?,?,?)";
    conn.query(sql, datas, function(err, results){
      if(err){
        res.send(`<script>alert('upload error')</script>`);
        console.error("err : " + err);
      }//if
      else{
        console.log("results: " + JSON.stringify(results));
        res.send("<script>alert('upload success');location.href='/';</script>");
        //res.redirect('/');
      }//else
    }//function
    );//conn.query 
  }//function
);//route.post



module.exports = router;