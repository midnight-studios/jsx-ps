#targetengine "ScriptUIBuilder"
var starter;
	if( !starter )
		$.evalFile( new File($.fileName).parent.absoluteURI +'/SUIB.jsxbin' );
	else
		starter.start = true;