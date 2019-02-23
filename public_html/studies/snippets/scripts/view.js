$(document).ready(function ()
{
	$("#btn").click(function () 
	{
        $.ajax( {
            url: 'http://checkbox.io/api/snippets',
                success: function(snippets){
			        $.each(snippets, function () 
			        {
			        	$("<li>").text(this.Message + " by " + this.Author).appendTo("#loadsnippets");
			        });
                },
                error: function(xhr, status, err) {
                	console.log(status + ":" + err);
                }
        });
	});
});
