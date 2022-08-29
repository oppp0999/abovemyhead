module.exports = {
  HTML:function(title, list, body, control, authStatusUI='<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>'){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){ //querystring이 아닌 path 방식으로 url에 나타나도록 수정함
      list = list + `<li><a href="/topic/${filelist[i].id}">${filelist[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}