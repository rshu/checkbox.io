var firstLoad = true;

var AppViewModel = {};

function SetupEvents()
{

	var dataModel = new DataStudyCreate();
	var surveyModel = new SurveyCreate();

	AppViewModel = { dataStudyModel: dataModel, surveyModel: surveyModel };

	// set default markdown examples.
	/*AppViewModel.surveyModel.markdown( $("#survey-default").text() );	
	AppViewModel.dataStudyModel.markdown( $("#datastudy-default").text() );
	*/
	// http://www.bennadel.com/blog/1829-Script-Tags-jQuery-And-Html-Text-And-Contents-.htm
	// use html vs .text() IE8 doesn't return script content...
	AppViewModel.surveyModel.markdown( $("#survey-default").html() );	
	AppViewModel.dataStudyModel.markdown( $("#datastudy-default").html() );


	ko.applyBindings( AppViewModel, document.getElementById("studyArea") );


	$('a[data-toggle="tab"]').on('shown', function (e) {
		//e.target // activated tab
		//e.relatedTarget // previous tab

		var href = $(e.target).attr("href");
		if( href == "#survey-preview" /*&& e.target.innerText == "Preview"*/ )
		{
			convertText2Marqdown( AppViewModel.surveyModel.markdown(), href );
		}
		else if( href == "#data-upload-preview" )
		{
			convertText2Marqdown( AppViewModel.dataStudyModel.markdown(), href );
		}
	});

	$("#data-upload").hide();

	if( firstLoad )
	{
		$("#survey-previewtab a").click();
		firstLoad = false;
	}

	$("#data-upload-btn").click( function ()
	{
		$("#study-icon").attr("class","icon-hdd");
		$("#study-name").text("Data upload");
		$("#study-byline").text("Create a study for collection data from participants.");

		$("#survey").hide();
		$("#data-upload").show();
	});

	$("#survey-btn").click( function ()
	{
		$("#study-icon").attr("class","icon-check-empty");
		$("#study-name").text("Survey");
		$("#study-byline").text("Create a survey study.");

		$("#data-upload").hide();
		$("#survey").show();				
	});


	// Create button handlers.
	$("#createSurveyBtn").click( function()
	{
		console.log("call survey create");
		saveStudy(AppViewModel.surveyModel);
	});

	$("#createDataStudyBtn").click( function()
	{
		console.log( "call data upload")
		saveStudy(AppViewModel.dataStudyModel);
	});

	
}

function saveStudy( model )
{

	var study = 
	{
		markdown: model.markdown(),
		name: model.name(),
		researcherName: model.researcherName(),
		contact: model.contact(),
		invitecode: model.invitecode(),
		goal: model.goal(),
		awards: model.awards(),
		description: model.description(),
		studyKind: model.studyKind
	};

	var req = $.post('/api/study/create', 
		study
	);

	req.done(function (data)
	{
		if( data.error )
		{
			bootstrap_alert.warning( "Could not create study: " + data.error );
		}
		else
		{
			window.location = data.admin_url;
		}
	});

	// callback handler that will be called on failure
	req.fail(function (jqXHR, textStatus, errorThrown){
		// log the error to the console
		console.error("The following error occured: " + textStatus, errorThrown );
	});
}

bootstrap_alert = function() {};
bootstrap_alert.warning = function(message) {
	$('#alert_placeholder').html('<div class="alert"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>');
};


function convertText2Marqdown( markdown, targetId )
{
	var req = $.post('/api/design/survey', 
			{markdown: markdown}
		);

	req.done(function (data) {
		// log a message to the console
		console.log( data );
		$(targetId).html( data.preview );
		$(targetId + " table").addClass( "questionTable" );
		$(targetId + " table").addClass( "table-bordered" );
		$(targetId + " table").addClass( "table-condensed" );

		$("code:not('.nohighlight')").addClass("prettyprint");

		prettyPrint();
	});

	// callback handler that will be called on failure
	req.fail(function (jqXHR, textStatus, errorThrown){
		// log the error to the console
		console.error("The following error occured: " + textStatus, errorThrown );

	});			
}