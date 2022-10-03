var conn = require('../config/mysql/db')();
var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var multer = require('multer');
//var jimp = require('../lib/imgprocess_test');
var Jimp = require('jimp');
const { connect } = require('http2');
var fs = require('fs');
var path = require ('path');
var AWS = require('aws-sdk');

router.get('/upload', function(req, res){
    console.log('upload get');
    //deserializeUser으로인해서 세션에 담긴 값을 넘겨받을 수 있다. console.log(req.user.);
    //res.render('auth/signup',{errtext:'The username that already exists.'});
    res.render('user/upload');
    }//function
);//route.get

//이미지 처리를 위한 미들웨어 생성 파일 업로드를 담당하는 post 라우터에 미들웨어를 설정 
/* var storage = multer.diskStorage({
  destination:function(req, file, cd){
    cd(null, "assets/images/raw/");
  },//destination:function
  filename:function(req, file, cd){
    const ext = path.extname(file.originalname);
    var data_now = Date.now();
    cd(null, path.basename(file.originalname, ext) + "-" + `${data_now}.png`) //1970년 1월 1일 00:00:00(UTC)을 기점으로 현재 시간까지 경과한 밀리초를 숫자로 반환한다.
    console.log('storage');
  },//filename:function
});//multer.diskStorage

var upload = multer({
  storage:storage,
});//multer
 */

const storage = multer.memoryStorage();
const upload = multer({ storage:storage });

//image는 input태그의 name 속성, 미들웨어 설정
router.post("/upload/create", upload.single('image') ,async (req, res) => {
  ////////////////////새로운 라우팅으로 땡기고 사진들 옮기면서 가공하기


  let info = req.body;
  console.log(info);
  const image = req.file;
  console.log(image);
  try{
  const file = await Jimp.read(req.file.path)
  .then(async image => {
    image.resize(Jimp.AUTO, 900);
    image.composite(background, 1000, 700);
    image.print(font, 1000, 700, 'Logo');
    return image.getBufferAsync(Jimp.AUTO);
  })
  }
  catch(err){
    console.log(err);
  }

const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

let s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

//Where you want to store your file

const params = {
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: image.originalname,
  Body: image,
  ContentType: image.mimetype,
  ACL: 'public-read'
};

s3bucket.upload(params, async (err, data) => {
  try {
    if (err) {
      res.status(500).json({ error: true, Message: err });
    } else {
      const newFileUploaded = {
        description: req.body.description,
        fileLink: s3FileURL + image.originalname,
        s3_key: params.Key
      };
      info = { ...info, photo: newFileUploaded.fileLink };
      // Add all info to database after store picture to S3
      const photos = await database.addPhoto(db, info);
      res.send(photos);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', error: err });
  }
});

}//function
);//route.post




//비동기로 접속하지만 파라미터를 2개 추가하여 테스트에서 문제가 발생할 수 있다.... 분리된 모듈은 웹서버에 의존성을 가지기에 테스트가 불가능함... 콜백으로 다시 재 구성해야함.
var readData = function(req, res) {
    var auth_id = req.user.authId;
    var username = req.user.username;
    var displayName = req.user.displayName;
    var title = req.body.title;
    var description = req.body.description;
    var image_file = req.file.filename;
    var image_original = Buffer.from(`images/${req.file.filename}`,'latin1').toString('utf8');
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
        //console.log("results: " + JSON.stringify(results));
        console.log('1');
        console.log('2');
        console.log('3');
        //waterMark('https://destatic.blob.core.windows.net/images/nodejs-logo.png');
        //jimp.img_processing(`https://destatic.blob.core.windows.net/images/nodejs-logo.png`);
        //var a=fs.readFileSync(__dirname +'/../public/images/image-1664105413261.png');
        //<script>alert('upload success');location.href='/';
        //res.send(`<script>alert('upload success');location.href='/';</script>`);
        //res.redirect('/');
      }//else
    }//function
    );//conn.query 
}//readData
module.exports = router;