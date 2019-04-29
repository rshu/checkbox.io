var express = require('express'),
        cors = require('cors'),
	marqdown = require('./marqdown.js'),
	//routes = require('./routes/designer.js'),
	//votes = require('./routes/live.js'),
	//upload = require('./routes/upload.js'),
	create = require('./routes/create.js'),
	study = require('./routes/study.js'),
	admin = require('./routes/admin.js');

const got = require('got');
const fetch = require("node-fetch");
const isReachable = require('is-reachable');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

var whitelist = ['http://chrisparnin.me', 'http://pythontutor.com', 'http://happyface.io', 'http://happyface.io:8003', 'http://happyface.io/hf.html'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};

app.options('/api/study/vote/submit/', cors(corsOptions));

app.post('/api/design/survey', 
	async function(req,res)
	{
		if (await isReachable('http://18.207.105.30:9001')) {
			console.log('client 1 is available and used...');
			console.log('**********Start**********');
                	console.log(req.body.markdown);
               	 	console.log('**********End**********');

                	let response = await fetch('http://18.207.105.30:9001/render',
                	{
                   		method: 'POST',
                   		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                   		body: {markdown : req.body.markdown},
                	});

                	let dataMessage = response.json();
                	console.log(dataMessage);
                	var messageData = await response.json();
                	res.send( {preview: messageData} );

		} else if (await isReachable('http://34.239.228.117:9001')) {
			console.log('client 2 is available and used...');
			console.log('**********Start**********');
                        console.log(req.body.markdown);
                        console.log('**********End**********');

                        let response = await fetch('http://34.239.228.117:9001/render',
                        {
                                method: 'POST',
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                body: {markdown : req.body.markdown},
                        });

                        let dataMessage = response.json();
                        console.log(dataMessage);
                        var messageData = await response.json();
                        res.send( {preview: messageData} );

		} else if (await isReachable('http://3.93.42.200:9001')) {
			console.log('client 3 is available and used...');
			console.log('**********Start**********');
                        console.log(req.body.markdown);
                        console.log('**********End**********');

                        let response = await fetch('http://3.93.42.200:9001/render',
                        {
                                method: 'POST',
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                                body: {markdown : req.body.markdown},
                        });

                        let dataMessage = response.json();
                        console.log(dataMessage);
                        var messageData = await response.json();
                        res.send( {preview: messageData} );

		} else {
			console.log('No client is available');
		}
		
//		console.log('**********Start**********');
//		console.log(req.body.markdown);
//		console.log('**********End**********');
//
//		//var text = marqdown.render( req.query.markdown );
//		//const response = got.post('http://35.170.53.244:9001/render', {body: {markdown: req.body.markdown}}, {form:true});
//		//console.log(response.body);
//
//		let response = await fetch('http://35.170.53.244:9001/render',
//        	{	
//          	   method: 'POST',
//          	   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//          	   body: {markdown : req.body.markdown},
//        	});
//		
//		let dataMessage = response.json();
//		console.log(dataMessage);	
//		var messageData = await response.json();
//	
//	//	console.log('+++++++++++++', messageData);
//	//	response.then(function(result) {
//	//		console.log('+++++++++++', result);
//	//	});
//	//	var text = marqdown.render( req.body.markdown );
//		res.send( {preview: messageData} );
	}
);

//app.get('/api/design/survey/all', routes.findAll );
//app.get('/api/design/survey/:id', routes.findById );
//app.get('/api/design/survey/admin/:token', routes.findByToken );

//app.post('/api/design/survey/save', routes.saveSurvey );
//app.post('/api/design/survey/open/', routes.openSurvey );
//app.post('/api/design/survey/close/', routes.closeSurvey );
//app.post('/api/design/survey/notify/', routes.notifyParticipant );


//// ################################
//// Towards general study management.
app.get('/api/study/load/:id', study.loadStudy );
app.get('/api/study/vote/status', study.voteStatus );
app.get('/api/study/status/:id', study.status );

app.get('/api/study/listing', study.listing );

app.post('/api/study/create', create.createStudy );
app.post('/api/study/vote/submit/', cors(corsOptions), study.submitVote );

//// ADMIN ROUTES
app.get('/api/study/admin/:token', admin.loadStudy );
app.get('/api/study/admin/download/:token', admin.download );
app.get('/api/study/admin/assign/:token', admin.assignWinner);

app.post('/api/study/admin/open/', admin.openStudy );
app.post('/api/study/admin/close/', admin.closeStudy );
app.post('/api/study/admin/notify/', admin.notifyParticipant);

//// ################################

//app.post('/api/upload', upload.uploadFile );

// survey listing for studies.
//app.get('/api/design/survey/all/listing', routes.studyListing );

// Download
//app.get('/api/design/survey/vote/download/:token', votes.download );
// Winner
//app.get('/api/design/survey/winner/:token', votes.pickParticipant );

// Voting
//app.get('/api/design/survey/vote/all', votes.findAll );
//app.post('/api/design/survey/vote/cast', votes.castVote );
//app.get('/api/design/survey/vote/status', votes.status );
//app.get('/api/design/survey/vote/stat/:id', votes.getSurveyStats );



var port = process.env.APP_PORT;
app.listen(port);
console.log(`Listening on port ${port}...`);
