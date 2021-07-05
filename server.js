// Packages
const express = require('express');
const path = require('path');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const { Signale } = require('signale');
const pool = require('./pool');
const discord = require('./discord');
const { verify } = require("hcaptcha");
const fetch = require("node-fetch");
// Config
const config = require('./config.json');

// Variables
const logger = new Signale({ scope: 'Express' });
const app = express();
const port = config.https ? 443 : 80;

// Define render engine and assets path
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '/assets')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/html/notfound.html'), {})
})
// GET /verify/id
app.get('/verify/:verifyId?', (req, res) => {
    if (!req.params.verifyId) return res.sendFile(path.join(__dirname, '/html/invalidLink.html'));
    if (!pool.isValidLink(req.params.verifyId)) return res.sendFile(path.join(__dirname, '/html/invalidLink.html'));
    res.render(path.join(__dirname, '/html/verify.html'), { publicKey: config.recaptcha['public-key'] , hcaptchasitekey: process.env.hcaptchasitekey});
});

// POST /verify/id
app.post('/verify/:verifyId?', async (req, res) => {
    if (!req.body || !req.body['h-captcha-response']) return res.sendFile(path.join(__dirname, '/html/invalidLink.html'));

/*    const response = await axios({
        method: 'post',
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptcha['secret-key']}&response=${req.body['g-recaptcha-response']}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });*/
//    logger.info(req.body)
    //const data = await verify(process.env.hcaptchasecret, req.body['h-captcha-responce'])
    let data = await fetch("https://hcaptcha.com/siteverify", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `response=${req.body['h-captcha-response']}&secret=${process.env.hcaptchasecret}`
    });
    data = await data.json();
//    logger.complete(data)
    if (!data.success) return res.sendFile(path.join(__dirname, '/html/invalidCaptcha.html'));
    if (!pool.isValidLink(req.params.verifyId)) return res.sendFile(path.join(__dirname, '/html/invalidLink.html'));
    discord.addRole(pool.getDiscordId(req.params.verifyId));
    pool.removeLink(req.params.verifyId);
    res.sendFile(path.join(__dirname, '/html/valid.html'));
});

function main() {
    if (config.https) {
        https.createServer({
            key: fs.readFileSync('private.pem'),
            cert: fs.readFileSync('certificate.pem')
        }, app).listen(port, () => logger.success(`${port}でポートを開きました`));
    } else {
        app.listen(port, () => logger.success(`${port}でポートを開きました`));
    }
}

module.exports = {
    run: main
};
