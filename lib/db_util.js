var conn = require('../config/mysql/db')();
var fs = require('fs');
var path = require('path');
var file_util = require('./file_util');


module.exports = {  
  //image upload method
  //비동기로 접속하지만 파라미터를 2개 추가하여 테스트에서 문제가 발생할 수 있다.... 분리된 모듈은 웹서버에 의존성을 가지기에 테스트가 불가능함... 콜백으로 다시 재 구성해야함.
  upload:function(req, res, util){
    var auth_id = req.user.authId;
    var uid = req.user.uid;
    var displayName = req.user.displayName;
    var title = req.body.title;
    var description = req.body.description;
    var image_file = req.file.filename;
    var upload_time = util.timenow();
    var image_original = Buffer.from(`active/${req.file.filename}`,'latin1').toString('utf8');
    var area = req.body.area;
    var datas = [auth_id, uid, displayName, title, description, image_original, image_file, area, upload_time];//datas
    console.log(datas);
    var sql = "INSERT INTO users_img(authId, uid, displayName, title, description, image_file, image_original, area, upload_time) values(?,?,?,?,?,?,?,?,?)";
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
  },//upload
  //newly data LIMIT 1 method -> authid, displayname, image_original, title, description, area, upload_time
  newly: async function(i){

    var filePath = path.join(__dirname, '../data', 'map_icon_random.json');
    var sql = `SELECT * FROM users_img WHERE area='st${i}' ORDER BY upload_time DESC LIMIT 1`; //LIMIT 1 한 개만 출력
    if(i == 1){
        conn.query(sql,function(err, results){
        console.log(i);
        if(err){
          console.error("err : " + err);
        }//if
        else if(JSON.stringify(results) == '[]'){
          file_util.writeFile(filePath, `{ "st${i}" : {}`);
        }//else if
        else{
          //console.log(JSON.stringify(results));
          var str = JSON.stringify(results);
          var replaced_str1 = str.replace('[', '');
          //console.log(replaced_str1);
          var replaced_str2 = replaced_str1.replace(']', '');
          //console.log(replaced_str2);
          file_util.writeFile(filePath, `{ "st${i}" : ${replaced_str2}`);
        }//else
      }//function
      );//conn.query
    }//if
    else if (i <=15){
      conn.query(sql,function(err, results){
        if(err){
          console.error("err : " + err);
        }//if
        else if(JSON.stringify(results) == '[]'){
          file_util.addFile(filePath, `\n, "st${i}" : {}`);
        }//else if
        else{
          var str = JSON.stringify(results);
          var replaced_str1 = str.replace('[', '');
          //console.log(replaced_str1);
          var replaced_str2 = replaced_str1.replace(']', '');
          file_util.addFile(filePath, `\n,"st${i}" : ${replaced_str2}`);
        }//else
      }//function
      );//conn.query
    }//else
    else{
      conn.query(sql,function(err, results){
        if(err){
          console.error("err : " + err);
        }//if
        else if(JSON.stringify(results) == '[]'){
          file_util.addFile(filePath, `\n, "st${i}" : {}`);
        }//else if
        else{
          var str = JSON.stringify(results);
          var replaced_str1 = str.replace('[', '');
          //console.log(replaced_str1);
          var replaced_str2 = replaced_str1.replace(']', '');
          //console.log(replaced_str2);
          file_util.addFile(filePath, `\n,"st${i}" : ${replaced_str2}}`);
        }//else
      }//function
      );//conn.query
    }//else
  },//newly
}//module.exports