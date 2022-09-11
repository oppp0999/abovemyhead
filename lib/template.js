module.exports = {
    HTML:function(title, map, authStatusUI='<a= href="/auth/signin">Sign IN</a> | <a href="/auth/signup">Sign UP</a>'){
        return `
        <!doctype html>
        <html>
            <head>
                <title>abovemyhead - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                ${map}
                ${authStatusUI}
                <h1><a href="/">ABOVE MY HEAD</a></h1>
            </body>
        </html>`;
    }//HTML:function
    ,ERRPAGE:function(mes){
        return `
        <!doctype html>
        <html>
            <head>
                <title>abovemyhead - ERROR</title>
                <meta charset="utf-8">
            </head>
            <body>
                ${mes}
            </body>
        </html>`;
    }//ERR:function
}//module.exports