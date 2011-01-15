var KEY_LAST_REGEX 		= "com.robrohan.regex.value";
var KEY_LAST_TARGET 	= "com.robrohan.regex.target";
var KEY_CASE 			= "com.robrohan.regex.case";
var KEY_GLOBAL 			= "com.robrohan.regex.global";
var KEY_MULTILINE 		= "com.robrohan.regex.multiline";

/**
 * Variable: current_command
 * Used when calling the ftp command line script
 */
var current_command;
var current_server;

var delim = "\u0177"; //±

function load()
{
	setupParts();
	
	//load any saved values (very first run will be undefined)
	var lastregex = preferenceValue(KEY_LAST_REGEX);
	if(lastregex != null && typeof lastregex != "undefined")
	{
		document.getElementById("txtRegex").value = lastregex;
		document.getElementById("txtTarget").value = preferenceValue(KEY_LAST_TARGET);
		document.getElementById("chkCase").checked = parseBooleanValue(preferenceValue(KEY_CASE));
		document.getElementById("chkGlobal").checked = parseBooleanValue(preferenceValue(KEY_GLOBAL));
		document.getElementById("chkMultiLine").checked = parseBooleanValue(preferenceValue(KEY_MULTILINE));
	}
	runRegex();
	document.getElementById("txtRegex").focus();
}

function parseBooleanValue(from) 
{
	if(from != null && typeof from != "undefined") 
	{
		if(from == "true" || from == "T" || from == "t" || from == "yes" || from == "TRUE" || from > 0)	{
			return true;
		}
	}
	
	return false;
}

var timeOutItem = null;
function runWithPause() 
{
	//if(timeOutItem == null) 
	//{
	//	timeOutItem = setTimeout("runRegex()", 200);
	//}
	runRegex()
}

function runRegex()
{
	var regex = document.getElementById("txtRegex");
	var target = document.getElementById("txtTarget");
	var result = document.getElementById("regexresult");
	
	result.innerHTML = "";

	var prevalue = "";
	
	if(regex.value.substring(0,1) == "/" && 
		regex.value.substring(regex.value.toString().length-1,regex.value.toString().length) == "/") {
		prevalue = regex.value.substring(1,regex.value.toString().length-1);
	} else {
		prevalue = regex.value.toString();
	}
	
	var flags = "";
	if(document.getElementById("chkCase").checked) 
		flags += "i";
	
	if(document.getElementById("chkGlobal").checked) 
		flags += "g";
	
	if(document.getElementById("chkMultiLine").checked) 
		flags += "m";
	try {
		var oRegex = new RegExp(prevalue,flags);
	
		var matcharray = new Array();
		matcharray = target.value.toString().match(oRegex);
		
		for(var q=0; q<matcharray.length; q++) {
			var item = document.createElement("DIV");
			
			if(q % 2 == 0) {
				item.setAttribute("class","regexFoundItem");
			} else {
				item.setAttribute("class","regexFoundItem2");
			}
					
			var index = document.createElement("SPAN");
			index.setAttribute("class","regexFoundIndex");
			
			var ivalue = document.createElement("SPAN");
			ivalue.setAttribute("class","regexFoundValue");
			
			index.innerHTML = q;
			
			var clean_item = matcharray[q];
			clean_item = clean_item.replace(/</g,"&lt;");
			clean_item = clean_item.replace(/>/g,"&gt;");
			ivalue.innerHTML = clean_item;
			
			item.appendChild(index);
			item.appendChild(ivalue);
			
			result.appendChild(item);
			
			//save the values
			setPreferences(KEY_LAST_REGEX, regex.value);
			setPreferences(KEY_LAST_TARGET, target.value);
			
			if(document.getElementById("chkCase").checked == true)
				setPreferences(KEY_CASE,"true");
			else
				setPreferences(KEY_CASE,"false");
			
			if(document.getElementById("chkGlobal").checked == true)
				setPreferences(KEY_GLOBAL,"true");
			else
				setPreferences(KEY_GLOBAL,"false");
				
			if(document.getElementById("chkMultiLine").checked == true)
				setPreferences(KEY_MULTILINE,"true");
			else
				setPreferences(KEY_MULTILINE,"false");
				
		}
	} catch(e) {
		var item = document.createElement("DIV");
		item.setAttribute("class","regexError");
		item.innerHTML = "No Match or Error: " + e.toString();
		
		result.appendChild(item);
	}
	
	 refreshScrollArea();
	 
	 timeOutItem = null;
}

function refreshScrollArea() {
	var contentarea = document.getElementById("scrollArea");
	contentarea.object.refresh();
}


///////////////////////////////////////////////////////////////////////////

function setPreferences(key, value) {
	if(window.widget) {
		widget.setPreferenceForKey(value, key);
	}
}

function preferenceValue(key) {
	var value = null;
	
	if(window.widget) {
		value = widget.preferenceForKey(key);
	}
	
	return value;
}
///////////////////////////////////////////////////////////////////////////