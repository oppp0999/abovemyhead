module.exports = {

    
    ERRtext:function(request, response, freeback){
    var fmsg = request.flash();
    feedback = '';
    if(fmsg.error){
        feedback = fmsg.error[0];
    }//if
    }
}//module.exports
