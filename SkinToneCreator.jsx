/*
*
*
* Version 0.1
* Released 2023/05/30
*
*/
var drawColors = [[230, 198, 183], [218, 171, 145], [190, 142, 119], [129, 96, 79]];
var pathData = [[20, 20], [20, 40], [40, 40], [40, 20]];
var strokeRgb = [0, 0, 0]; // Example stroke color (black)
var shapeNames = [];
var textNames = [];
var strokeWidthpx = 1;
var shapeWidth = 448;
var shapeHeight = 252;
var groupName = "Skin Tone Collection"

/*
*
*/
createSkinPalette();

/*
*
*/
var message = "Shape layer names created:\n";
for (var j = 0; j < shapeNames.length; j++) {
  message += "- " + shapeNames[j] + "\n";
}
/*
*
*/
function createSkinPalette()
{
	for (var i = 0; i < drawColors.length; i++) {
	  var fillRgb = drawColors[i];
	  var shapeName = DrawShapeWithStroke(shapeWidth, shapeHeight, fillRgb, strokeRgb, strokeWidthpx);
	  shapeNames.push(shapeName);
	}
	// Move the shape layers
	positionShapeLayers(shapeNames);
	moveLayersToGroup(shapeNames);
	addTextLayers(shapeNames);
	convertGroupToSmartObject(groupName);
}
/*
*
*/
function convertGroupToSmartObject(groupName) {
  var doc = app.activeDocument;

  // Find the group layer
  var group = doc.layerSets.getByName(groupName);
  if (!group) {
    alert("Group not found: " + groupName);
    return null;
  }

  // Select the group
  doc.activeLayer = group;

  // Convert the group to a smart object
  var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer");
  executeAction(idnewPlacedLayer, undefined, DialogModes.NO);

  // Get the newly created smart object layer
  var smartObject = doc.activeLayer;
  smartObject.name = groupName + " Smart";

  return smartObject;
}
/*
*
*/
function alignTextLayerToLayer(textLayer, targetLayer) {
  var doc = app.activeDocument;
	if (targetLayer === null) return;
	
  // Select the text layer and target layer
  doc.activeLayer = textLayer;
  doc.activeLayer.selected = true;
  targetLayer.selected = true;

  // Align the text layer to the target layer
  //app.doAction(charIDToTypeID("Algn"), "AlignDistributeSet");
}
/*
*
*/
function createTextLayerWithContent(textContent, targetLayer) {
  var doc = app.activeDocument;
	  
	
	try {  
	  var targetLayerName = targetLayer.name
  } catch (e) {
	  alert(targetLayer.name);
    // Layer not found
    return null;
  }	
	
  // Create a new text layer
  var textLayer = doc.artLayers.add();
  textLayer.kind = LayerKind.TEXT;
  // Set the text content, font, and size
  var textItem = textLayer.textItem;
  textItem.contents = textContent;
  textItem.font = "Arial Black";
  textItem.size = 8; // in pt
  textItem.fauxBold = true;
	
	
  // Attempt to set the font to "Arial Black"
  var fonts = app.fonts;
  for (var i = 0; i < fonts.length; i++) {
    if (fonts[i].postScriptName === "Arial-Black") {
      textItem.font = fonts[i].postScriptName;
      break;
    }
  }	
  // Rename the text layer
  var textLayerName = getUniqueLayerName("TEXT " + textContent); 
  textLayer.name = textLayerName;
  // Set the text alignment to center
  textItem.justification = Justification.CENTER;
	
  moveLayerToGroup(textLayer, groupName)
	
	try {  
	  // Move the text layer before the target layer
	  textLayer.move(targetLayer, ElementPlacement.PLACEBEFORE);
  } catch (e) {
    // Layer not found
	  alert("Move the text layer before the target layer Failed");
    return null;
  }
	
	try {  
	  // Move the text layer after the target layer
	  moveTextLayerAfterLayerInGroup(textLayerName, targetLayerName, groupName);
  } catch (e) {
    // Layer not found
	  alert("Move the text layer after the target layer Failed");
    return null;
  }	
	try {  
	  // Align the text layer to the layer above it
	  alignLayerToReference(textLayerName, targetLayerName);
  } catch (e) {
	  alert("Align the text layer to the layer Failed");
    // Layer not found
    return null;
  }	

  //alignTextLayerToLayer(textLayer, targetLayer)
	
  textNames.push(textLayerName);
  return textLayer;
}
/*
*
*/
function alignLayerToReference(targetLayerName, referenceLayerName) {
  var doc = app.activeDocument;
  
  // Get the target layer and reference layer
  var targetLayer = getLayerByName(targetLayerName);
  var referenceLayer = getLayerByName(referenceLayerName);
  
  // Calculate the position of the reference layer
  var refBounds = referenceLayer.bounds;
  var refX = refBounds[0].value;
  var refY = refBounds[1].value;
  var refWidth = refBounds[2].value - refBounds[0].value;
  var refHeight = refBounds[3].value - refBounds[1].value;
  
  // Adjust the position of the target layer
  var targetBounds = targetLayer.bounds;
  var targetWidth = targetBounds[2].value - targetBounds[0].value;
  var targetHeight = targetBounds[3].value - targetBounds[1].value;
  var targetX = refX + (refWidth - targetWidth) / 2;
  var targetY = refY + (refHeight - targetHeight) / 2;

  targetLayer.translate(targetX - targetBounds[0].value, targetY - targetBounds[1].value);

}
/*
*
*/
function moveTextLayerAfterLayerInGroup(textLayerName, targetLayerName, groupName) {
  var doc = app.activeDocument;

  // Find the group
  var group = doc.layerSets.getByName(groupName);
  if (!group) {
    alert("Group not found: " + groupName);
    return;
  }

  // Find the text layer within the group
  var textLayer = getLayerByName(textLayerName);
  if (!textLayer || textLayer.kind !== LayerKind.TEXT) {
    alert("Text layer not found: " + textLayerName);
    return;
  }

  // Find the target layer within the group
  var targetLayer = getLayerByName(targetLayerName);
  if (!targetLayer) {
    alert("Target layer not found: " + targetLayerName);
    return;
  }

  // Move the text layer after the target layer
  textLayer.move(targetLayer, ElementPlacement.PLACEBEFORE);
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
function moveLayersToGroup(shapeNames) {
  createGroup(groupName)
  for (var j = 0; j < shapeNames.length; j++) {
    var currentLayer = getLayerByName(shapeNames[j]);
	if (currentLayer !== null ){
	  moveLayerToGroup(currentLayer, groupName);		  
		  
	  }
  }
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
function moveLayerToGroup(layer, groupName) {
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
*Function to generate a unique group name
*/
function getUniqueGroupName(baseName) {
  var doc = app.activeDocument;
  var name = baseName;
  var counter = 1;
  var layerSets = doc.layerSets;
  var numLayerSets = layerSets.length;
  while (isGroupNameTaken(name, layerSets)) {
    name = baseName + " " + counter;
    counter++;
  }

  return name;
}
/*
*
*/
function isGroupNameTaken(name, layerSets) {
  for (var i = 0; i < layerSets.length; i++) {
	  var currentName = layerSets[i].name;
    if (layerSets[i].name === name) {
      return true;
    }
  }
  return false;
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
function getUniqueLayerName(name) {
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
  var layer = findLayerByNameRecursively(layerName, doc);

  return layer;
}
/*
*
*/
function findLayerByNameRecursively(layerName, parent) {
  var layers = parent.layers;
  for (var i = 0; i < layers.length; i++) {
    var currentLayer = layers[i];
    if (currentLayer.typename === "LayerSet") {
      // Recursive call for nested groups
      var nestedLayer = findLayerByNameRecursively(layerName, currentLayer);
      if (nestedLayer !== null) {
        return nestedLayer;
      }
    } else if (currentLayer.name === layerName) {
      return currentLayer;
    }
  }
  // Layer not found
  return null;
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
function addTextLayers(shapeNames) {
	var currentLayer;
  for (var j = 0; j < shapeNames.length; j++) {
	  var shapeName = shapeNames[j];
    	currentLayer = getLayerByName(shapeName);
	  if (currentLayer !== null ){
	  createTextLayerWithContent(shapeName, currentLayer);
	  }
	  currentLayer = null;
  }
}