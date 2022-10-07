var fs = require('fs');
var fs2 = require('fs-extra');

module.exports = {
  //user_img Folder method
  makeFolder : (dir) => {
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
      fs.mkdirSync(`${dir}/images`);
      fs.mkdirSync(`${dir}/images/active`);
      fs.mkdirSync(`${dir}/images/export`);
      fs.mkdirSync(`${dir}/images/raw`);
      console.log("folder make ok");
    }//if
    else{
      console.log("folder exist ok");
    }//else
  },//makeFolder
  
  //imgefiles name method
  imgfiles:function(dir, file){
    if(!fs.existsSync(`${dir}/images/raw/${file}`)){
      console.log("file exist empty");
      return false;
    }//if
    else{
      console.log("files exist ok");
      return true;
    }//else
  },//imgfiles
  imgMove:function(oldpath, newpath){
    fs2.move(oldpath, newpath, function (err) {
      if (err) {return console.error(err);}//if
      console.log("success!");
     })//fs.move
  }
}



///에러 메세지
/* 
var fmsg = request.flash();
var feedback = '';
if(fmsg.success){
    feedback = fmsg.success[0];
} 
*/