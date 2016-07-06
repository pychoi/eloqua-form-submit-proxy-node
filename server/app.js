var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');

app.set('port', process.env.PORT || 5000);

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

app.get('/', function(req, res){
    app.send('Hello!');
});


app.post('/', function(req, res, next){
    console.log(req.body);
    var postData = req.body;
    var elqSiteID = req.body.elqSiteID;
    var url = 'https://s' + elqSiteID + '.t.eloqua.com/e/f2';

    request.post(url, {form:postData},
        function (error, response, body) {
            if (error){
                console.log('Error sending data', error);
                res.send('Error sending data', error);
            } else if (!error && response.statusCode == 200){
                res.send('Form submission successful!');
            } else {
                console.log(response);
                res.send(response);
            }
        }
    );
});

app.listen(app.get('port'), function(){
    console.log("Listening to:", app.get('port'));
});