var express = require('express');
var router = express.Router(); //express 모듈 안의 Router()라는 함수 호출 -> Router라는 객체를 리턴해줌
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js'); // ../은 현재 topic.js가 속해 있는 디렉토리의 부모 디렉토리 밑에 있는 lib 디렉토리를 말하는거
var auth = require('../lib/auth');
var db = require('../lib/db');
var shortid = require('shortid');

router.get('/create', function (request, response) {
    if(!auth.isOwner(request, response)) { //로그인 했을 때만 추가 가능하게 하기 위함
        response.redirect('/');
        return false; //return을 통해서 끊어줘야 다음 함수들이 호출X
    }
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        `, '',auth.statusUI(request, response)
        );
    response.send(html);
});

//web server에서 요청한 본체를 body라고 함, 그 본체를 설명하는 것을 header라고 함
router.post('/create_process', function (request, response) { //create에서 제출을 누르면 여기로 넘어오는데
    //method 부분이 post기 때문에 app.post 사용함
    if(!auth.isOwner(request, response)) { 
        response.redirect('/');
        return false;
    }
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var id = shortid.generate();
    db.get('topics').push({
        id:id,
        title:title,
        description:description,
        user_id:request.user.id
    }).write();
    response.redirect(`/topic/${id}`);
});

router.get('/update/:pageId', function (request, response) {
    if(!auth.isOwner(request, response)) { 
        response.redirect('/');
        return false;
    }
    var topic = db.get('topics').find({id:request.params.pageId}).value();
    if(topic.user_id !== request.user.id){
        request.flash('error', 'Not yours!'); //안될 이유가 없는데 안된다!
        return response.redirect('/');
    }
    var title = topic.title;
    var description = topic.description;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `
    <form action="/topic/update_process" method="post">
        <input type="hidden" name="id" value="${topic.id}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
            <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${topic.id}">update</a>`,
        auth.statusUI(request, response)
    );
    response.send(html);
});

router.post('/update_process', function (request, response) {
    if(!auth.isOwner(request, response)) { 
        response.redirect('/');
        return false;
    } 
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    var topic = db.get('topics').find({id:id}).value();
    if(topic.user_id !== request.user.id){
        request.flash('error', 'Not yours!');
        return response.redirect('/'); //root 페이지로 튕기낸다.
    }
    db.get('topics').find({id:id}).assign({
        title:title, description:description
    }).write();
    response.redirect(`/topic/${topic.id}`); 

});

router.post('/delete_process', function (request, response) {
    if(!auth.isOwner(request, response)) { 
        response.redirect('/');
        return false;
    }
    var post = request.body;
    var id = post.id;
    var topic = db.get('topics').find({id:id}).value();
    if(topic.user_id !== request.user.id) {
        request.flash('error', 'Not yours!');
        return response.redirect('/');
    }
    db.get('topics').remove({id:id}).write();
    response.redirect('/');    
});

//url에 querystring이 아닌 path 방식을 통해서 파라미터가 전달 되는 경우 처리하는 방법(아래) - pretty url, clean url
router.get('/:pageId', function (request, response, next) { //http://localhost:3000/page/HTML로 접속하면 pageId는 HTML이 되고
    //request.params는 HTML이 된다.
    //만약 app.get('/page/:pageId/:chapterId')로 
    //http://localhost:3000/page/HTML/CSS로 접속하면 pageId는 HTML, chapterId는 CSS
    //request.params는 HTML, CSS가 된다.
    var topic = db.get('topics').find({
        id:request.params.pageId
    }).value();
    var user = db.get('users').find({
        id:topic.user_id
    }).value();
    var sanitizedTitle = sanitizeHtml(topic.title);
    var sanitizedDescription = sanitizeHtml(topic.description, {
        allowedTags: ['h1']
    });
    var list = template.list(request.list);
    var html = template.HTML(sanitizedTitle, list, //href="/update/~"에서 /로 clean url을 만들어줌(원래는 ?id= 이런식으로 querystring 사용)
    `
    <h2>${sanitizedTitle}</h2>
    ${sanitizedDescription}
    <p>by ${user.displayName}</p>
    `,
    ` <a href="/topic/create">create</a>
    <a href="/topic/update/${topic.id}">update</a>
    <form action="/topic/delete_process" method="post">
        <input type="hidden" name="id" value="${topic.id}">
        <input type="submit" value="delete">
    </form>`,
    auth.statusUI(request, response)
    );
    response.send(html);
});

module.exports = router;