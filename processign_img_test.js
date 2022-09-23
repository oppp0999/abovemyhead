const Jimp = require('jimp') ;

async function imageOverlay(imageOverlay_img) { // Function name is same as of file name
// Reading watermark Image
   let watermark = await Jimp.read(imageOverlay_img);
   watermark = watermark.resize(688,688); // Resizing watermark image
// Reading original image
   const image = await Jimp.read('img/icon2.png');
   watermark = await watermark
   //composite(watermark, x, y)
   image.composite(watermark, 157, 72, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1
      //opacitysource - watermark
      //opacityDest - icon
   })
   await image.writeAsync(`jimp/${Date.now()}_overlay.png`);
}

// Calling this function using async
imageOverlay('public/images/IMG_1481-1663934556298.png');
console.log("Image is processed successfully");
