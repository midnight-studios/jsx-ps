#targetengine "ScriptUIBuilder"
var starter;
	if( !starter ){
		file = new File( app.path +'/Presets/Scripts/SUIB.jsxbin' );
		if(!file.exists)
			alert( 'File is not found:\r'+file.fsName );
		else
			$.evalFile( file );
		}
	else
		starter.start = true;