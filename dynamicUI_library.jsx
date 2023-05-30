// alexey-dmitrienko@ya.ru
// www.scriptuibuilder.com

// init library
var script = getScriptLibrary();
extension_resizeableWindow( script );
extension_mouseMove( script );

/*=================================================*/
/*=====	Put here the code of your dynamic window	======*/
/*=================================================*/

//======== LIBRARY ==================================
function getScriptLibrary( scriptArgs ){
	// ScriptLibrary for dynamicUI
	return {
		libraryVersion: 1.59,
		extensions: {},
		getUiObjectIndex: function(uiObject){
			try{
			for(var i = 0; i < uiObject.parent.children.length; i++)
				if(uiObject.parent.children[i] == uiObject)
					return i;
			}catch(err){this.alertError(err)};
			},
		}
	}
function extension_resizeableWindow( scriptLibrary ){
	if( scriptLibrary && scriptLibrary instanceof Object && scriptLibrary.libraryVersion ){}
	else return;
	var name = 'resizeableWindow_lite';
	var version = 2.43;
	var script = scriptLibrary;
	script.extensions[name] = {version: version};
	//=================================
	script.addDynamicObject = function( args ){
		/* args: { 
			obj: uiObject or Array
			moveCoefs: [horizontal, vertical], 
			resizeCoefs: [horizontal, vertical], 
			isSeparator: false/0/1 ( 0 - on width, 1 - on height ),
			window: Window object
			windowMinSize: bool/[bool,bool]/[num,num],
			windowResizeDirections: [horizontal, vertical] (Optional, default: [true,true]),
			} */
		try{
		var obj = args.obj;
		var moveCoefs = args.moveCoefs;
		var resizeCoefs = args.resizeCoefs;
		var keyRestore = args.keyRestore;
		if( args.isSeparator == undefined ) args.isSeparator = false;
		if( args.isSeparator.constructor == Number && !this.extensions['mouseMove'] ){
			args.isSeparator = false;
			alert( 'extension_'+name+': extension_mouseMove not found');
			}
		
		var windowMinSize = args.windowMinSize;
		var windowResizeDirections = args.windowResizeDirections || [true, true];
		
		var script = this;
		if( obj )
			var win = ( obj instanceof Array ) ? obj[0].window : obj.window;
		else if( args.window && args.window.constructor == Window )
			var win = args.window;
		else{
			alert( 'addDynamicObject error: window is undefined' );
			return;
			}
		if( !win.properties || !win.properties.initStatus ){
			if( !win.properties )
				win.properties = {};
			win.properties.initStatus = true;
			win.properties.Objs = [];
			var initFunction = function( event ){
				try{
				var win =  event.target;
				win.removeEventListener('show', initFunction);
				win.properties.Size = [win.size[0],  win.size[1]];
				if(  win.properties.SizeWatchString )
					win.properties.watch( 'Size', new Function( '',  win.properties.SizeWatchString) );
				for( var i = 0; i <  win.properties.Objs.length; i++ ){
					 win.properties.Objs[i].properties.Location = [ win.properties.Objs[i].location[0], win.properties.Objs[i].location[1]];
					 win.properties.Objs[i].properties.Size = [ win.properties.Objs[i].size[0],  win.properties.Objs[i].size[1]];
					if(  win.properties.Objs[i].properties.SizeWatchString )
						 win.properties.Objs[i].properties.watch( 'Size', new Function( '',  win.properties.Objs[i].properties.SizeWatchString) );
					}
				win.onResize = new Function( '',  win.properties.functString );
				}catch(err){alert(err + '\r' + err.line) }
				}
			win.addEventListener('show', initFunction);
			}
		
		if( obj instanceof Array )
			for( var i = 0; i < obj.length; i++ )
				addDynamics( obj[i] );
		else
			addDynamics( obj );
		//=========================================================
		function addDynamics( obj ){
			if( !obj.properties ) obj.properties = {Size:true, Location:true};
			var win = obj.window;
			win.properties.Objs[win.properties.Objs.length] = obj;//регистрируем объект
			var parent = obj.parent;
			if( !parent.properties )
				parent.properties = {};
			if( !parent.properties.functString ){
				parent.properties.functString = '';
				if( parent == win )
					win.properties.functString = getStringForDynamicWindow();
				parent.properties.functString += 'var resize = [this.size[0]-this.properties.Size[0], this.size[1]-this.properties.Size[1]];';
				}
			var index = script.getUiObjectIndex(obj);
			var sObj = 'this.children['+index+']';
			var sThisObj = 'this.This.children['+index+']';
			if( moveCoefs && ( moveCoefs[0] || moveCoefs[1] ) ){
				var thisLocations = [
					sObj + '.properties.Location[0]' + ( moveCoefs[0] ? '+resize[0]' + (moveCoefs[0]==1?'':'*'+moveCoefs[0]) : '' ),
					sObj + '.properties.Location[1]' + ( moveCoefs[1] ? '+resize[1]' + (moveCoefs[1]==1?'':'*'+moveCoefs[1]) : '' )
					];
				if( moveCoefs[0] == 'center' ) thisLocations[0] = '(this.size[0]-'+sObj+'.size[0])/2';
				if( moveCoefs[1] == 'center' ) thisLocations[1] = '(this.size[1]-'+sObj+'.size[1])/2';
				parent.properties.functString += sObj + '.location = [' + thisLocations.join(',') + '];';
				}
			if( resizeCoefs && ( resizeCoefs[0] || resizeCoefs[1] ) ){
				parent.properties.functString += 
					sObj+'.size = ['+
						sObj + '.properties.Size[0]' + ( resizeCoefs[0] ? '+resize[0]' + (resizeCoefs[0]==1?'':'*'+resizeCoefs[0]) : '' ) + ',' +
						sObj + '.properties.Size[1]' + ( resizeCoefs[1] ? '+resize[1]' + (resizeCoefs[1]==1?'':'*'+resizeCoefs[1]) : '') +
					'];';
				if( !parent.properties.SizeWatchString ){
					parent.properties.This = parent;
					parent.properties.SizeWatchString = 'var resize = [arguments[2][0]-arguments[1][0], arguments[2][1]-arguments[1][1]];';// arguments = [name, old, new]
					}
				parent.properties.SizeWatchString += 
					sThisObj+'.properties.Size = ['+
						sThisObj + '.properties.Size[0]' + ( resizeCoefs[0] ? '+resize[0]' + (resizeCoefs[0]==1?'':'*'+resizeCoefs[0]) : '' ) + ',' +
						sThisObj + '.properties.Size[1]' + ( resizeCoefs[1] ? '+resize[1]' + (resizeCoefs[1]==1?'':'*'+resizeCoefs[1]) : '') +
					'];';
				}
			if( moveCoefs && ( moveCoefs[0] || moveCoefs[1] ) ){
				var thisLocations = [
					sThisObj + '.properties.Location[0]' + ( moveCoefs[0] ? '+resize[0]' + (moveCoefs[0]==1?'':'*'+moveCoefs[0]) : '' ),
					sThisObj + '.properties.Location[1]' + ( moveCoefs[1] ? '+resize[1]' + (moveCoefs[1]==1?'':'*'+moveCoefs[1]) : '' )
					];
				parent.properties.SizeWatchString += sThisObj + '.properties.Location = [' + thisLocations.join(',') + '];';
				}
			parent.properties.functString += sObj+'.size = ' + sObj+'.size;';
			parent.watch( 'size', new Function( '', parent.properties.functString) );
			//======== isSeparator ============
			if( args.isSeparator.constructor == Number && index && index < obj.parent.children.length-1 ){
				var preObj = obj.parent.children[index-1];
				var nextObj = obj.parent.children[index+1];
				var dynamicSeparation = function( resize ){
					if( !resize || !resize[args.isSeparator] )
						return;
					if( preObj.size[args.isSeparator] < 20 )
						resize[args.isSeparator] = 20-preObj.size[args.isSeparator];
					else if( nextObj.size[args.isSeparator] < 20 ) 
						resize[args.isSeparator] = nextObj.size[args.isSeparator]-20;
					script.resizeDynamicObject( preObj, resize[0], resize[1] );//obj, onWidth, onHeight
					script.moveDynamicObject( obj, resize[0], resize[1] );//obj, onWidth, onHeight
					script.moveDynamicObject( nextObj, resize[0], resize[1] );//obj, onWidth, onHeight
					script.resizeDynamicObject(nextObj, -resize[0], -resize[1] );//obj, onWidth, onHeight
					}
				if( args.isSeparator )
					script.addMouseMove( { target: obj, direction: [0,1],  withFunct: dynamicSeparation, notMoveTarget: true } ); 
				else
					script.addMouseMove( { target: obj, direction: [1,0],  withFunct: dynamicSeparation, notMoveTarget: true } );
				obj.properties.moveSeparator = dynamicSeparation;
				}
			}
		function getStringForDynamicWindow(){
			if( windowMinSize ){
				if( windowMinSize.constructor != Array ) 
					windowMinSize = ['this.properties.Size[0]', 'this.properties.Size[1]'];
				else{
					windowMinSize = [
						windowMinSize[0] ? (windowMinSize[0] === true ? 'this.properties.Size[0]' : windowMinSize[0]) : false, 
						windowMinSize[1] ? (windowMinSize[1] === true ? 'this.properties.Size[1]' : windowMinSize[1]) : false
						];
					}
				}
			if( windowResizeDirections || windowMinSize ){
				var width = 'this.bounds[2]';
				if( windowResizeDirections && !windowResizeDirections[0] )
					width = 'this.bounds[0]+this.properties.Size[0]';
				else if( windowMinSize && windowMinSize[0] )
					width = 'this.bounds[0]+(this.size[0] < '+windowMinSize[0]+' ? '+windowMinSize[0]+' : this.size[0])';
				var height = 'this.bounds[3]';
				if( windowResizeDirections && !windowResizeDirections[1] )
					height = 'this.bounds[1]+this.properties.Size[1]';
				else if( windowMinSize && windowMinSize[1] )
					height = 'this.bounds[1]+(this.size[1] < '+windowMinSize[1]+' ? '+windowMinSize[1]+' : this.size[1])';
				return 'this.bounds = [this.bounds[0],this.bounds[1],'+width+','+height+'];';
				}
			return '';
			}
		}catch(err){ this.alertError(err) }
		}
	script.resizeDynamicObject = function( obj, onWidth, onHeight ){
		try{
			if( onWidth ){
				if( obj == obj.window ){
					this.resizeWindow( obj, 0, onWidth );
					obj.size = obj.size;
					}
				else{
					var oldWidth = obj.size[0];
					obj.size = [obj.size[0]+onWidth, obj.size[1]];
					obj.size = obj.size;
					obj.properties.Size = [obj.properties.Size[0]+(obj.size[0]-oldWidth), obj.properties.Size[1]];
					}
				}
			}catch(e){}
		try{
			if( onHeight ){
				if( obj == obj.window ){
					this.resizeWindow( obj, 1, onHeight );
					obj.size = obj.size;
					}
				else{
					var oldHeight = obj.size[1];
					obj.size = [obj.size[0], obj.size[1]+onHeight];
					obj.size = obj.size;
					obj.properties.Size = [obj.properties.Size[0], obj.properties.Size[1]+(obj.size[1]-oldHeight)];
					}
				}
			}catch(e){}
        }
	script.moveDynamicObject = function( obj, onWidth, onHeight ){
		try{
			if( obj == obj.window )
				return;
			if( onWidth ){
				var oldWidth = obj.location[0];
				obj.location = [obj.location[0]+onWidth, obj.location[1]];
				obj.properties.Location = [obj.properties.Location[0]+(obj.location[0]-oldWidth), obj.properties.Location[1]];
				}
			}catch(e){}
		try{
			if( onHeight ){
				var oldHeight = obj.location[1];
				obj.location = [obj.location[0], obj.location[1]+onHeight];
				obj.properties.Location = [obj.properties.Location[0], obj.properties.Location[1]+(obj.location[1]-oldHeight)];
				}
			}catch(e){}
        }
	}
