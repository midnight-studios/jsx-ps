var drawColors = [[0, 54, 255], [0, 200, 0], [190, 142, 119]];
var drawColors = [[230, 198, 183], [218, 171, 145], [190, 142, 119]];
var pathData = [[20, 20], [20, 40], [40, 40], [40, 20]];
var strokeRgb = [0, 0, 0]; // Example stroke color (black)
var shapeNames = [];
var strokeWidthpx = 10;
var shapeWidth = 100;
var shapeHeight = 200;

for (var i = 0; i < drawColors.length; i++) {
  var fillRgb = drawColors[i];
  var shapeName = DrawShapeWithStroke(shapeWidth, shapeHeight, fillRgb, strokeRgb, strokeWidthpx);
  shapeNames.push(shapeName);
}

// Move the shape layers
positionShapeLayers(shapeNames);

// Print the list of layer names
var message = "Shape layer names created:\n";
for (var j = 0; j < shapeNames.length; j++) {
  message += "- " + shapeNames[j] + "\n";
}
/*
*
*/
function DrawShapeWithStroke(width, height, fillColor, strokeColor, strokeWidth, layerName) {
    layerName = layerName || getUniqueShapeName("Color [" + fillColor.join(",") + "]");
    var idMk = charIDToTypeID("Mk  ");
    var idNm = charIDToTypeID("Nm  ");
    var baseDescriptor = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var refLayer = new ActionReference();
    var idcontentLayer = stringIDToTypeID("contentLayer");
    refLayer.putClass(idcontentLayer);
    baseDescriptor.putReference(idnull, refLayer);
    var idUsng = charIDToTypeID("Usng");
    var contentLayerDescriptor = new ActionDescriptor();
    var idType = charIDToTypeID("Type");
    var typeDescriptor = new ActionDescriptor();
    var idClr = charIDToTypeID("Clr ");
    var colorDescriptor = new ActionDescriptor();
    var idRd = charIDToTypeID("Rd  ");
    colorDescriptor.putDouble(idRd, fillColor[0]);
    var idGrn = charIDToTypeID("Grn ");
    colorDescriptor.putDouble(idGrn, fillColor[1]);
    var idBl = charIDToTypeID("Bl  ");
    colorDescriptor.putDouble(idBl, fillColor[2]);
    var idRGBC = charIDToTypeID("RGBC");
    typeDescriptor.putObject(idClr, idRGBC, colorDescriptor);
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    contentLayerDescriptor.putObject(idType, idsolidColorLayer, typeDescriptor);
    var idShp = charIDToTypeID("Shp ");
    var shapeDescriptor = new ActionDescriptor();
    var idTop = charIDToTypeID("Top ");
    var idPxl = charIDToTypeID("#Pxl");
    shapeDescriptor.putUnitDouble(idTop, idPxl, 0.000000);
    var idLeft = charIDToTypeID("Left");
    shapeDescriptor.putUnitDouble(idLeft, idPxl, 0.000000);
    var idBtom = charIDToTypeID("Btom");
    shapeDescriptor.putUnitDouble(idBtom, idPxl, height);
    var idRght = charIDToTypeID("Rght");
    shapeDescriptor.putUnitDouble(idRght, idPxl, width);
    var idRctn = charIDToTypeID("Rctn");
    contentLayerDescriptor.putObject(idShp, idRctn, shapeDescriptor);
    var idstrokeStyle = stringIDToTypeID("strokeStyle");
    var strokeStyleDescriptor = new ActionDescriptor();
    var idstrokeStyleVersion = stringIDToTypeID("strokeStyleVersion");
    strokeStyleDescriptor.putInteger(idstrokeStyleVersion, 2);
    var idstrokeEnabled = stringIDToTypeID("strokeEnabled");
    strokeStyleDescriptor.putBoolean(idstrokeEnabled, true);
    var idfillEnabled = stringIDToTypeID("fillEnabled");
    strokeStyleDescriptor.putBoolean(idfillEnabled, true);
    var idstrokeStyleLineWidth = stringIDToTypeID("strokeStyleLineWidth");
    strokeStyleDescriptor.putUnitDouble(idstrokeStyleLineWidth, idPxl, strokeWidth);
    var idstrokeStyleContent = stringIDToTypeID("strokeStyleContent");
    var strokeContentDescriptor = new ActionDescriptor();
    var idClr = charIDToTypeID("Clr ");
    var strokeColorDescriptor = new ActionDescriptor();
    var idRd = charIDToTypeID("Rd  ");
    strokeColorDescriptor.putDouble(idRd, strokeColor[0]);
    var idGrn = charIDToTypeID("Grn ");
    strokeColorDescriptor.putDouble(idGrn, strokeColor[1]);
    var idBl = charIDToTypeID("Bl  ");
    strokeColorDescriptor.putDouble(idBl, strokeColor[2]);
    var idRGBC = charIDToTypeID("RGBC");
    strokeContentDescriptor.putObject(idClr, idRGBC, strokeColorDescriptor);
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    strokeStyleDescriptor.putObject(idstrokeStyleContent, idsolidColorLayer, strokeContentDescriptor);
    contentLayerDescriptor.putObject(idstrokeStyle, idstrokeStyle, strokeStyleDescriptor);
    baseDescriptor.putObject(idUsng, idcontentLayer, contentLayerDescriptor);
    executeAction(idMk, baseDescriptor, DialogModes.NO);
    if (layerName) {
        app.activeDocument.activeLayer.name = layerName;
    }
    return layerName;
}
/*
*
*/
function DrawShape(rgb, pathCoordinates) {
  var layerName = getUniqueShapeName("Color [" + rgb.join(",") + "]");
  var doc = app.activeDocument;
  var y = pathCoordinates.length;
  var i = 0;
  var lineArray = [];
  var color = new RGBColor()
  var lineSubPathArray = new SubPathInfo();
  var solidColorLayerDescriptor = new ActionDescriptor();
  var createActionDescriptor = new ActionDescriptor();
  var rgbColorClassID = new ActionDescriptor();
  var contentLayerRef = new ActionReference();
  var colorDescriptor = new ActionDescriptor();
  var colorDesc = new ActionDescriptor();
  var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
  var idcontentLayer = stringIDToTypeID( "contentLayer" );
  var idRGBC = charIDToTypeID("RGBC");
  var makeCommandID = charIDToTypeID("Mk  ")
  var idType = charIDToTypeID( "Type" );
  var idUsng = charIDToTypeID( "Usng" );
  var idnull = charIDToTypeID( "null" );
  var idClr = charIDToTypeID( "Clr " );
  var idRd = charIDToTypeID( "Rd  " );
  var idGrn = charIDToTypeID( "Grn " );
  var idBl = charIDToTypeID( "Bl  " );
  var idNm = charIDToTypeID("Nm  ");
  color.red = rgb[0];
  color.green = rgb[1];
  color.blue = rgb[2];
  for (i = 0; i < y; i++) {
    lineArray[i] = new PathPointInfo();
    lineArray[i].kind = PointKind.CORNERPOINT;
    lineArray[i].anchor = pathCoordinates[i];
    lineArray[i].leftDirection = lineArray[i].anchor;
    lineArray[i].rightDirection = lineArray[i].anchor;
  }
  lineSubPathArray.closed = true;
  lineSubPathArray.operation = ShapeOperation.SHAPEADD;
  lineSubPathArray.entireSubPath = lineArray;
  var newPathItem = doc.pathItems.add(layerName, [lineSubPathArray]);
  contentLayerRef.putClass(idcontentLayer);
  rgbColorClassID.putReference(idnull, contentLayerRef);
  colorDesc.putDouble(idRd, color.red);
  colorDesc.putDouble(idGrn, color.green);
  colorDesc.putDouble(idBl, color.blue);
  colorDescriptor.putObject(idClr, idRGBC, colorDesc);
  solidColorLayerDescriptor.putObject(idType, idsolidColorLayer, colorDescriptor);
  if (layerName) { solidColorLayerDescriptor.putString(idNm, "" + layerName + "");}
  rgbColorClassID.putObject(idUsng, idcontentLayer, solidColorLayerDescriptor);
  executeAction(makeCommandID, rgbColorClassID, DialogModes.NO);
  newPathItem.remove();
  return layerName;
}
/*
*
*/
function findGroupByName(groupName) {
  var doc = app.activeDocument;
  var group = null;
  
  for (var i = 0; i < doc.layerSets.length; i++) {
    var currentGroup = doc.layerSets[i];
    if (currentGroup.name === groupName) {
      group = currentGroup;
      break;
    }
  }
  
  return group;
}
/*
*
*/
function moveLayerToGroup(layerName, groupName) {
  var doc = app.activeDocument;

  // Find the layer by name
  var layer = doc.layers.getByName(layerName);
  var foundGroup = findGroupByName(groupName)
  // Move the layer to the group
  layer.move(foundGroup, ElementPlacement.INSIDE);
}
/*
*
*/
function createGroup(groupName) {
  var doc = app.activeDocument;
    // Create a new group
  var group = doc.layerSets.add();
  var newGroupName = getUniqueGroupName(groupName)
  group.name = newGroupName;
  // Optional: Select the group to make it active
  group.visible = true;
  //doc.activeLayer = group;
  return newGroupName;
}
/*
*
*/
function getUniqueShapeName(name) {
  var uniqueName = name;
  var counter = 1;
  while (isLayerNameExists(uniqueName)) {
    uniqueName = name + " " + counter;
    counter++;
  }
  return uniqueName;
}
/*
*Function to generate a unique group name
*/
function getUniqueGroupName(baseName) {
  var doc = app.activeDocument;
  var name = baseName;
  var counter = 1;

  while (doc.layerSets.getByName(name) !== undefined) {
    name = baseName + " " + counter;
    counter++;
  }

  return name;
}
/*
*
*/
function getUniqueShapeName(name) {
  var uniqueName = name;
  var counter = 1;
  while (isLayerNameExists(uniqueName)) {
    uniqueName = name + " " + counter;
    counter++;
  }
  return uniqueName;
}
/*
*
*/
function isLayerNameExists(name) {
  var layers = app.activeDocument.layers;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].name === name) {
      return true;
    }
  }
  return false;
}
/*
*
*/
function getLayerByName(layerName) {
  var doc = app.activeDocument;
  try {
    var layer = doc.layers.getByName(layerName);
    return layer;
  } catch (e) {
    // Layer not found
    return null;
  }
}
/*
*
*/
function getLayerStrokeWidthByName(layerName) {
    // Create an ActionReference object to refer to the layer by its name
    var ref = new ActionReference();
    ref.putName(stringIDToTypeID('layer'), layerName);

    // Create an ActionDescriptor object and set the reference to the layer
    var layerDescriptor = new ActionDescriptor();
    layerDescriptor.putReference(stringIDToTypeID('null'), ref);

    // Create an ActionReference object to get the stroke style information
    var strokeRef = new ActionReference();
    strokeRef.putProperty(stringIDToTypeID('property'), stringIDToTypeID('AGMStrokeStyleInfo'));

    // Set the stroke reference as a property of the layer
    layerDescriptor.putReference(stringIDToTypeID('to'), strokeRef);

    // Execute the 'get' action to retrieve the stroke style information
    var result = executeAction(stringIDToTypeID('get'), layerDescriptor, DialogModes.NO);

    // Extract the stroke width from the returned result
    var strokeWidth = result.getObjectValue(stringIDToTypeID('AGMStrokeStyleInfo'))
        .getUnitDoubleValue(stringIDToTypeID('strokeStyleLineWidth'));

    return strokeWidth;
}
/*
*
*/
function getLayerStrokeWidthByObject(layerObject) {
    // Check if the layer object has the correct layer kind (shape layer)
    var layerKindRef = new ActionReference();
    layerKindRef.putProperty(stringIDToTypeID('property'), stringIDToTypeID('layerKind'));
    layerKindRef.putIdentifier(stringIDToTypeID('layer'), layerObject.id);
    var layerKind = executeActionGet(layerKindRef).getInteger(stringIDToTypeID('layerKind'));

    // If the layer object is a shape layer, retrieve its stroke width
    if (layerKind === 4) {
        // Create an ActionReference object to refer to the layer by its ID
        var layerRef = new ActionReference();
        layerRef.putIdentifier(stringIDToTypeID('layer'), layerObject.id);

        // Create an ActionDescriptor object and set the reference to the layer
        var layerDesc = new ActionDescriptor();
        layerDesc.putReference(stringIDToTypeID('null'), layerRef);

        // Create an ActionReference object to get the stroke style information
        var strokeRef = new ActionReference();
        strokeRef.putProperty(stringIDToTypeID('property'), stringIDToTypeID('AGMStrokeStyleInfo'));

        // Set the stroke reference as a property of the layer
        layerDesc.putReference(stringIDToTypeID('to'), strokeRef);

        // Execute the 'get' action to retrieve the stroke style information
        var result = executeAction(stringIDToTypeID('get'), layerDesc, DialogModes.NO);

        // Extract the stroke width from the returned result
        var strokeWidth = result.getObjectValue(stringIDToTypeID('AGMStrokeStyleInfo'))
            .getUnitDoubleValue(stringIDToTypeID('strokeStyleLineWidth'));

        return strokeWidth;
    } else {
        // If the layer object is not a shape layer, return null or an appropriate value
        return null;
    }
}
/*
*
*/
function convertPixelsToUnits(layer, valueInPixels) {
  var doc = app.activeDocument;
  // Get the current ruler units
  var currentRulerUnits        = app.preferences.rulerUnits;
  var currentTypeUnits         = app.preferences.typeUnits;
  var valueInUnits;
  switch (currentRulerUnits) {
    case Units.INCHES:
      valueInUnits = "in";
      break;
    case Units.CM:
      valueInUnits = "cm";
      break;
    case Units.MM:
      valueInUnits = "mm";
      break;
	  case Units.POINTS:
     valueInUnits = "pt";
      break;
    case Units.PICAS:
      valueInUnits = "pc";
      break;
    default:
      // Use pixels as fallback if the current ruler unit is not recognized
      valueInUnits = valueInPixels + " px";
      break;
  }
  // Get the bounds of the active layer
  var layerBounds = layer.bounds;
  // Convert the pixel value to the same units as the layer bounds
  //var valueInUnits = new UnitValue(valueInPixels, "px").as(defaultRulerUnits);
  var valueInUnits = (new UnitValue(valueInPixels, 'px')).as(valueInUnits);
  // Restore the default ruler units
  app.preferences.rulerUnits = currentRulerUnits;
  app.preferences.typeUnits = currentTypeUnits;
  return valueInUnits;
}
/*
*
*/
function positionShapeLayers(shapeNames) {
  for (var j = 0; j < shapeNames.length; j++) {
    var previousLayer = getLayerByName(shapeNames[j-1]);
    var currentLayer = getLayerByName(shapeNames[j]);
    var currentBounds = currentLayer.bounds;
    var deltaX, deltaY;
    if (previousLayer) {
      var previousBounds = previousLayer.bounds;
	  var stroke = getLayerStrokeWidthByObject(previousLayer);
      var layerWidth = currentBounds[2] - currentBounds[0];
      var layerHeight = currentBounds[3] -currentBounds[1];

      deltaX = 0 - currentBounds[0] - previousBounds[0];
      deltaY = 0 - currentBounds[1] - previousBounds[1] - currentBounds[3] + convertPixelsToUnits(previousLayer, stroke);
    } else {
      deltaX = 0 - currentBounds[0];
      deltaY = 0 - currentBounds[1];
    }
	  currentLayer.translate(-deltaX, -deltaY);
  }
}
/*
*
*/
function moveShapeLayers(shapeNames) {
  for (var j = 0; j < shapeNames.length; j++) {
    var previousLayer = getLayerByName(shapeNames[j-1]);
    var currentLayer = getLayerByName(shapeNames[j]);
    var currentBounds = currentLayer.bounds;
    var deltaX, deltaY;

    if (previousLayer) {
      var previousBounds = previousLayer.bounds;
      var layerHeight = currentBounds[3].value;
      var layerWidth = currentBounds[2].value;
      deltaX = 0 - currentBounds[0] - previousBounds[0];
      deltaY = 0 - currentBounds[1] - previousBounds[1] - (layerWidth / 2);
    } else {
      deltaX = 0 - currentBounds[0];
      deltaY = 0 - currentBounds[1];
    }
	  currentLayer.translate(-deltaX, -deltaY);
  }
}

