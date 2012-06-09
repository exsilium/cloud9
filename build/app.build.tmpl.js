// THIS FILE IS AUTOMATICALLY GENERATED BY: packed_helper.js

({
	//optimize: "none",
	preserveLicenseComments: false,
	baseUrl: "../",
	paths: {
		"text" : "%b/text", // plugin for pulling in text! files
		"core" : "empty:",
		"ext/commands" : "%d/ext.commands",
		"apf" : "empty:",
		"treehugger" : "empty:",
		"debug": "empty:",
		"apf/elements": "%d/lib.apf/www/apf/elements",
		"%m"
	},
    
	include: ["%b/src/core.packed", 
	"apf/elements/codeeditor", 
	"apf/elements/debugger", 
	"apf/elements/debughost",
	"ext/commands/commands",
	"ext/uploadfiles/uploadfiles",
	"%s"], 
	out: "%o",
	inlineText: true,
	findNestedDependencies: true,
	optimizeAllPluginResources: false,
	useStrict: true,
	wrap: true
})