function extension_mouseMove( scriptLibrary ){
	if( scriptLibrary && scriptLibrary instanceof Object && scriptLibrary.libraryVersion ){}
	else return;
	var name = 'mouseMove';
	var version = 1.1;
	var script = scriptLibrary;
	script.extensions[name] = {version: version};
	//=================================
	script.addMouseMove = function( args ){ // args = { target: uiObject, direction: [bool, bool] (Optional),  withFunct: Function( move=Array[num.num] ), notMoveTarget: Bool }
		if( !args || !args.target )
			return;
		var target = args.target;
		var direction = ( args.direction && args.direction.constructor == Array) ? args.direction : [1,1];
		var withFunct = args.withFunct && args.withFunct.constructor == Function ? args.withFunct : false;
		var notMoveTarget = args.notMoveTarget;
		
		var mousZero, move, indent, workSpace;
		var moveObject = getMoveObjectFunct();
		var window = target.window;
		target.addEventListener( 'mousedown', initMoveEvent );
		function initMoveEvent( e ){
			if( e.button != 0 ) // only left button
				return;
			if( e.target != target ) return;
			mousZero = [e.screenX, e.screenY];
			move = [0,0];
			indent = 15;
			if( target.parent == window )
				workSpace = [
					window.bounds[0]+indent, 
					window.bounds[1]+indent, 
					window.bounds[2]-indent, 
					window.bounds[3]-indent
					];
			else
				workSpace = [
					window.bounds[0]+target.parent.windowBounds[0]+indent, 
					window.bounds[1]+target.parent.windowBounds[1]+indent, 
					window.bounds[0]+target.parent.windowBounds[2]-indent, 
					window.bounds[1]+target.parent.windowBounds[3]-indent
					];
			window.addEventListener( 'mousemove', moveObject );
			window.addEventListener( 'mouseup', removeMoveObject );
	//		window.addEventListener( 'mouseout', removeMoveObject );
			};
		function removeMoveObject(){
			window.removeEventListener( 'mousemove', moveObject);
			window.removeEventListener( 'mouseup', removeMoveObject );
	//		window.removeEventListener( 'mouseout', removeMoveObject );
			};
		function getMoveObjectFunct(){
			var string = '';
			string += 'if( e.screenX < workSpace[0] || e.screenY < workSpace[1] || e.screenX > workSpace[2] || e.screenY > workSpace[3] ) removeMoveObject() else {';
			string += 'move = ['+(direction[0]?'e.screenX-mousZero[0]':0)+','+(direction[1]?'e.screenY-mousZero[1]':0)+'];';
			string += 'mousZero = [e.screenX, e.screenY];';
			if( !notMoveTarget )
				string += 'target.location = [target.location[0]+move[0], target.location[1]+move[1]];';
			if( withFunct && withFunct.constructor == Function )
				string += 'withFunct( move );';
			string += '}';
			return new Function( 'e', string );
			};
		}
	}
