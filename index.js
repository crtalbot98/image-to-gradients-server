require('dotenv').config();
const http = require('http');
const https = require('https');
const url = require('url');

(function(){
    const port = 8080;

    let server = http.createServer(function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization,Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
        });
        const parsedUrl = url.parse(req.url, true);

        if(parsedUrl.pathname === '/images') requestData(parsedUrl.query.page).then((data) => {
            res.write(data);
            res.end()
        });
    });

    server.listen(port)
})();

const requestData = (page) => {
    return new Promise((resolve, reject) => {
        https.get(`https://api.unsplash.com/photos/?page=${page}&per_page=${12}&client_id=${process.env.IMAGE_ACCESS}`, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk
            });

            res.on('end', () => {
                resolve(JSON.stringify(data))
            });

        }).on('error', (err) => {
            reject(JSON.stringify({error: `please try again, ${err}`}))
        })
    });

};
