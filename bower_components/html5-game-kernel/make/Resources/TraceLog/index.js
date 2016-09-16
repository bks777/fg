const WebSocketServer = require('ws').Server;
const http            = require('http');
const fs              = require('fs');
const path            = require('path');
const url             = require('url');
const mime            = require('mime');
var port              = 5001;
var connections = {};

const server = http.createServer(function(req, res) {
    logger('Incoming http connection');

    var uri      = url.parse(req.url).pathname;

    if(uri === '/') uri = "/index.html";

    var filename = path.join(process.cwd(), unescape(uri));

    logger('Requested file: ' + filename);

    if(!fs.existsSync(filename)) {
        res.end();
        return;
    }

    var mimeType = mime.lookup(filename);

    res.setHeader('Content-type', mimeType + '; charset=utf-8');
    fs.createReadStream(filename).pipe(res);
});

server.listen(port);

logger('http server listening on ' + port);

const wss = WebSocketServer({ server: server });
logger("websocket server created");

wss.on("connection", function(ws) {
    logger("websocket connection open");

    var id = Math.random() * 10e16;

    connections[id] = ws;

    logger('Connection id: ' + id);

    ws.on('message', function(data, flags) {
        for(var id in connections) {
            console.log('Sending message to user with id: ' + id);
            connections[id].send(data);
        }
    });

    ws.on("close", function() {
        delete connections[id];

        logger("websocket connection close");
    })
});



function logger(data) {
    console.log('========================');
    console.log('Date: ' + (new Date).toTimeString());
    console.log(data);
}
