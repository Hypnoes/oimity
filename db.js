const Connection = require("tedious").Connection;
const Request = require("tedious").Request;

function get(sql, callback) {
    const db = new Connection({
        userName: 'user',
        password: '123456',
        server: '10.188.20.220',
        options: {
            'rowCollectionOnRequestCompletion': true
        }
    });
    var ans = [];

    db.on('connect', (err) => {
        if(err) {console.error(err)}
        else {
            console.log("db.Connected.");
            exec(sql);
        }
    }).on('end', () => {
        db.close();
    });

    function exec(sql) {
        const request = new Request(sql, (err, rowCount, rows) => {
            if (err) console.error(err);
            rows.forEach(function(row) {
                var line = [];
                row.forEach(function(item) {
                    line.push(item['value']);
                }, this);
                console.log(line);
                ans.push(line);
            }, this);
            callback(ans);
            console.log(rowCount + ' items found.');
            db.emit('end');
        });
        db.execSql(request);
    }
}

exports.get = get;
