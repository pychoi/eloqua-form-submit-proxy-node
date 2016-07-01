var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

app.post('/', function(req, res, next){
    console.log(req.body);
    var postData = req.body;
    var elqSiteID = req.body.elqSiteID;
    var url = 'https://s' + elqSiteID + '.t.eloqua.com/e/f2';

    request.post(url, {form:postData},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                res.send('success', response);
            }
        }
    );
});

app.get('/*', function(req, res){
    var file = req.params[0] || "index.html";
    res.sendFile(path.join(__dirname, "../", file));
});

app.listen(app.get('port'), function(){
    console.log("Listening to:", app.get('port'));
});