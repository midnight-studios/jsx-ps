/*<javascriptresource>  <name>BCM00> selectByName...</name>  <category>BCM</category></javascriptresource>*//////////////////////////////////////////////*Author: Buliarca Cristian (buliarca@yahoo.com)Copyright (C) 2013 Buliarca Cristianhttp://buliarca.blog124.fc2.com/http://buliarcatools.blog.fc2.com/Installation:  Close Photoshop  and copy the script in your Photoshop scripts folder:    "c:\Program Files\Adobe\Adobe Photoshop CS5 (64 Bit)\Presets\Scripts"   for osx:  "/Applications/Adobe Photoshop CS6/Presets/Scripts/"    Then restart Photoshop and you will see the scripts in the File>Scripts menuVersion: 1.0Function:  this script opens a window where you can type the layer name that you want to select and it will  return a list of corresponding layers  To search you can type only a part of the layer name  Also if you want to select a layer that's in a group you can type first the layer name  or a part of it, followed by "@" and the group name    example: ao@DIF (this will list only the layers that are in the DIFFUSE group and have "ao"    inside the name)  For default the script will select only one layer, the first layer found.  You can see the layer that will be selected is the layer highlighted in the list bellow the typing  field.  If you want more than one layer to be selected you have to select them in the list  You can also type at the end of your searching string the "*" this will select all your results  Beside mouse navigation you can use some shortcut keys to navigate in the window  To switch between the typing field and the resulting list use the Tab key  To select in the list press Shift or Ctrl  To close the window and select the results press Enter  To close the window without selecting anything press Esc  Tested and works in photoshop versions:   CS3, CS4, CS5, CS6, CC  in CS6 on the osx system after closing the script Photoshop crashes to avoid this   you will have to change the line number 74 with this:  var mbSimpleSwitch = true;//make this true if you have problems with the UI  Use and/or modify at your own risk.*/////////////////////////////////////////////function getVersion(){  var version = parseInt(app.version);  return version;}// alert(getVersion());switch (getVersion()){  case 10://cs3  var mbSimpleSwitch = true;//make this true if you have problems with the UI  break;   case 11://cs4  var mbSimpleSwitch = false;//make this true if you have problems with the UI  break;   case 12://cs5  var mbSimpleSwitch = false;//make this true if you have problems with the UI  break;        case 13://cs6  var mbSimpleSwitch = false;//make this true if you have problems with the UI  break;   case 14://CC  var mbSimpleSwitch = true;//make this true if you have problems with the UI  break;   }mainUI();function mainUI(){if(!documents.length) return;cLayerIDX =  getSelectedLayersIdx();openedGroups = new Array();var MBresult = new Array();    var bcmFS = new Window("dialog", "BCM FastSelection", {width:700,height:120,x:800,y:150},{resizeable:true, borderless:false});    g = bcmFS.graphics;    // g.font = ScriptUI.newFont("Arial","BOLD",13);    var intCol = 0;    try{getVersion()>12?intCol = getInterfaceColor():intCol=0}catch(err){};      try{        switch (intCol)        {          case 145:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.3, 0.3, 0.3, 1]);            break;          case 79:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.3, 0.3, 0.3, 1]);            break;          case 3064:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.6, 0.6, 0.6, 1]);            break;          case 3065:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.8, 0.8, 0.8, 1]);            break;          case 0:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.9, 0.9, 0.9, 1]);            break;          default:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.8, 0.8, 0.8, 1]);            break;        }        g.backgroundColor = myBrush;      }catch(err){}        layerNames = getNamesIdsParents();        // alert(mbCompare("la@3", layerNames));//this is a test        bcmFS.et = bcmFS.add ("edittext", {width:680,height:20, x:10, y:10}, "");        if(mbSimpleSwitch == false){          try{              bcmFS.dr = bcmFS.add ("listbox", {width:680,height:bcmFS.bounds.height-40, x:10, y:30},"",{name:"mbListBox",multiselect:true,numberOfColumns:4,showHeaders: true,columnWidths:[100,300,100,100],columnTitles:['Layer name','parents', 'Index','isLayerSet?']});            }catch(err){              mbSimpleSwitch = true;              bcmFS.dr = bcmFS.add ("listbox", {width:680,height:bcmFS.bounds.height-40, x:10, y:30},"",{name:"mbListBox",multiselect:true});              setTheFont();            }        }else{            bcmFS.dr = bcmFS.add ("listbox", {width:680,height:bcmFS.bounds.height-40, x:10, y:30},"",{name:"mbListBox",multiselect:true});            setTheFont();         }          for(var z in layerNames)            {              if(mbSimpleSwitch == true)              {                dispStr1 = createDispStr(layerNames[z]);                bcmFS.dr.add('item',dispStr1);              }else{                bcmFS.dr.add('item',layerNames[z].name.toString());                bcmFS.dr.items[z].subItems[0].text = layerNames[z].parents;                bcmFS.dr.items[z].subItems[1].text = layerNames[z].idx;                bcmFS.dr.items[z].subItems[2].text = layerNames[z].isSet;              }            }        bcmFS.okBtn = bcmFS.add("button",{width:40,height:20, x:10, y:bcmFS.bounds.height-25},"OK",{name:"ok"} );        bcmFS.cancelBtn = bcmFS.add("button",{width:60,height:20, x:bcmFS.bounds.width-70, y:bcmFS.bounds.height-25},"Cancel",{name:"cancel"} );        bcmFS.okBtn.visible = false;        bcmFS.cancelBtn.visible = false;        bcmFS.okBtn.onClick = function(){            theI = new Array();            var d = 0;            while(d != bcmFS.dr.children.length)            {              sl = bcmFS.dr.items[d].selected;              if(sl == true)              {                if(mbSimpleSwitch == true){                  theI.push(parseInt(getIdxFromResult(bcmFS.dr.items[d])));                }else{                  theI.push(parseInt(bcmFS.dr.items[d].subItems[1]));                }                                }              d++;            }            for(f in theI){              if(isLayerSet(theI[f]))              {                openGroup1byIDX(theI[f]);              }            }            makeActiveByIndex(theI,false);            bcmFS.close();        }        bcmFS.cancelBtn.onClick = function(){          bcmFS.close();        }        bcmFS.et.active = true;        bcmFS.et.focus =  true;        bcmFS.et.onChanging = function(){                    removeListChilds();                    theText = bcmFS.et.text;                      MBresult = mbCompare(bcmFS.et.text,layerNames);                      for(var z in MBresult){                        if(mbSimpleSwitch == true)                        {                          dispStr = createDispStr(MBresult[z]);                          bcmFS.dr.add('item',dispStr);                        }else{                          bcmFS.dr.add('item',MBresult[z].name);                          bcmFS.dr.items[z].subItems[0].text = MBresult[z].parents;                          bcmFS.dr.items[z].subItems[1].text = MBresult[z].idx;                          bcmFS.dr.items[z].subItems[2].text = MBresult[z].isSet;                        }                                                }                                            if(theText[theText.length-1] == "*"){                        var rr=0;                        while(rr != bcmFS.dr.children.length)                        {                          bcmFS.dr.items[rr].selected = true;                          rr++;                        }                      }else{bcmFS.dr.items[0].selected = true;}                  }           bcmFS.dr.onDoubleClick = function(){                var d = 0;                while(d != bcmFS.dr.children.length)                {                  sl = bcmFS.dr.items[d].selected;                  if(sl == true)                  {                    bcmFS.et.text = bcmFS.dr.items[d];                  }                  d++;                }          }        bcmFS.onResizing= function(){          winH = bcmFS.bounds.height;          winW = bcmFS.bounds.width;          bcmFS.dr.bounds.height = winH - 40;          bcmFS.dr.bounds.width = winW - 20;          bcmFS.et.bounds.width = winW - 20;        }    bcmFS.show();    function removeListChilds(){      i=bcmFS.dr.children.length;      while(bcmFS.dr.children.length != 0)      {        bcmFS.dr.remove(bcmFS.dr.items[i]);        i--;      }    }    function setTheFont(){      monoFontList = new Array("Courier","Andale Mono", "Consolas","DejaVu Sans Mono", "Droid Sans Mono", "Everson Mono","Fixedsys","HyperFont",                                "Inconsolata","Letter Gothic","Lucida Console","Monaco","monofur","PragmataPro","Prestige","ProFont",                                "Tex Gyre Cursor","Trixie","UM Typewriter");      for(a=0;a<monoFontList.length;a++){        // alert(monoFontList[a]);        try{          bcmFS.dr.graphics.font = ScriptUI.newFont(monoFontList[a],"BOLD",10);          break;          // alert(monoFontList[a]);          }catch(err){}      }    }}function getNamesIdsParents(){   var ref = new ActionReference();   ref.putEnumerated( charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );   var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL'));   var Names=[];   var parents = new Array();   var x = 0;   var y = 0;   var r = 0;try{activeDocument.backgroundLayer;var a=0 }catch(e){ var a = 1; };    i = count;   for(i;i>(a-1);i--){        ref = new ActionReference();        ref.putIndex( charIDToTypeID( 'Lyr ' ), i );        var desc = executeActionGet(ref);        var layerName = desc.getString(charIDToTypeID( 'Nm  ' ));        var Id = desc.getInteger(stringIDToTypeID( 'layerID' ));        var ls = desc.getEnumerationValue(stringIDToTypeID("layerSection"));        ls = typeIDToStringID(ls);        if(ls == "layerSectionStart")        {          x++;          parents.push(layerName);        }        if(layerName.match(/^<\/Layer group/) ) {          if(ls == "layerSectionEnd")          {            y++;            parents.pop();          }          continue;        }        r = x - y;        // alert(layerName+ " __ "+ parents.toSource());        var layerType = typeIDToStringID(desc.getEnumerationValue( stringIDToTypeID( 'layerSection' )));        var isLayerSet =( layerType == 'layerSectionContent') ? false:true;    Names.push({id:Id,name:layerName,isSet:isLayerSet,idx:i,parents:parents.toSource()});   };   // Names.reverse();return Names;};function mbCompare(imput, mbArr){    var res = new Array();    searchParents = false;    if(imput[imput.length-1] == "*"){      imput = imput.substring(0,imput.length-1);    }    if(imput.search("@") != -1)//this is for the parents search    {      pImput = imput.substring(imput.search("@")+1,imput.length);      imput = imput.substring(0,imput.search("@"));      searchParents = true;    }    for(a=0; a<mbArr.length; a++)    {      q = eval("/"+imput+"/i");      var s = mbArr[a].name.match(q);      if(s){        res.push(mbArr[a]);      }    }        if(searchParents == true){      resP = getAndSearchParents(pImput, res);      return resP;    }else{ return res }; }function getAndSearchParents(imput, mbArr){  var res = new Array();  for(a=0; a<mbArr.length; a++){    pArr = parentsStringtoArray(mbArr[a].parents);    if(pArr.length != 0){      for(b=0; b<pArr.length; b++)      {        // alert("pImput: "+imput+" in: "+pArr[b]);        q = eval("/"+imput+"/i");        var s = pArr[b].match(q);        if(s){          res.push(mbArr[a]);        }      }    }  }  return res;}function parentsStringtoArray(mbStr){  mbStr = mbStr.substring(1,mbStr.length-1);//remove brackets  strToRet = new Array();  if(mbStr.length != 0){    mbStrToArray = mbStr.split(", ");    for(b in mbStrToArray){      mbStrToArray[b] = mbStrToArray[b].substring(1,mbStrToArray[b].length-1);      strToRet.push(mbStrToArray[b]);    }  }   return strToRet}function makeActiveByIndex( idx, visible ){     if( idx.constructor != Array ) idx = [ idx ];     for( var i = 0; i < idx.length; i++ ){          var desc = new ActionDescriptor();          var ref = new ActionReference();          ref.putIndex(charIDToTypeID( 'Lyr ' ), idx[i])          desc.putReference( charIDToTypeID( 'null' ), ref );          if( i > 0 ) {               var idselectionModifier = stringIDToTypeID( 'selectionModifier' );               var idselectionModifierType = stringIDToTypeID( 'selectionModifierType' );               var idaddToSelection = stringIDToTypeID( 'addToSelection' );               desc.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelection );          }          desc.putBoolean( charIDToTypeID( 'MkVs' ), visible );          executeAction( charIDToTypeID( 'slct' ), desc, DialogModes.NO );     }     }function isLayerSet( idx ) {     var propName = stringIDToTypeID( 'layerSection' );     var ref = new ActionReference();      ref.putProperty( charIDToTypeID( "Prpr" ) , propName);     ref.putIndex( charIDToTypeID ( "Lyr " ), idx );     var desc =  executeActionGet( ref );     var type = desc.getEnumerationValue( propName );     var res = typeIDToStringID( type );      // alert(res);     return res == 'layerSectionStart' ? true:false;}function openGroup1byIDX(idx) {   if(isLayerSet( idx ))   {    getNamesPlusIDsOfLayerSetIDX( idx );  }  makeActiveByIndex(idx, false);}function getNamesPlusIDsOfLayerSetIDX(idx){   var ref = new ActionReference();   ref.putIndex( charIDToTypeID( 'Lyr ' ), idx );   var count = executeActionGet(ref).getInteger(charIDToTypeID('Cnt '));  var parId = executeActionGet(ref).getInteger(stringIDToTypeID( 'layerID' ));   var x = 0;   var y = 0;   var r = 0;   currINDEX = idx;    var i = currINDEX;   for(i; i > 0 ; i--){        ref = new ActionReference();        ref.putIndex( charIDToTypeID( 'Lyr ' ), i );        var desc = executeActionGet(ref);        var layerName = desc.getString(charIDToTypeID( 'Nm  ' ));        var Id = desc.getInteger(stringIDToTypeID( 'layerID' ));        var ls = desc.getEnumerationValue(stringIDToTypeID("layerSection"));        ls = typeIDToStringID(ls);        // alert(layerName+": _ :"+ls);        if(ls == "layerSectionStart"){x++};        if(layerName.match(/^<\/Layer group/) )         {           y ++;          r = x - y;          if(r == 0 && ls == "layerSectionEnd"){break};          continue;        };        if(ls == "layerSectionContent"){makeActiveByIndex(i,false);break};        var layerType = typeIDToStringID(desc.getEnumerationValue( stringIDToTypeID( 'layerSection' )));        var isLayerSet =( layerType == 'layerSectionContent') ? false:true;   };};function getActiveLayerIndex() {    var ref = new ActionReference();    ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));    ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );    return executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ));};function getInterfaceColor(){  var ref = new ActionReference();  ref.putEnumerated( charIDToTypeID("capp"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );    var desc = executeActionGet(ref);      var a = desc.getObjectValue(stringIDToTypeID("interfacePrefs")).getEnumerationValue(stringIDToTypeID( "kuiBrightnessLevel" ));      return a;      // return typeIDToStringID( a );}function getSelectedLayersIdx(){     var selectedLayers = new Array;     var ref = new ActionReference();     ref.putEnumerated( charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );     var desc = executeActionGet(ref);     if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){          desc = desc.getList( stringIDToTypeID( 'targetLayers' ));          var c = desc.count           var selectedLayers = new Array();          for(var i=0;i<c;i++){               selectedLayers.push(  (desc.getReference( i ).getIndex())+1);          }     }else{          var ref = new ActionReference();           ref.putProperty( charIDToTypeID('Prpr') , charIDToTypeID( 'ItmI' ));           ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );          selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( 'ItmI' )));     }     return selectedLayers;}function getIdxFromResult(item){  iS = item.toString();  iS = iS.substring(0, iS.lastIndexOf("|"));  theIdx = iS.substring(iS.lastIndexOf("|")+1,iS.length);  // alert(theIdx);  return theIdx;}//default font Lucida Grande, 13pt,  regularfunction createDispStr(object){  var theString = new String();  var theTab = 30;  if(getVersion() < 12){    var theTab = 3;  }  var tName = object.name.toString();  var nameW = object.name.toString().length;  space1 ="";  theLine1 =  20;  theNededSpaces1 = theLine1 - nameW;  for(a=0;a<theNededSpaces1;a++){    space1 += " ";  }  if(nameW > theLine1){tName = (tName.substring(0,(theLine1-4)))+"... " }    var tParents = object.parents.toString();  var parentsW = object.parents.toString().length;  space2 ="";  theLine2 =  39;  theNededSpaces2 = theLine2 - parentsW;    for(a=0;a<theNededSpaces2;a++){    space2 += " ";  }  if(parentsW > theLine2){tParents = (tParents.substring(0,(theLine2-4)))+"... " }    var idxW = object.idx.toString().length;  space3 ="";   theLine3 =  5;  theNededSpaces3 = theLine3 - idxW;    for(a=0;a<theNededSpaces3;a++){    space3 += " ";  }  theString += tName+space1+"|"+tParents+space2+"|"+ object.idx.toString()+space3+"|" +object.isSet.toString();  return(theString);}