var Jimp = require('jimp') ;

//parallel, series, during 등의 함수는 독립적으로 실행되어 서로 연계 할 수 없다.
exports.img_processing = async function(file) { // Function name is same as of file name
// Reading watermark Image
      console.log(`aaaaaaaaaaaaa`);
      //let -> TDZ 변수로 선언 전에 어떤 것도 사용하지 않음
      let watermark = await Jimp.read(file);
      console.log(`aaaaaaaaaaaaa ${watermark}`);
       watermark = watermark.resize(688,688); // Resizing watermark image
   // Reading original image
      const image = await Jimp.read('/Users/kimheejae/Desktop/project/abovemyhead/workspace/img/icon2.png');
      watermark = await watermark
      //composite(watermark, x, y)
      image.composite(watermark, 157, 72, {
         mode: Jimp.BLEND_SOURCE_OVER,
         opacityDest: 1,
         opacitySource: 1
         //opacitysource - watermark
         //opacityDest - icon
      })
   await image.writeAsync(`/Users/kimheejae/Desktop/project/abovemyhead/workspace/public/processing_img/1_overlay_${Date.now()}.png`);
   console.log("Image is processed successfully"); 
}
// Calling this function using async
//exports.img_processing('/Users/kimheejae/Desktop/project/abovemyhead/workspace/public/images/IMG_1481-1664456716038.png');
//console.log("Image is processed successfully");