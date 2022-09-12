
var express = require('express');
var router = express.Router();
var template = require('../lib/template');

/*     route.post('/upload', function(req, res){
  console.log('upload post');
    res.render('user/upload');
}//function
);//route.post */


/* route.post('/upload', function(req, res){
  res.send('123');
});//route.get */
router.get('/upload', function(req, res){
    console.log('upload get');
    res.render('user/upload');
    }//function
);//route.get

module.exports = router;