var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var fs = require("fs");
var xmlbuilder = require('xmlbuilder');

function main()
{
	var args = process.argv.slice(2);

	var dir;
	if( args.length == 0 )
	{
		dir = './routes';
	}
	else {
		dir = args[0]
	}

	var file_list = [];
	walkSync(dir, file_list);

	var all_builders = {};

	for (var i = 0; i < file_list.length; i++){
  		var file = file_list[i];
  		console.log("Analyzingng file", file);
  		var builders = complexity(file);
  		all_builders[file] = builders;
  	}

  	written_output(all_builders);
  	var xml_output = output_report_file(all_builders);
  	
  	fs.writeFileSync("./analysis_report.xml", xml_output.toString(), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	});

	if (CheckMetricsThreshold(all_builders)) {
		console.log("trigger build failure");
		throw new Error("Triggering build failure");
	}
	process.exit(0);
}

function CheckMetricsThreshold(builders) {
	for (var b in builders) {
		var builder = builders[b]
		for (var func in builder) {
			var s = builder[func]

			if (s.number_of_lines > 60){
				console.log("Too many number of lines in ", func, "function in file = ", b);
				return true
			} else if (s.MaxConditions > 10) {
				console.log("Too many number of conditions in ", func, "function in file =", b);
				return true
			}
			else if (s.HaveTenary === true) {
				console.log("Tenary expression found in ", func, "function in file = ", b);
				return true
			}
		}
	}
	return false;
}


var walkSync = function(dir, filelist) {

  if( dir[dir.length-1] != '/') dir=dir.concat('/')

  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      if (file != 'node_modules')
      	filelist = walkSync(dir + file + '/', filelist);
    }
    else {
      if (file.endsWith('.js'))
      	filelist.push(dir+file);
    }
  });
  return filelist;
};

function written_output(builders) {
	for (var b in builders) {
		console.log("file: ", b);
		var builder = builders[b];
		for (var func in builder) {
			var s = builder[func];
			console.log("func: ", func);
			console.log("lines of code: ", s.number_of_lines);
			console.log("Have Tenary expression: ", s.HaveTenary);
			console.log("Max condition: ", s.MaxConditions)
			console.log("");
		}
	}
}

function output_report_file(builders) {
	var xb = xmlbuilder.create('analysis');
	for (var b in builders) {
		xb = xb.ele('file');
		xb = xb.ele('name');
		xb = xb.txt(b);
		xb = xb.up();
		var builder = builders[b];
		for (var func in builder) {
			var s = builder[func];
			// s.report();
			xb = xb.ele('function');

			xb = xb.ele('name');
			xb = xb.txt(func);
			xb = xb.up();

			xb = xb.ele('lines_of_code');
		  xb = xb.txt(s.number_of_lines);
			xb = xb.up();
			
			xb = xb.ele('have_tenary_expression');
			xb = xb.txt(s.HaveTenary);
			xb = xb.up();

			xb = xb.ele('max_condition');
			xb = xb.txt(s.MaxConditions);
			xb = xb.up();

		  xb = xb.up();
		}
		xb = xb.up();	
	}
	xb = xb.end({ pretty: true });

	return xb;
}

// Represent a reusable "class" following the Builder pattern.
function FunctionBuilder()
{	
	this.number_of_lines = 0;
	this.StartLine = 0;
	this.FunctionName = "";
	// The number of parameters for functions
	this.ParameterCount  = 0,

	// The max number of conditions if one decision statement.
	this.MaxConditions = 0;

	this.HaveTenary = false;

	// this.report = function()
	// {

	// 	console.log(
	// 	   (
	// 	   	"{0}(): {1}\n" +
	// 	   	"============\n" +
	// 			"MaxNestingDepth: {3}\t" +
	// 			"Number of Sync Calls: {4}\t" +
	// 			"Number of Lines of Code: {5}\t" +
	// 			"Message Chain Length: {6}\n\n"
	// 		)
	// 		.format(this.FunctionName, this.StartLine,
	// 			     this.SimpleCyclomaticComplexity, this.MaxNestingDepth,
	// 		        this.sync_calls_count, this.number_of_lines, this.msg_chain_length)
	// 	);
	// }
};

// A builder for storing file level information.
function FileBuilder()
{
	this.FileName = "";
	// Number of strings in a file.
	this.Strings = 0;
	// Number of imports in a file.
	this.ImportCount = 0;

	// this.report = function()
	// {
	// 	console.log (
	// 		( "{0}\n" +
	// 		  "~~~~~~~~~~~~\n"+
	// 		  "ImportCount {1}\t" +
	// 		  "Strings {2}\n"
	// 		).format( this.FileName, this.ImportCount, this.Strings ));
	// }
}

// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

function getParamCount(node){
	return node['params'].length;
}

// main function for calculating all features.
function complexity(filePath)
{
	var buf = fs.readFileSync(filePath, "utf8");
	var ast = esprima.parse(buf, options);

	var i = 0;

	// A file level-builder:
	var builders = {};

	// Tranverse program with a function visitor.
	traverseWithParents(ast, function (node) 
	{
		if (node.type === 'FunctionDeclaration' || node.type == 'FunctionExpression') 
		{
			var builder = new FunctionBuilder();

			builder.number_of_lines = node.loc.end.line - node.loc.start.line + 1;

			builder.FunctionName = functionName(node);
			builder.StartLine    = node.loc.start.line;

		traverseWithParents(node, function(child) {
			if (child.type  === 'ConditionalExpression') {
				builder.HaveTenary = true;
			}

			if(child.type == "IfStatement") {
				//console.log('a ifStatement found...');
				builder.MaxConditions++;
			}
		});

			builders[builder.FunctionName] = builder;
		}

	});
	return builders;

}

// Helper function for printing out function name.
function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "anon function @" + node.loc.start.line;
}

// Helper function for allowing parameterized formatting of strings.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();

exports.main = main;
