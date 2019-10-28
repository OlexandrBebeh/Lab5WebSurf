'use strict';

const http = require('http');
const fs = require('fs');

// const hostname = '127.0.0.1';
const port = process.env.PORT || 5000;

const sendData = (file, type, res) => {
    let stream = fs.createReadStream(file);
    stream.on('open', () => {
        res.setHeader('Content-Type', type);
        stream.pipe(res);
    });
    stream.on('error', () => {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
};

const routing = {
    '/': sendData.bind(null, '3.html', 'text/html'),
    '/pic1.png': sendData.bind(null, 'pic1.png', 'image/png'),
    '/pic2.png': sendData.bind(null, 'pic2.png', 'image/png'),
    '/pic3.png': sendData.bind(null, 'pic3.png', 'image/png'),
    '/pic4.png': sendData.bind(null, 'pic4.png', 'image/png'),
    '/favicon.ico': sendData.bind(null, 'favicon.ico', 'image/ico'),
};

const server = http.createServer((req, res) => {
    if (req.method !== 'GET') {
        res.statusCode = 501;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Method not implemented');
    }
    console.log(req.url);
    const dataSender = routing[req.url];
    dataSender(res);
});

/* server.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
}); */
server.listen(port);

server.on('error', (err) => {
    if (err.code === 'EACCES') {
        console.log(`No access to port: ${port}`);
    }
});
