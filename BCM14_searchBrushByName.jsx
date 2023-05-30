/*<javascriptresource>  <name>BCM14> searchBrushByName...</name>  <category>BCM</category></javascriptresource>*//////////////////////////////////////////////*Author: Buliarca Cristian (buliarca@yahoo.com)Copyright (C) 2013 Buliarca Cristianhttp://buliarca.blog124.fc2.com/http://buliarcatools.blog.fc2.com/Installation:  Close Photoshop  and copy the script in your Photoshop scripts folder:    "c:\Program Files\Adobe\Adobe Photoshop CS5 (64 Bit)\Presets\Scripts"   for osx:  "/Applications/Adobe Photoshop CS6/Presets/Scripts/"    Then restart Photoshop and you will see the scripts in the File>Scripts menuVersion: 1.0Function:  this script opens a window where you can type the brush name that you want to select and it will  return a list of corresponding brushes  To search you can type only a part of the brush name    examples:     lets say you have only these brushes in your preset:      "Square Charcoal", "Square Pencil", "Hard Square 8 pixels", "Hard Square 20 pixels", "Hard Square 18 pixels", "Hard Square 12", "Hard Square 15"            typing in the search field "sq" will list all the brushes:       ("Square Charcoal", "Square Pencil", "Hard Square 8 pixels", "Hard Square 20 pixels", "Hard Square 18 pixels", "Hard Square 12", "Hard Square 15")            typing in the search field "sq ha" will list this:        ("Hard Square 8 pixels", "Hard Square 20 pixels", "Hard Square 18 pixels", "Hard Square 12", "Hard Square 15")            typing in the search field "sq ha 2" will list this:        ("Hard Square 20 pixels", "Hard Square 12")      typing in the search field "sq ha 20" will list this:        ("Hard Square 20 pixels")    For default the script will select the first brush found.  You can see the brush that will be selected is the brush highlighted in the list bellow the typing  field.  Beside mouse navigation you can use some shortcut keys to navigate in the window  To switch between the typing field and the resulting list use the Tab key  To close the window and select the results press Enter  To close the window without selecting anything press Esc  Tested and works in photoshop versions:   CS3, CS4, CS5, CS6, CC  in CS6 on the osx system after closing the script Photoshop crashes to avoid this   you will have to change the line number 74 with this:  var mbSimpleSwitch = true;//make this true if you have problems with the UI  Use and/or modify at your own risk.*/////////////////////////////////////////////function getVersion(){  var version = parseInt(app.version);  return version;}// alert(getVersion());switch (getVersion()){  case 10://cs3  var mbSimpleSwitch = true;//make this true if you have problems with the UI  break;   case 11://cs4  var mbSimpleSwitch = false;//make this true if you have problems with the UI  break;   case 12://cs5  var mbSimpleSwitch = false;//make this true if you have problems with the UI  break;        case 13://cs6  var mbSimpleSwitch = false;//make this true if you have problems with the UI  break;   case 14://CC  var mbSimpleSwitch = true;//make this true if you have problems with the UI  break;   }// bsN = [{name:"Square Charcoal", idx: 1},// {name:"Square Pencil", idx: 2},// {name:"Hard Square 8 pixels", idx: 3},// {name:"Hard Square 20 pixels", idx: 3},// {name:"Hard Square 18 pixels", idx: 3},// {name:"Hard Square 12", idx: 3},// {name:"Hard Square 15", idx: 3},// ];// mbCompare("sq 8",bsN);mainUI();function mainUI(){if(!documents.length) return;openedGroups = new Array();var MBresult = new Array();    var bcmFS = new Window("dialog", "BCM SearchBrushByName", {width:700,height:700,x:800,y:150},{resizeable:true, borderless:false});    g = bcmFS.graphics;    // g.font = ScriptUI.newFont("Arial","BOLD",13);    var intCol = 0;    try{getVersion()>12?intCol = getInterfaceColor():intCol=0}catch(err){};      try{        switch (intCol)        {          case 145:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.3, 0.3, 0.3, 1]);            break;          case 79:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.3, 0.3, 0.3, 1]);            break;          case 3064:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.6, 0.6, 0.6, 1]);            break;          case 3065:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.8, 0.8, 0.8, 1]);            break;          case 0:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.9, 0.9, 0.9, 1]);            break;          default:            var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.8, 0.8, 0.8, 1]);            break;        }        g.backgroundColor = myBrush;      }catch(err){}        brushesNames = getBrushes();        // alert(mbCompare("la@3", brushesNames));//this is a test        bcmFS.et = bcmFS.add ("edittext", {width:680,height:20, x:10, y:10}, "");        if(mbSimpleSwitch == false){          try{              bcmFS.dr = bcmFS.add ("listbox", {width:680,height:bcmFS.bounds.height-40, x:10, y:30},"",{name:"mbListBox",multiselect:false,numberOfColumns:2,showHeaders: true,columnWidths:[500,100],columnTitles:['Brush name', 'Index']});            }catch(err){              mbSimpleSwitch = true;              bcmFS.dr = bcmFS.add ("listbox", {width:680,height:bcmFS.bounds.height-40, x:10, y:30},"",{name:"mbListBox",multiselect:false});              setTheFont();            }        }else{            bcmFS.dr = bcmFS.add ("listbox", {width:680,height:bcmFS.bounds.height-40, x:10, y:30},"",{name:"mbListBox",multiselect:false});            setTheFont();         }          for(var z in brushesNames)            {              if(mbSimpleSwitch == true)              {                dispStr1 = createDispStr(brushesNames[z]);                bcmFS.dr.add('item',dispStr1);              }else{                bcmFS.dr.add('item',brushesNames[z].name.toString());                bcmFS.dr.items[z].subItems[0].text = brushesNames[z].idx;              }            }        bcmFS.okBtn = bcmFS.add("button",{width:40,height:20, x:10, y:bcmFS.bounds.height-25},"OK",{name:"ok"} );        bcmFS.cancelBtn = bcmFS.add("button",{width:60,height:20, x:bcmFS.bounds.width-70, y:bcmFS.bounds.height-25},"Cancel",{name:"cancel"} );        bcmFS.okBtn.visible = false;        bcmFS.cancelBtn.visible = false;        bcmFS.okBtn.onClick = function(){            theI = new Array();            var d = 0;            while(d != bcmFS.dr.children.length)            {              sl = bcmFS.dr.items[d].selected;              if(sl == true)              {                if(mbSimpleSwitch == true){                  theI.push(parseInt(getIdxFromResult(bcmFS.dr.items[d])));                }else{                  theI.push(parseInt(bcmFS.dr.items[d].subItems[0]));                }                                }              d++;            }            selectBrshByIDX( theI );            bcmFS.close();        }        bcmFS.cancelBtn.onClick = function(){          bcmFS.close();        }        bcmFS.et.active = true;        bcmFS.et.focus =  true;        bcmFS.et.onChanging = function(){                    removeListChilds();                    theText = bcmFS.et.text;                      MBresult = mbCompare(bcmFS.et.text,brushesNames);                      for(var z in MBresult){                        if(mbSimpleSwitch == true)                        {                          dispStr = createDispStr(MBresult[z]);                          bcmFS.dr.add('item',dispStr);                        }else{                          bcmFS.dr.add('item',MBresult[z].name);                          bcmFS.dr.items[z].subItems[0].text = MBresult[z].idx;                        }                                                }                                            if(theText[theText.length-1] == "*"){                        var rr=0;                        while(rr != bcmFS.dr.children.length)                        {                          bcmFS.dr.items[rr].selected = true;                          rr++;                        }                      }else{bcmFS.dr.items[0].selected = true;}                  }           bcmFS.dr.onDoubleClick = function(){                var d = 0;                while(d != bcmFS.dr.children.length)                {                  sl = bcmFS.dr.items[d].selected;                  if(sl == true)                  {                    bcmFS.et.text = bcmFS.dr.items[d];                  }                  d++;                }          }        bcmFS.onResizing= function(){          winH = bcmFS.bounds.height;          winW = bcmFS.bounds.width;          bcmFS.dr.bounds.height = winH - 40;          bcmFS.dr.bounds.width = winW - 20;          bcmFS.et.bounds.width = winW - 20;        }    bcmFS.show();    function removeListChilds(){      i=bcmFS.dr.children.length;      while(bcmFS.dr.children.length != 0)      {        bcmFS.dr.remove(bcmFS.dr.items[i]);        i--;      }    }    function setTheFont(){      monoFontList = new Array("Courier","Andale Mono", "Consolas","DejaVu Sans Mono", "Droid Sans Mono", "Everson Mono","Fixedsys","HyperFont",                                "Inconsolata","Letter Gothic","Lucida Console","Monaco","monofur","PragmataPro","Prestige","ProFont",                                "Tex Gyre Cursor","Trixie","UM Typewriter");      for(a=0;a<monoFontList.length;a++){        try{          bcmFS.dr.graphics.font = ScriptUI.newFont(monoFontList[a],"BOLD",15);          break;          }catch(err){}      }    }}function mbCompare(imput, mbArr){    var res = new Array();    imputs = new Array();    imputs = imput.split(" ");    imput = imputs[0];    for(a=0; a<mbArr.length; a++)    {      q = eval("/"+imput+"/i");      var s = mbArr[a].name.match(q);      if(s){        res.push(mbArr[a]);      }    }    if(imputs.length > 1){//for making multiples searches      for(aq=1; aq<imputs.length; aq++){        if(imputs[aq] != ""){          aa = 0;          while (res.length > 1)          {            qq = eval("/"+imputs[aq]+"/i");            try{              var sq = res[aa].name.match(qq);            }catch(err){break};            if(!sq){                  res.splice(aa, 1);                  aa--;            }            aa++;          }        }      }    }   return res; }function serachAndRemove(thisA, fromArray){  array = [];  for(ss in froArray){    array.push(sss.name);  }  var i = array.indexOf(thisA.name);  alert(thisA.name +" -- " +fromArray.toSource() +" --- "+i);  if(i != -1) {    fromArray.splice(i, 1);  return fromArray;  }}function getInterfaceColor(){  var ref = new ActionReference();  ref.putEnumerated( charIDToTypeID("capp"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );    var desc = executeActionGet(ref);      var a = desc.getObjectValue(stringIDToTypeID("interfacePrefs")).getEnumerationValue(stringIDToTypeID( "kuiBrightnessLevel" ));      return a;}function selectBrshByName( name ){      var desc3 = new ActionDescriptor();          var ref1 = new ActionReference();          ref1.putName( charIDToTypeID( "Brsh" ), name );      desc3.putReference( charIDToTypeID( "null" ), ref1 );  executeAction( charIDToTypeID( "slct" ), desc3, DialogModes.NO );}function selectBrshByIDX( IDX ){      var desc3 = new ActionDescriptor();          var ref1 = new ActionReference();          ref1.putIndex( charIDToTypeID( "Brsh" ), parseInt(IDX) );      desc3.putReference( charIDToTypeID( "null" ), ref1 );  executeAction( charIDToTypeID( "slct" ), desc3, DialogModes.NO );}function getBrushes(){    toRet = new Array();    var ref = new ActionReference();    ref.putEnumerated( charIDToTypeID( "capp" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );    var desc = executeActionGet(ref);        var desc1 = desc.getList(stringIDToTypeID("presetManager"));        desc1 = desc1.getObjectValue(0).getList(charIDToTypeID("Nm  "));        ct = desc1.count;        for(i=0;i<ct;i++){            toRet.push({name:desc1.getString(i), idx:i+1});                }    return toRet;}function getIdxFromResult(item){  iS = item.toString();  theIdx = iS.substring(iS.lastIndexOf("|")+1,iS.length);  return theIdx;}function createDispStr(object){  var theString = new String();  var theTab = 30;  if(getVersion() < 12){    var theTab = 3;  }  var tName = object.name.toString();  var nameW = object.name.toString().length;  space1 ="";  theLine1 =  70;  theNededSpaces1 = theLine1 - nameW;  for(a=0;a<theNededSpaces1;a++){    space1 += " ";  }  if(nameW > theLine1){tName = (tName.substring(0,(theLine1-4)))+"... " }  theString += tName+space1+"|"+ object.idx.toString();  return(theString);}