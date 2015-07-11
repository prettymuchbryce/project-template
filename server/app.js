var express = require('express');
var app = express();
var server = require('http').Server(app);
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: 'app'});
var bodyParser = require('body-parser')

app.use(express.static('./static'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates/');

app.use(bodyParser.json());
app.use (function (error, req, res, next){
    //Catch json error
    if (error.status === 400) {
        res.status(400).send('Sorry. Something went wrong.');
        logger.warn('JSON Error', error);
    }
});

app.get('/', function (req, res) {
    res.render('index', {});
});

var PORT = 3000;
server.listen(PORT);
logger.info('Server started at port ' + PORT);