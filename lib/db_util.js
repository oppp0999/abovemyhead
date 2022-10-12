module.exports = {  
  //image upload method
  //비동기로 접속하지만 파라미터를 2개 추가하여 테스트에서 문제가 발생할 수 있다.... 분리된 모듈은 웹서버에 의존성을 가지기에 테스트가 불가능함... 콜백으로 다시 재 구성해야함.
  upload:function(req, res, conn, util){
    var auth_id = req.user.authId;
    var uid = req.user.uid;
    var displayName = req.user.displayName;
    var title = req.body.title;
    var description = req.body.description;
    var image_file = req.file.filename;
    var upload_time = util.timenow();
    var image_original = Buffer.from(`images/${req.file.filename}`,'latin1').toString('utf8');
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
}
