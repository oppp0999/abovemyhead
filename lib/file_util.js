var fs = require('fs');
var util = require('./util');
var puppeteer = require('puppeteer');
var sharp = require('sharp');


module.exports = {
  //sharp img resize method
  resize: (u_dir, file) => {
    try{
       sharp(`${u_dir}/images/raw/${file}`)	// 리사이징할 파일의 경로
          .resize({width:600})	// 원본 비율 유지하면서 width 크기만 설정
          .withMetadata()
          .toFile(`${u_dir}/images/raw/resize_${file}`, (err, info)=>{
              if(err) throw err               
              console.log(`info : ${info}`)
          })        
        
    }catch(err){
        console.log(err)
    }
  },//resize

  //file write method
  writeFile : (filePath,results) => {
    fs.writeFileSync(filePath, results, err => {
      console.log(results);
      if(err){
        console.log('Error writing file', err);
      }//if
      else{
        console.log('Susccessfully wrote file-overwrite');
      }//else
    });//fs.writeFileSync
  },//writeFile

  //file add method
  addFile : (filePath,results) => {
    fs.appendFileSync(filePath, results, err => {
      if(err){
        console.log('Error writing file', err);
      }//if
      else{
        console.log('Susccessfully wrote file-append');
      }//else
    });//fs.appendFile
  },//addFile

  //file read and export img method
  read_exportFile : (jsonfile, stn) => {
    jsonFile = fs.readFileSync(jsonfile, 'utf8');
    var jsonData = JSON.parse(jsonFile);
    /* var st_jsonData = jsonData[`${stn}`]['id'];
    console.log(st_jsonData); */
    var uid = jsonData[`${stn}`]['uid'];
    var displayName = jsonData[`${stn}`]['displayName'];
    var image_original = jsonData[`${stn}`]['image_original'];
    var title = jsonData[`${stn}`]['title'];
    var description = jsonData[`${stn}`]['description'];
    var area = jsonData[`${stn}`]['area'];
    console.log(uid, displayName, image_original, title, description, area);

    var u_dir = `/Users/kimheejae/Desktop/project/abovemyhead/workspace/assets/${uid}`;
    if(util.imgfiles_export(u_dir, `over_${image_original}`)){
      
    }//if
  },//readFile
}//module.exports
