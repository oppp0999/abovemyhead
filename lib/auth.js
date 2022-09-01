module.exports = {
    isOwner:function(request, response) {
        if(request.user){
            return true;
        }//if
        else {
            return false;
        }//else
    }//isOwner:function
    ,
    statusUI:function(request,response){
        var authStatusUI = '<a href="/auth/signin">Sign In<\a>'
        if(this.isOwner(request, response)){
            authStatusUI = `${request.user.displayName} | <a href="/auth/signout">Sign OUT<\a>`;
        }//if
    }//statusUI:function
}//module.exports