/*



var doc 					= 	app.activeDocument;
var startRulerUnits			= 	app.preferences.rulerUnits;
var startTypeUnits			= 	app.preferences.typeUnits;
								app.preferences.rulerUnits = Units.MM;
								app.preferences.typeUnits = TypeUnits.MM;





var sizeInCm = 1;
var newLayerName = "Skin Tone A";
var rgbValues = [230,198,183]; // RGB(255, 255, 255) = white

function createSolidColor(newLayerName, rgb)
{
    var fillDesc			= new ActionDescriptor();
    var desc 				= new ActionDescriptor();
	var ref 				= new ActionReference();
	var idType 				= charIDToTypeID( "Type" );
	var idClr 				= charIDToTypeID( "Clr " );
	var idRd 				= charIDToTypeID( "Rd  " );
	var idGrn 				= charIDToTypeID( "Grn " );
	var idBl 				= charIDToTypeID( "Bl  " );
	var idMk 				= charIDToTypeID( "Mk  " );
	var idRGBC 				= charIDToTypeID( "RGBC" );
    var idnull 				= charIDToTypeID( "null" );
	var idUsng 				= charIDToTypeID( "Usng" );
	var idsolidColorLayer 	= stringIDToTypeID( "solidColorLayer" );
	var idcontentLayer 		= stringIDToTypeID( "contentLayer" );
	fillDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
	ref.putClass( idcontentLayer );
	desc.putReference( idnull, ref );
	var item 			= new ActionDescriptor();
	if (newLayerName)
	{
		item.putString( charIDToTypeID( "Nm  " ), "" + newLayerName + "" );
	}
	item.putObject( idType, idsolidColorLayer, fillDesc );
	desc.putObject( charIDToTypeID( "Usng" ), stringIDToTypeID( "contentLayer" ), item );
	executeAction( idMk, desc, DialogModes.NO );
}


function DrawShape(newLayerNamergb, pathCoordinates) {
    
    var doc = app.activeDocument;
    var y = pathCoordinates.length;
    var i = 0;
    
    var lineArray = [];
    for (i = 0; i < y; i++) {
        lineArray[i] = new PathPointInfo;
        lineArray[i].kind = PointKind.CORNERPOINT;
        lineArray[i].anchor = arguments[i];
        lineArray[i].leftDirection = lineArray[i].anchor;
        lineArray[i].rightDirection = lineArray[i].anchor;
    }

    var lineSubPathArray = new SubPathInfo();
    lineSubPathArray.closed = true;
    lineSubPathArray.operation = ShapeOperation.SHAPEADD;
    lineSubPathArray.entireSubPath = lineArray;
    var myPathItem = doc.pathItems.add("myPath", [lineSubPathArray]);
    
	var rgb = [230,198,183]; // RGB(255, 255, 255) = white

	var color = new RGBColor();
	color.red = rgb[0];
	color.green = rgb[1];
	color.blue = rgb[2];	
	
	
	
	
    var desc88 = new ActionDescriptor();
    var ref60 = new ActionReference();
    ref60.putClass(stringIDToTypeID("contentLayer"));
    desc88.putReference(charIDToTypeID("null"), ref60);
    var desc89 = new ActionDescriptor();
    var desc90 = new ActionDescriptor();
    var desc91 = new ActionDescriptor();
	var colorDesc 			= new ActionDescriptor();
	colorDesc.putDouble(charIDToTypeID("Rd  "), color.red);
	colorDesc.putDouble(charIDToTypeID("Grn "), color.green);
	colorDesc.putDouble(charIDToTypeID("Bl  "), color.blue);
    var id481 = charIDToTypeID("RGBC");
    desc90.putObject(charIDToTypeID("Clr "), id481, colorDesc);
    desc89.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), desc90);
	if (newLayerName)
	{
		desc89.putString( charIDToTypeID( "Nm  " ), "" + newLayerName + "" );
	}
    desc88.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), desc89);
    executeAction(charIDToTypeID("Mk  "), desc88, DialogModes.NO);
    
    myPathItem.remove();
}

// X,Y
// Put the coordinates in clockwise order
DrawShape([100, 100], [100, 200], [200, 200], [200, 100]);
DrawShape([512, 128], [600, 256], [684, 320], [600, 386], [686, 514], [512, 450],[340,512],[428,386],[340,320],[428,256]);



 //make a new document
function createArtLayer(newLayerName, rgbValues)
{
    createSolidColor(newLayerName, rgbValues);
	convertSolidFillToShapeLayer(newLayerName)
    //var fillThis = doc.artLayers.getByName(newLayerName)
    //doc.activeLayer = fillThis
    //var colorValue = colorValue;
    //setColor(colorValue,newLayerName);
    //selectPath() ;
    //makePath();
    //convertPath();
}

function createSolidColor(newLayerName, rgb)
{
	var color 				= new RGBColor();
	color.red = rgb[0];
	color.green = rgb[1];
	color.blue = rgb[2];
    var fillDesc			= new ActionDescriptor();
	var colorDesc 			= new ActionDescriptor();
    var desc 				= new ActionDescriptor();
	var ref 				= new ActionReference();
	var item 			= new ActionDescriptor();
	var idType 				= charIDToTypeID( "Type" );
	var idClr 				= charIDToTypeID( "Clr " );
	var idRd 				= charIDToTypeID( "Rd  " );
	var idGrn 				= charIDToTypeID( "Grn " );
	var idBl 				= charIDToTypeID( "Bl  " );
	var idMk 				= charIDToTypeID( "Mk  " );
	var idRGBC 				= charIDToTypeID( "RGBC" );
    var idnull 				= charIDToTypeID( "null" );
	var idUsng 				= charIDToTypeID( "Usng" );
	var idsolidColorLayer 	= stringIDToTypeID( "solidColorLayer" );
	var idcontentLayer 		= stringIDToTypeID( "contentLayer" );
	colorDesc.putDouble(charIDToTypeID("Rd  "), color.red);
	colorDesc.putDouble(charIDToTypeID("Grn "), color.green);
	colorDesc.putDouble(charIDToTypeID("Bl  "), color.blue);
	fillDesc.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc);
	ref.putClass( idcontentLayer );
	desc.putReference( idnull, ref );
	if (newLayerName)
	{
		item.putString( charIDToTypeID( "Nm  " ), "" + newLayerName + "" );
	}
	item.putObject( idType, idsolidColorLayer, fillDesc );
	desc.putObject( idUsng, idcontentLayer, item );
	executeAction( idMk, desc, DialogModes.NO );
}



 //make a new document
function createArtLayerOLD(newLayerName, colorValue)
{
    createSolidColor(newLayerName);
    //var fillThis = doc.artLayers.getByName(newLayerName)
    //doc.activeLayer = fillThis
    //var colorValue = colorValue;
    //setColor(colorValue,newLayerName);
    //selectPath() ;
    //makePath();
    //convertPath();
}
 
function createSolidColorOLD(newLayerName)
{
    var desc 				= new ActionDescriptor();
	var ref 				= new ActionReference();
	var desc102 			= new ActionDescriptor();
	var desc103 			= new ActionDescriptor();
	var desc104 			= new ActionDescriptor();
	var idType 				= charIDToTypeID( "Type" );
	var idClr 				= charIDToTypeID( "Clr " );
	var idRd 				= charIDToTypeID( "Rd  " );
	var idGrn 				= charIDToTypeID( "Grn " );
	var idBl 				= charIDToTypeID( "Bl  " );
	var idMk 				= charIDToTypeID( "Mk  " );
	var idRGBC 				= charIDToTypeID( "RGBC" );
    var idnull 				= charIDToTypeID( "null" );
	var idUsng 				= charIDToTypeID( "Usng" );
	var idsolidColorLayer 	= stringIDToTypeID( "solidColorLayer" );
	var idcontentLayer 		= stringIDToTypeID( "contentLayer" );
	var idcontentLayer 		= stringIDToTypeID( "contentLayer" );
	desc104.putDouble( idRd, 230 );
	desc104.putDouble( idGrn, 198 );
	desc104.putDouble( idBl, 183 );
	ref.putClass( idcontentLayer );
	desc.putReference( idnull, ref );
	if (newLayerName)
	{
		var idNm = charIDToTypeID( "Nm  " );
		desc102.putString( idNm, "" + newLayerName + "" );
	}
	desc103.putObject( idClr, idRGBC, desc104 );
	desc102.putObject( idType, idsolidColorLayer, desc103 );
	desc.putObject( idUsng, idcontentLayer, desc102 );
	executeAction( idMk, desc, DialogModes.NO );
}

function setColor(colorValue,newLayerName)
{
    var sColor =  new SolidColor;  
    sColor.rgb.hexValue = colorValue;  
    app.activeDocument.activeLayer = app.activeDocument.layers.getByName(newLayerName);  
    setColorOfFillLayer( sColor );
}
function setColorOfFillLayer( sColor ) 
{     
    var desc = new ActionDescriptor();  
    var ref = new ActionReference();  
     ref.putEnumerated( stringIDToTypeID('contentLayer'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );  
    desc.putReference( charIDToTypeID('null'), ref );  
	var fillDesc = new ActionDescriptor();  
	var colorDesc = new ActionDescriptor();  
	colorDesc.putDouble( charIDToTypeID('Rd  '), sColor.rgb.red );  
	colorDesc.putDouble( charIDToTypeID('Grn '), sColor.rgb.green );  
	colorDesc.putDouble( charIDToTypeID('Bl  '), sColor.rgb.blue );  
	fillDesc.putObject( charIDToTypeID('Clr '), charIDToTypeID('RGBC'), colorDesc );  
    desc.putObject( charIDToTypeID('T   '), stringIDToTypeID('solidColorLayer'), fillDesc );  
    executeAction( charIDToTypeID('setd'), desc, DialogModes.NO );  
}
function selectPath() {
// =======================================================
	var idsetd = charIDToTypeID( "setd" );
	var desc81 = new ActionDescriptor();
	var idnull = charIDToTypeID( "null" );
	var ref26 = new ActionReference();
	var idChnl = charIDToTypeID( "Chnl" );
	var idfsel = charIDToTypeID( "fsel" );
	ref26.putProperty( idChnl, idfsel );
	desc81.putReference( idnull, ref26 );
	var idT = charIDToTypeID( "T   " );
	var ref27 = new ActionReference();
	var idChnl = charIDToTypeID( "Chnl" );
	var idChnl = charIDToTypeID( "Chnl" );
	var idTrsp = charIDToTypeID( "Trsp" );
	ref27.putEnumerated( idChnl, idChnl, idTrsp );
	desc81.putReference( idT, ref27 );
	executeAction( idsetd, desc81, DialogModes.NO );
}
function makePath() { 
// =======================================================
	var idMk = charIDToTypeID( "Mk  " );
	var desc82 = new ActionDescriptor();
	var idnull = charIDToTypeID( "null" );
	var ref28 = new ActionReference();
	var idPath = charIDToTypeID( "Path" );
	ref28.putClass( idPath );
	desc82.putReference( idnull, ref28 );
	var idFrom = charIDToTypeID( "From" );
	var ref29 = new ActionReference();
	var idcsel = charIDToTypeID( "csel" );
	var idfsel = charIDToTypeID( "fsel" );
	ref29.putProperty( idcsel, idfsel );
	desc82.putReference( idFrom, ref29 );
	var idTlrn = charIDToTypeID( "Tlrn" );
	var idPxl = charIDToTypeID( "#Pxl" );
	desc82.putUnitDouble( idTlrn, idPxl, 2.000000 );
	executeAction( idMk, desc82, DialogModes.NO );
}

function convertPath() {
// =======================================================
var idMk = charIDToTypeID( "Mk  " );
    var desc83 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref30 = new ActionReference();
        var idPath = charIDToTypeID( "Path" );
        ref30.putClass( idPath );
    desc83.putReference( idnull, ref30 );
    var idAt = charIDToTypeID( "At  " );
        var ref31 = new ActionReference();
        var idPath = charIDToTypeID( "Path" );
        var idPath = charIDToTypeID( "Path" );
        var idvectorMask = stringIDToTypeID( "vectorMask" );
        ref31.putEnumerated( idPath, idPath, idvectorMask );
    desc83.putReference( idAt, ref31 );
    var idUsng = charIDToTypeID( "Usng" );
        var ref32 = new ActionReference();
        var idPath = charIDToTypeID( "Path" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref32.putEnumerated( idPath, idOrdn, idTrgt );
    desc83.putReference( idUsng, ref32 );
executeAction( idMk, desc83, DialogModes.NO );
}



var originalHeight = 900;
var originalWidth = 600;
var newHeight;
var newWidth =1500;
var calculateHeight = (originalHeight / originalWidth * newWidth);
var calculateWidth = (originalHeight / originalWidth * newHeight);


//Aspect ratio is calculated by deviding the width by the height


var calculate = originalHeight / originalWidth //getRatio(originalHeight,originalWidth,newWidth);
// 

var x1v, y1v, ratio;
x1v = 9;
y1v = 6;

                // display new ratio
        ratio = reduceRatio(x1v, y1v);
        
        
        
        alert(newWidth*calculate);


function getRatio(a,b,i){
   return ((a/b)*i);
    }
    
    function reduceRatio(numerator, denominator) {
        var gcd, temp, divisor;
                // from: http://pages.pacificcoast.net/~cazelais/euclid.html
        gcd = function (a, b) { 
            if (b === 0) return a;
            return gcd(b, a % b);
        }
                // take care of some simple cases
        if (!isInteger(numerator) || !isInteger(denominator)) return '? : ?';
        if (numerator === denominator) return '1 : 1';
                // make sure numerator is always the larger number
        if (+numerator < +denominator) {
            temp        = numerator;
            numerator   = denominator;
            denominator = temp;
        }
                divisor = gcd(+numerator, +denominator);
                return 'undefined' === typeof temp ? (numerator / divisor) + ' : ' + (denominator / divisor) : (denominator / divisor) + ' : ' + (numerator / divisor);
    }

    function isInteger(value) {
        return /^[0-9]+$/.test(value);
    };

var doc = app.activeDocument;

var rightPage =  app.activeDocument.layers["Album Frame Reference"].layers["Right Page"]
var leftQuad =  app.activeDocument.layers["Album Frame Reference"].layers["Right Page"].layers["Page Quadrants"].layers["Top Left"]
var rightQuad =  rightPage.layers["Page Quadrants"].layers["Top Left"]


var selectItem;

selectItem =rightQuad;
//app.activeDocument.activeLayer = rightQuad;



selectVectorMask(selectItem.name);

//var iStatus = false;







 function selectVectorMask(layerName)
{
   
    
// =======================================================
    var idsetd = charIDToTypeID( "setd" );
        var desc = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref = new ActionReference();
            var idChnl = charIDToTypeID( "Chnl" );
            var idfsel = charIDToTypeID( "fsel" );
            ref.putProperty( idChnl, idfsel );
        desc.putReference( idnull, ref );
        var idT = charIDToTypeID( "T   " );
            var ref = new ActionReference();
            var idPath = charIDToTypeID( "Path" );
            var idPath = charIDToTypeID( "Path" );
            var idvectorMask = stringIDToTypeID( "vectorMask" );
            ref.putEnumerated( idPath, idPath, idvectorMask );
            var idLyr = charIDToTypeID( "Lyr " );
            ref.putName( idLyr, layerName);
        desc.putReference( idT, ref );
        var idVrsn = charIDToTypeID( "Vrsn" );
        desc.putInteger( idVrsn, 1 );
        var idvectorMaskParams = stringIDToTypeID( "vectorMaskParams" );
        desc.putBoolean( idvectorMaskParams, true );
    
            try{
            executeAction( idsetd, desc, DialogModes.NO );
            }
        catch(e)
        {
            alert('no selection');
            };
        
}





alert(layer.active);

alert(iStatus);



move the layers into the layerset  


     */