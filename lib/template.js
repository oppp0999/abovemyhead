module.exports = {
    HTML:function(map, authStatusUI='<a= href="/auth/signin">Sign IN</a> | <a href="/auth/signup">Sign UP</a>'){
        return `
        <!doctype html>
        <html>
            <head>
                <title>abovemyhead</title>
                <meta charset="utf-8">
            </head>
            <body>
                ${authStatusUI}
                <h1><a href="/">ABOVE MY HEAD</a></h1>
            </body>
        </html>`;
    }//HTML:function
}//module.exports