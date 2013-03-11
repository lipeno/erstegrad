var express = require('express');
var requ = require('request');

var app = express.createServer(express.logger());

app.get('/api/get/*', function(req, res) {
  var endpoint = req.url.split("/api/get/").pop();
  var options = {
      uri: 'http://beeoneapi.elasticbeanstalk.com/api/' + endpoint
  };
  requ(options, function (error, response, body) {
    if (!error && body){
  	var data = JSON.parse(body);
  	data.headers = response.headers;
      //Access-Control-Allow-Origin: *
    res.header('X-XSS-Protection' , 0 );
    res.header("Access-Control-Allow-Origin", "*");
  	res.send(JSON.stringify(data));
    }
    else{
        res.send('There was an error' + error);
    }
  });
});

app.get('/api/token/*', function(req, res) {
    var endpoint = req.url.split("/api/token/").pop();

    var url = require('url');
    var parsedUrl = url.parse(endpoint);

    var querystring = require('querystring');
    var qs = querystring.parse(parsedUrl.query);

    var token = null;
    if (qs.token){
        token = {"X-BeeOne-Auth" : qs.token};
        delete qs.token;
    }
    // If after api there is slash
    if (parsedUrl.pathname.charAt(0) === "/"){
        parsedUrl.pathname = parsedUrl.pathname.substr(1);
    }
    var options = {
        uri: 'http://beeoneapi.elasticbeanstalk.com/api/' + parsedUrl.pathname + "?" + querystring.stringify(qs),
        headers: token
    };
    requ(options, function (error, response, body) {
        if (!error && body){
            var data = JSON.parse(body);
            data.headers = response.headers;
            //Access-Control-Allow-Origin: *
            res.header('X-XSS-Protection' , 0 );
            res.header("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(data));
        }
        else{
            res.send('There was an error' + error);
        }
    });
});

app.get('/api/post/*', function(req, res) {
    var endpoint = req.url.split("/api/token/").pop();

    var url = require('url');
    var parsedUrl = url.parse(endpoint);

    var querystring = require('querystring');
    var qs = querystring.parse(parsedUrl.query);

    var token = null;
    if (qs.token){
        token = {"X-BeeOne-Auth" : qs.token};
        delete qs.token;
    }
    // If after api there is slash
    if (parsedUrl.pathname.charAt(0) === "/"){
        parsedUrl.pathname = parsedUrl.pathname.substr(1);
    }
    var options = {
        uri: 'http://beeoneapi.elasticbeanstalk.com/api/' + parsedUrl.pathname + "?" + querystring.stringify(qs),
        headers: token,
        body:JSON.stringify(qs)
    };
    requ(options, function (error, response, body) {
        if (!error && body){
            var data = JSON.parse(body);
            data.headers = response.headers;
            //Access-Control-Allow-Origin: *
            res.header('X-XSS-Protection' , 0 );
            res.header("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(data));
        }
        else{
            res.send('There was an error' + error);
        }
    });
});



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});