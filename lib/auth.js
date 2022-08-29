module.exports = {
    isOwner:function(request, response) {
        if(request.user) { //passport를 사용해서 로그인하면 user객체가 생성된다. 로그인하지 않으면 객체 x
            return true;
        } else {
            return false;
        }
    },
    statusUI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">login</a>'
        if(this.isOwner(request, response)) {
            authStatusUI = `${request.user.displayName} | <a href="/auth/logout">logout</a> | <a
            href="/auth/register">Register</a>`;
        }
        return authStatusUI;
    }
}