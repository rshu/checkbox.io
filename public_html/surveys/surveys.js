
function loadStatus(fingerprint, surveyId, onReady)
{
	var req = $.ajax({url: '/api/design/survey/vote/status',
		data: {fingerprint: fingerprint, surveyId:surveyId}
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

function loadSurvey(surveyId, onReady)
{
	var req = $.ajax({url: '/api/design/survey/'+surveyId});

	req.done(function (data) {
		//console.log(data.name);
		if( data.status && data.status == "closed" )
		{
			showClosedSurvey();
			onReady(false);
		}
		else
		{
			$("#surveyTitle").text( data.name );
			$("#owner").text( data.owner);
			$("#owner").attr({href:"mailto:"+data.contact});

			$("#rewardDescription").show();

			var Survey = function( survey )
			{
				this.awardDescription = "None";
	    		if( survey.awardDescription )
	    		{
	    			this.awardDescription = survey.awardDescription;
	    		}

	   			this.awardImg = undefined;
	    		if( survey.awardKind && survey.awardKind !="None" )
	    		{
	    			if( survey.awardKind == "Amazon Gift Card" )
	    			{
		    			this.awardImg = '/media/amazongc-micro.jpg';
	   				}
	    		}
			}

			ko.applyBindings(new Survey(data) );

			renderSurvey(data.markdown, onReady);
		}
	});
	// callback handler that will be called on failure
	req.fail(function (jqXHR, textStatus, errorThrown){
		// log the error to the console
		console.error("The following error occured: " + textStatus, errorThrown );

	});			
}

function renderSurvey(markdown, onReady)
{
	var req = $.ajax({ 
			url: '/api/design/survey', 
			data: {markdown: markdown}
		});

	req.done(function (data) {
		// log a message to the console
		//console.log( data );
		$("#surveyarea").html( data.preview );
		$("#surveyarea table").addClass( "questionTable" );
		$("#surveyarea table").addClass( "table-bordered" );
		$("#surveyarea table").addClass( "table-condensed" );

		onReady(true);
	});

	// callback handler that will be called on failure
	req.fail(function (jqXHR, textStatus, errorThrown){
		// log the error to the console
		console.error("The following error occured: " + textStatus, errorThrown );
		onReady(false);
	});
}

function deliverSurvey( answers, fingerprint, surveyId )
{
	var req = $.post('/api/design/survey/vote/cast', 
		{
			answers: answers,
			fingerprint: fingerprint,
			email: $("#voterEmail").val(),
			contact: $("#pleaseContact").prop('checked'),
			surveyId: surveyId
		}
	);

	req.done(function (data) {
		//window.location ="/studies.html";
		//console.log(data);
		showThankYou();

	});

	// callback handler that will be called on failure
	req.fail(function (jqXHR, textStatus, errorThrown){
		// log the error to the console
		console.error("The following error occured: " + textStatus, errorThrown );

	});			
}

function showThankYou()
{
	$("#overview").hide();
	$("#surveySection").hide();
	$("#rewardSection").hide();
	$("#thankYou").show();
}

function showClosedSurvey()
{
	$("#overview").hide();
	$("#surveySection").hide();
	$("#rewardSection").hide();
	$("#closedSurvey").show();
}

function gatherAnswers()
{
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