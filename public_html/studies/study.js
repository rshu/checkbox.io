var imageMapping = 
{
	'Amazon Gift Card': '/media/amazongc-micro.jpg', 
	'Github Swag': '/media/octocat-micro.png',
	'BrowserStack': '/media/browserstack-micro.png', 
	'Windows Surface RT': '/media/surface-rt-mini.jpg',
	'iPad Mini': '/media/iPadMini-micro.png', 
	'Other': null, 
	'None': null
};

var Award = function( award )
{
	this.awardDescription = "None";
	if( award.description )
	{
		this.awardDescription = award.description;
	}

	this.awardImg = undefined;
	if( award.kind && award.kind !="None" )
	{
		this.awardImg = imageMapping[award.kind];
	}
}



function loadStatus(fingerprint, studyId, onReady)
{
	var req = $.ajax({url: '/api/study/vote/status',
		data: {fingerprint: fingerprint, studyId:studyId}
	});

	req.done(function (data) {
		onReady(data.status);
	});
	// callback handler that will be called on failure
	req.fail(function (jqXHR, textStatus, errorThrown){
		// log the error to the console
		console.error("The following error occured: " + textStatus, errorThrown );

	});			
}

function loadStudy(id, onReady)
{
	var req = $.ajax({url: '/api/study/load/'+id});

	req.done(function (data) {
		//console.log(data.name);
		if( data.status && data.status == "closed" )
		{
			showClosedStudy();
			onReady(false, false);
		}
		else
		{
			$("#surveyTitle").text( data.name );
			$("#researcherName").text( data.researcherName);
			$("#researcherName").attr({href:"mailto:"+data.contact});

			$("#rewardDescription").show();

			var awards = data.awards;
			if( awards )
			{
				awards = jQuery.map( awards, function(elem)
				{
					console.log(elem);
					return new Award(elem);
				});
			}

			var hasAward = data.awards && data.awards.length > 0 && data.status != "awarded";

			ko.applyBindings( {awards: awards, hasAward: hasAward}  );

			renderSurvey(data.markdown, onReady, data.showCodeOnComplete);
		}
	});
	// callback handler that will be called on failure
	req.fail(function (jqXHR, textStatus, errorThrown){
		// log the error to the console
		console.error("The following error occured: " + textStatus, errorThrown );

	});			
}

function renderSurvey(markdown, onReady, showCodeOnComplete)
{
	var req = $.post('/api/design/survey', 
			{markdown: markdown}
		);

	req.done(function (data) {
		// log a message to the console
		//console.log( data );
		$("#studyarea").html( data.preview );
		$("#studyarea table").addClass( "questionTable" );
		$("#studyarea table").addClass( "table-bordered" );
		$("#studyarea table").addClass( "table-condensed" );

		onReady(true, showCodeOnComplete);
	});

	// callback handler that will be called on failure
	req.fail(function (jqXHR, textStatus, errorThrown){
		// log the error to the console
		console.error("The following error occured: " + textStatus, errorThrown );
		onReady(false, false);
	});
}

function IEVote(answers, fingerprint, id, showCodeOnComplete)
{
	var data = 	{
			answers: JSON.stringify(answers),
			fingerprint: fingerprint,
			email: $("#voterEmail").val(),
			contact: $("#pleaseContact").prop('checked'),
			studyId: id
		};

	var req = $.post('/api/study/vote/submit/', 
		data
	);

	req.done(function (data) {
		//window.location ="/studies.html";
		//console.log(data);
		showThankYou(fingerprint, showCodeOnComplete);

	});

	// callback handler that will be called on failure
	req.fail(function (jqXHR, textStatus, errorThrown){
		// log the error to the console
		console.error("The following error occured: " + textStatus, errorThrown );

	});			
}

