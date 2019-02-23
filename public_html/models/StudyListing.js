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

// This is a constructor that is used to setup inheritance without
// invoking the base's constructor. It does nothing, so it doesn't
// create properties on the prototype like our previous example did
function surrogateCtor() {}

function extend(base, sub) {
  // Copy the prototype from the base to setup inheritance
  surrogateCtor.prototype = base.prototype;
  // Tricky huh?
  sub.prototype = new surrogateCtor();
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
}

StudyListingBase = function(study)
{
	var self = this;

	self.name = study.name;
   self.description = study.description;
   self.link = study.link;

	self.twitterShare = "https://twitter.com/intent/tweet?text=" + "Help science, participate in a developer study: " + study.name + " " + study.link;
	self.facebookShare = "http://www.facebook.com/sharer/sharer.php?u=" + study.link;

   self.votes = study.votes;

   self.researcherName = study.researcherName;
   self.contact = study.contact;

   // append images
   for(var i=0; i < study.awards.length; i++ )
   {
   	var a = study.awards[i];
		if( a.kind && a.kind !="None" )
		{
			a.awardImg = imageMapping[a.kind];
		}
	}

   self.awards = study.awards;
	self.isAwarded = study.awards && study.awards.length > 0 && study.status == "awarded";
 	self.canParticipate = study.status == "open" || study.status == "awarded";

 	self.hasResults = study.results && (study.results.data || study.results.report);
 	self.results = study.results;

	self.status = study.status.toUpperCase();
	self.goal = study.goal;
};

var SurveyListing = function(study) 
{
	var self = this;
	StudyListingBase.call( this, study );
	//ko.utils.extend(self, new StudyBase());
	self.studyKind = "survey";

	self.studyIconClass = "icon-check-empty";
};

extend(StudyListingBase, SurveyListing);

DataStudyListing = function(study) 
{
	var self = this;
	StudyListingBase.call( this, study );
	//ko.utils.extend(self, new StudyBase());
	self.studyKind = "dataStudy";

	self.studyIconClass = "icon-hdd";

	return self;
};

extend(StudyListingBase, DataStudyListing);