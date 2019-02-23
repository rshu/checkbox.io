function TaskViewModel() {
    // Data
    var self = this;
    self.Left = ko.observable();
    self.Right = ko.observable();

    self.getLines = function(side)
    {
        var lines = [];
        if( side )
        {
            for( var i = 0; i < side.Filegrams.length; i++ )
            {
                var filegram = side.Filegrams[i];
                for( var j = 0; j < filegram.Linegrams.length; j++ )
                {
                    var linegram = filegram.Linegrams[j];
                    lines.push( linegram.Line);            
                }
            }
        }
        return lines.join("\n");
    }


    self.LeftLines  = ko.computed(function()
    {
        return self.getLines(self.Left());
    });

    self.RightLines  = ko.computed(function()
    {
        return self.getLines(self.Right());
    });


    // Behaviours    
    self.loadLeftSnippet = function(taskId, callback) { 
        $.getJSON('/api/snippets/' + taskId, {}, function(res) {self.Left(res); callback();});
    };

    self.loadRightSnippet = function(taskId, callback) { 
        $.getJSON('/api/snippets/' + taskId, {}, function(res) {self.Right(res);callback();});
    };

	 // Load test snippets in order, then run pretty print when all loaded.
	 async.series([
		function(callback){ 
			self.loadLeftSnippet('51c1e157710bad5f9a6f1356', function() {
			  callback(null, "left");
			});
		},
		function(callback){ 
			self.loadRightSnippet('51c1e157710bad5f9a6f1358', function() {
			  callback(null,"right");
			});
		},
		function(callback){ 
			prettyPrint(); 
			callback(null, "pretty"); 
		}], 
		function(err, results){
	    		console.log(err);
	    		console.log(results);
		}
         );
};

$(document).ready( function()
{
    ko.applyBindings(new TaskViewModel());

	 var converter = new Markdown.Converter();
	 document.write(converter.makeHtml("**I am bold**"));
});