function deliverSurvey( answers, fingerprint, id, showCodeOnComplete )
{
	if( !window.FormData )
	{
		if( $("input[type='file']").length > 0 )
		{
			alert("File upload not supported in IE 9 or less.")
			return;
		}
		// LEGACY IE
		IEVote(answers, fingerprint, id, showCodeOnComplete);
		return;
	}

	var files = [];
	if( $("input[type='file']").length > 0 )
	{
		files = $("input[type='file']")[0].files;

		if( files.length == 0 )
		{
			alert("File upload is required.");
			return;
		}
	}

	var fd = new FormData();

	for (var i = 0; i < files.length; i++) 
	{
    	var file = files.item(i);
		fd.append( 'files[]', file );
	}

	fd.append( 'answers', JSON.stringify(answers) );
	fd.append( 'fingerprint', fingerprint );
	fd.append( 'email', $("#voterEmail").val() );
	fd.append( 'contact', $("#pleaseContact").prop('checked') );
	fd.append( 'studyId', id );

	var xhr = new XMLHttpRequest();
	xhr.onload = function(e)
	{
		//window.location ="/studies.html";
		//console.log(data);
		showThankYou(fingerprint, showCodeOnComplete);
	};	
	xhr.open('POST', '/api/study/vote/submit/', true);
	xhr.send(fd);  // multipart/form-data
}

function showThankYou(fingerprint, showCodeOnComplete)
{
	$("#overview").hide();
	$("#surveySection").hide();
	$("#rewardSection").hide();
	$("#rewardDescription").hide();
	$("#thankYou").show();

	if( showCodeOnComplete )
	{
		$("#showCode").show();
		$("#codeField").text(fingerprint);
	}
}

function showClosedStudy()
{
	$("#overview").hide();
	$("#surveySection").hide();
	$("#rewardSection").hide();
	$("#rewardDescription").hide();
	$("#closedStudy").show();
}

var content = false; 

$(document).on('change', "input, textarea, select", function ()
{
	content = true;
});

window.onbeforeunload = function (event)
{
	if(content) {
		var message = "You've partially completed this survey. Are you sure you want to leave?";
		if (typeof event == 'undefined') {
			event = window.event;
		}
	  	if (event) {
	  		event.returnValue = message;
	  	}
		return message;
  	}
}


function gatherAnswers()
{
	content = false;
	var answers = [];
	$('div[data-question]').each( function() {
		var kind = $(this).data('kind');
		var question = $(this).data('question');
		//console.log(  question + ":" + kind );
		if( kind == 'text' )
		{
			var text = $(this).find('input[type="text"]');
			answers.push( { question: question, kind: kind, answer: text.val() } );
		}
		if( kind == 'textarea' )
		{
			var textarea = $(this).find('textarea');
			answers.push( { question: question, kind: kind, answer: textarea.val() } );
		}
		if( kind == 'singlechoice' )
		{
			var radio = $(this).find("input[type='radio']:checked");
			answers.push( { question: question, kind: kind, answer: radio.val() } );
		}
		if( kind == 'multichoice' )
		{
			var ans = $(this).find("input:checkbox")
				.filter(function() {
					return !this.disabled && this.checked && this.value;
				})
				.map(function() {
					var check = $(this);
					return check.attr('value');
				});

			answers.push( { question: question, kind: kind, answer: $.makeArray( ans ) } );
		}
		if( kind == 'singlechoicetable' )
		{
			var ans = {};
			$(this).find("input[type='radio']:checked")
				.each(function() {
					ans[this.name] = this.value;
				});
			answers.push( { question: question, kind: kind, answer: ans } );
		}
		if( kind == 'multichoicetable' )
		{
			var ans = {};
			$(this).find("input[type='checkbox']:checked")
				.each(function() {
					if( !ans.hasOwnProperty( this.name ) )
					{
						ans[this.name] = [];
					}
					ans[this.name].push(this.value);
				});
			answers.push( { question: question, kind: kind, answer: ans } );
		}

	});

	return answers;
}