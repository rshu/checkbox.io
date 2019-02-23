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

StudyBase = function()
{
	var self = this;
	self.name = ko.observable("");
    self.description = ko.observable("");

    self.researcherName = ko.observable("");
    self.contact = ko.observable("");

    self.awards = ko.observableArray([]);

    self.awardOptions = ['Amazon Gift Card', 'Github Swag', 'BrowserStack', 'Windows Surface RT', 'iPad Mini', 'Other', 'None'];

    self.awardKind = ko.observable("");
    self.awardDescription = ko.observable("");
    self.amount = ko.observable(0);

    // amount visible logic.

	self.addAward = function () 
	{
		self.awards.push( 
		{
			kind: self.awardKind(),
			description: self.awardDescription(),
			amount: self.amount(),
		});

		// reset input.
		self.awardDescription("");
        self.awardKind("");
    };

    self.removeAward = function(award)
	{
		self.awards.remove(award);
	};

 
	self.status = ko.observable("");
	self.goal = ko.observable(100);

	self.invitecode = ko.observable("");
};

SurveyCreate = function() 
{
	var self = this;
	StudyBase.call(this);

	//ko.utils.extend(self, new StudyBase());

	self.markdown = ko.observable("");
	self.studyKind = "survey";
};

extend(StudyBase, SurveyCreate);

DataStudyCreate = function() 
{
	var self = this;
	//ko.utils.extend(self, new StudyBase());
	StudyBase.call(this);

	self.studyKind = "dataStudy";
	self.markdown = ko.observable("");
};

extend(StudyBase, DataStudyCreate);



