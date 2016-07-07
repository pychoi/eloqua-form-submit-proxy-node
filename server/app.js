var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var nodemailer = require('nodemailer');
var index = require('./index.js');

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    return next();
});

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

app.use('/', index);

app.post('/', function(req, res, next){

    var csv = convertTocsv([req.body]);
    var transporter = nodemailer.createTransport();
    var mailOptions = {
        from: '"sender name" <sender@xxx.com>', // sender address
        to: 'recipient@xxx.com', // list of receivers
        subject: 'New Order', // Subject line
        text: 'An order has been submitted.', // plaintext body
        html: '<b>An order has been submitted.</b>', // html body
        attachments: [{
            filename: 'neworder.csv',
            content: csv
        }]
    };

    var postData = req.body;
    var elqSiteID = req.body.elqSiteID;
    var url = 'https://s' + elqSiteID + '.t.eloqua.com/e/f2';

    request.post(url, {form:postData},
        function (error, response, body) {
            if (error){
                console.log('Error sending data', error);
                res.send('Error sending data', error);
            } else if (!error && response.statusCode == 200){

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });

                res.send('Form submission successful!', response);
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

// Returns a csv from an array of objects with
// values separated by tabs and rows separated by newlines
function convertTocsv(array) {
    // Use first element to choose the keys and the order
    var keys = Object.keys(array[0]);

    // Build header
    var result = keys.join("\t") + "\n";

    // Add the rows
    array.forEach(function(obj){
        keys.forEach(function(k, ix){
            if (ix) result += "\t";
            result += obj[k];
        });
        result += "\n";
    });

    return result;
}