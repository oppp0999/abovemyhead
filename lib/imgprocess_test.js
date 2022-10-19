var Jimp = require('jimp') ;
var util = require('./util');
var sharp = require('sharp');
var fs = require('fs');
var file_util = require('./file_util');
var fsExtra = require('fs-extra');

//parallel, series, during 등의 함수는 독립적으로 실행되어 서로 연계 할 수 없다.
exports.img_processing = async function(u_dir, file, res) { // Function name is same as of file name
   
// Reading watermark Image
      //let -> TDZ 변수로 선언 전에 어떤 것도 사용하지 않음
      let watermark = await Jimp.read(`${u_dir}/images/raw/${file}`);
       watermark = watermark.resize(688,688); // Resizing watermark image
   // Reading original image
      const image = await Jimp.read('/Users/kimheejae/Desktop/project/abovemyhead/workspace/lib/img/icon2.png');
      
      watermark = await watermark
      //composite(watermark, x, y)
      image.composite(watermark, 157, 72, {
         mode: Jimp.BLEND_SOURCE_OVER,
         opacityDest: 1,
         opacitySource: 1
         //opacitysource - watermark
         //opacityDest - icon
      })
   await image.writeAsync(`${u_dir}/images/export/over_${file}`);
   
   var oldpath = `${u_dir}/images/raw/${file}`;
   var newpath = `${u_dir}/images/active/${file}`;
   util.imgMove(oldpath,newpath);
   console.log("Image is processed successfully");
   console.log(newpath, file);

   res.send(`<script>alert('upload success');location.href='/';</script></script>`);
}//exports.img_processing
// Calling this function using async
//exports.img_processing('/Users/kimheejae/Desktop/project/abovemyhead/workspace/public/images/IMG_1481-1664456716038.png');
//console.log("Image is processed successfully");