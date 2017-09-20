
const express = require('express')
const bodyParser = require('body-parser');
const { inspect } = require('util');

const app = express();
app.use(bodyParser.json());

app.post('/email', function(req, res) {
    console.log(`${req.method} ${req.originalUrl}`);
    console.log(req.headers);
    console.log("*******");
    console.log(inspect(req.body, { colors: true }));
    res.send();
});

app.listen(8080);
