var express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const config = require('./config.js');
const db = require('./db.js');
const helper = require('./helper.js');
const appModule = require('./module.js');

app.set('view engine', 'ejs');

var collection = '';
db.connect(function () {
	collection = db.collection();
});

app.use(express.static(__dirname + '/public')); // placed here to override the all requsts

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON Format');
  }
});

app.get('/', (req, res) => {
	res.send('working app..');
});

app.get("/save", (req, res) => {
  var response = '', reqData = req.query;
  var data = {
      url: decodeURIComponent(reqData.url),
	  file: reqData.file,
      line: reqData.line,
      column: reqData.column,
	  error: reqData.error,
      createdOn: new Date()
  };
  	appModule.saveData({
		db:db, 
		data: data
	}, function(result) {
		helper.prepareOutput(res, reqData, {"searchResult":"SUCCESS"});
	});
});

app.post("/save", (req, res) => {
	var response = '', reqData = req.body;
	var data = {
		url: decodeURIComponent(reqData.url),
		file: reqData.file,
		line: reqData.line,
		column: reqData.column,
		error: reqData.error,
		createdOn: new Date()
	};
	appModule.saveData({
		db: db,
		data: data
	}, function (result) {
		helper.preparePostOutput(res, reqData, { "searchResult": "SUCCESS" });
	});
});

app.get("/show/:pagesize/:pageno", (req, res) => {
		var response = '', reqData = req.query;
		var u = req._parsedUrl.pathname,
		template = 'log_error.ejs',
		sort = { "createdOn": 1},
		query = {};
		let pagesize = req.params.pagesize ? req.params.pagesize : 20;
		let pageno = req.params.pageno ? req.params.pageno : 1;
		  
	appModule.getData({
			db:db, 
			query: query,
			sort: sort,
			limit: pagesize,
		  }, function(domainResult) {
				var finalResult = {};
				finalResult.domainResult = domainResult ? domainResult : {};
	          	res.render(template, {result: finalResult.domainResult})
		})
});


// And start the server

var server = app.listen(config.appPort, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("app listening at http://%s:%s", host, port);
});

server.timeout = config.serverTimeout;




