var Jimp = require('jimp') ;

exports.img_processing = async function(file) { // Function name is same as of file name
// Reading watermark Image
      let watermark = await Jimp.read(file);
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
console.log('123');
// Calling this function using async
//exports.img_processing('/Users/kimheejae/Desktop/project/abovemyhead/workspace/public/images/image-1664278822101.png');
//console.log("Image is processed successfully");