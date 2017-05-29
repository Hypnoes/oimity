const http = require('http');
const fs = require('fs');

const db = require('./db.js');

// HTTP server
const server = http.createServer((req, res) => {
    var content = '';
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        var s = [];
        s += chunk;
        content = s.toString();
    }).on('end', () => {
        console.log("Request:" + ` [${req.host}] ` + req.url);
        route(req, res, content);
    });
}).listen(45000);

// http content-type
const type = {
    ".html" : {"Content-Type": "text/html"},
    ".css": {"Content-Type": "text/css"},
    ".js": {"Content-Type": "application/javascript"},
    ".ico": {"Content-Type": "image/x-ico"},
    ".png": {"Content-Type": "image/png"},
    ".json": {"Content-Type": "application/json"}
}

// Http route
const route = (req, res, content) => {
    switch (req.method) {
        case 'GET':
            switch (req.url) {
                case '/':
                    req.url += 'index.html';
                case '/index.html':
                case '/css/button.png':
                case '/css/style.css':
                case '/script/script.js':
                case '/favicon.ico':
                    r(req, res);
                    break;

                default:
                    raise(404, res);
                    break;
            }
            break;

        case 'POST':
            switch (req.url) {
                case '/data':
                    res.writeHeader(200, {"Content-Type": "application/json"});
                    fs.readFile('./data/data.json', (err, data) => {
                        if (err) {console.error(err)};
                        res.end(data);
                    });
                    break;

                case '/isa':
                    var index = parseInt(content.split('=')[1]);
                    var str = fs.readFileSync('./data/topic_name', 'utf-8');
                    var cat = str.split('\n');
                    res.end(cat[index]);
                    break;

                case '/table':
                    var sql = `use [${content}] select name from sysobjects where xtype='U';`;
                    db.get(sql, (ans) => {
                        var str = '';
                        ans.forEach(function(item) {
                            str += item + ',';
                        }, this);
                        res.end(str);
                    });
                    break;

                case '/teb':
                    var query = content.split('.');
                    var sql = `select top(10) * from [${query[0]}].[dbo].[${query[1]}];`;
                    db.get(sql, (ans) => {
                        var str = '';
                        ans.forEach(function(line) {
                            line.forEach(function(item) {
                                str += item + ',';
                            }, this);
                            str += ';';
                        }, this);
                        res.end(str);
                    });
                    break;

                case '/teh':
                    var query = content.split('.');
                    var sql = `select COLUMN_NAME from [${query[0]}].information_schema.columns where TABLE_NAME='${query[1]}';`;
                    db.get(sql, (ans) => {
                        var str = '';
                        ans.forEach(function(line) {
                            line.forEach(function(item) {
                                str += item + ',';
                            }, this);
                        }, this);
                        res.end(str);
                    });
                    break;

                default:
                    raise(404, res);
                    break;
            }
            break;

        default:
            raise(404, res);
            break;
    }
}

// Write responds
const r = (req, res) => {
    res.writeHeader(200, type[req.url.match(/\.\S*/)]);
    fs.readFile('./html'+ req.url, (err, data) => {
        if (err) {console.error(err)};
        res.end(data);
    });
}

// Http error
const raise = (code, res) => {
    res.writeHeader(code, {'Content-Type': 'text/plain'});
    res.end("Reeeep...");
}

// server log control
console.log('Server listen on port 8080...');

