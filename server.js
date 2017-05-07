const http = require('http');
const fs = require('fs');

const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

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
        route(req, res, content);
    });
}).listen(8080);

const route = (req, res, content) => {
    switch (req.method) {
        case 'GET':
            switch (req.url) {
                case '/':
                case "/html/index.html":
                    res.writeHeader(200, {'Content-Type': 'text/html'});
                    fs.readFile('./html/index.html', (err, data) => {
                        if(err) {console.error(err)};
                        res.end(data);
                    });
                    break;

                case '/css/style.css':
                    res.writeHeader(200, {'Content-Type': 'text/css'});
                    fs.readFile('./html/css/style.css', (err, data) => {
                        if(err) {console.error(err)};
                        res.end(data);
                    });
                    break;

                case '/script/script.js':
                    res.writeHeader(200, {'Content-Type': 'application/javascript'});
                    fs.readFile('./html/script/script.js', (err, data) => {
                        if(err) {console.error(err)};
                        res.end(data);
                    });
                    break;

                case '/favicon.ico':
                    res.writeHeader(200, {'Content-Type': 'image/x-ico'})
                    fs.readFile('./favicon.ico', (err, data) => {
                        if(err) {console.error(err)};
                        res.end(data);
                    });
                    break;

                case '/css/button.png':
                    res.writeHeader(200, {'Content-Type': 'image/png'});
                    fs.readFile('./html/res/button.png', (err, data) => {
                        if(err) {console.error(err)};
                        res.end(data);
                    });
                    break;

                default:
                    raise(404, res);
                    break;
            }
            break;

        case 'POST':
            switch (req.url) {
                case '/data':
                    res.writeHeader(200, {'Content-Type': 'application/json'});
                    fs.readFile('./data/data.json', (err, data) => {
                        if(err) {console.error(err)};
                        res.end(data);
                    });
                    break;

                case '/isa':
                    var index = parseInt(content.split('=')[1]);
                    var str = fs.readFileSync('./data/topic_name', 'utf-8');
                    var cat = str.split('\n');
                    res.end(cat[index]);
                    break;

                case '/favicon.ico':
                    res.writeHeader(200, {'Content-Type': 'image/x-ico'})
                    fs.readFile('./favicon.ico', (err, data) => {
                        if(err) {console.error(err)};
                        res.end(data);
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

const raise = (code, res) => {
    res.writeHeader(code, {'Content-Type': 'text/plain'});
    res.end("Reeeep...");
}

console.log('Server listen on port 8080...');

// sql Data Transfere
const config = {
    userName: 'user',
    password: '123456',
    server: '10.188.20.220',
    options: {
        'rowCollectionOnRequestCompletion': true
    }
}

const connection = new Connection(config);
connection.on('connect', (err) => {
    if (err) {console.error(err)} 
    else {
        console.log('Connected');
        var sql = 'select [topic_name], [page_num] from [data_news_iic_03].[dbo].[T_TOPIC];'
        executeStatement(sql);
    }
}).on('end', () => {
    this.close();
});

function executeStatement(sql) {
    request = new Request(sql, (err, rowCount, rows) => {
        if (err) console.error(err);
        if (fs.existsSync('./data/topic_name')) {fs.renameSync('./data/topic_name', './data/temp/'+ Math.random())};
        if (fs.existsSync('./data/page_num')) {fs.renameSync('./data/page_num', './data/temp/'+ Math.random())};
        rows.forEach(function(row) {
            fs.appendFile('./data/topic_name', row[0]['value'] + '\n', (err) => {});
            fs.appendFile('./data/page_num', row[1]['value'] + '\n', (err) => {});
        }, this);
        console.log(rowCount + ' items found.');
    });
    connection.execSql(request);
    generator();
}

function generator() {
    var str = fs.readFileSync('./data/page_num', 'utf-8');
    var data = str.split('\n');
    var cate = [];
    for(var i = 0; i < data.length; i++) {
        cate.push('话题' + i);
    }
    var m = {
        "categories": cate,
        "data": data
    }
    fs.writeFile('./data/data.json', JSON.stringify(m), (err) => {});
}
