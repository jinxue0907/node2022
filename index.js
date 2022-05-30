const express = require('express');
const app = express();
const template = require('./lib/template.js');
const fs = require('fs');
const compression = require('compression');

// const bodyParser = require('body-parser');

app.use(express.urlencoded({extended:false}));
app.use(compression())

app.get('/', function (req, res) {
    fs.readdir('./data', function(err, filelist){
        const title = 'Welcome';
        // 웹 페이지의 본문 내용
        const description = 'Hello, Node.js';
        // 게시글의 목록
        const list = template.List(filelist);
        const html = template.HTML(title, list, description
            , `<a href="/create">create</a>`);
        res.send(html);
    });
})


app.get('/page/:pageId', function (req, res) {
    fs.readdir('./data', function(err, filelist){
        const list = template.List(filelist);
        const id = req.params.pageId;
        fs.readFile(`./data/${id}`, 'utf8', function (error, description){
            const title = id;
            const html = template.HTML(title, list, description
                , `<a href="/create">create</a>
                <a href="/update/${title}">update</a> 
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                </form>`);
            res.send(html);
        })
    })
})


app.get('/create', function (req, res){
    fs.readdir('./data', function (err, filelist) {
        const title = 'WEB - create';
        const list = template.List(filelist);
        const html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        res.send(html);
    });
});

app.post('/create_process', function(req, res){
    const reqBody = req.body;
    const title = reqBody.title;
    const description = reqBody.description;
    fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
        res.redirect(`/page/${title}`);
    });
});

app.get('/update/:pageId', function(req, res){
    fs.readdir('./data', function (err, filelist) {
        const id = req.params.pageId;
        fs.readFile(`data/${id}`, 'utf8', function (error, description) {
            const title = id;
            const list = template.List(filelist);
            const html = template.HTML(title, list,
                `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
                `<a href="/create">create</a> <a href="/update/${title}">update</a>`,
            );
            res.send(html);
        });
    });
});

app.post('/update_process', function (req, res) {
    const reqBody = req.body;
    const id = reqBody.id;
    const title = reqBody.title;
    const description = reqBody.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            res.redirect(`/page/${title}`);
        });
    });
});

app.post('/delete_process', function(req, res){
    const reqBody = req.body;
    const id = reqBody.id;
    fs.unlink(`data/${id}`, function (error) {
        res.redirect(`/`);
    });
});

app.listen(4444);