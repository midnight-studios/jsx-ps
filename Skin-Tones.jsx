// -*- javascript -*-
#target photoshop
#script "Jeffrey's Calendar Builder"
#strict on

app.bringToFront();

//

var VERSION = '0.1'; // Sep 1, 2013

var ShowConfigDialog = true;
var Language = 'English';



// make the text safe to appear within a JavaScript single-quoted string
function fixup(text)
{
    text = text.replace(/\\/g, "\\\\");
    text = text.replace(/\\'/g, "\\'");  //"
    return text;
}





Date.prototype.getWeekNumber = function() {
    return WeekNumStyleISO8601 ? this.getWeekNumber_ISO8601() : this.getWeekNumber_STD();
};

var doc; // the document we're building




try
{}
}
catch (error)
{

}




///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function ConfigViaDialog()
{
    // var f = new File("/i/resource.txt"); f.open("r"); var dialogSpec = f.read();
    var dialogSpec = "dialog                                                 \
{                                                                            \
    text: \"Jeffrey's Calendar Builder (Version "+VERSION+")\",              \
    frameLocation: [150,100],                                                \
    alignChildren:'fill',                                                    \
    spacing: 2,                                                              \
                                                                             \
    TitleBox: Group {                                                        \
       orientation: 'column',                                                \
       margins: [0,5,0,10],                                                  \
       spacing: 1,                                                           \
       alignment: 'center',                                                  \
       p: Panel {                                                            \
         margins: [ 30, 8, 30, 8 ],                                          \
         n: StaticText { text: \"Jeffrey Friedl's Calendar Builder (Version "+VERSION+")\" },\
       },                                                                    \
       n: Button { text: 'Documentation at http://regex.info/blog/photo-tech/calendar/' },\
    },                                                                       \
                                                                             \
    Date: Panel {                                                            \
          text: 'Target Month',                                              \
          orientation:'row',                                                 \
          alignChildren:'left',                                              \
                                                                             \
          Year: Group {                                                      \
             st: StaticText { text:'Year:' },                                \
             et: EditText   { text:'2007', maxvalue: '9999', minvalue: '1800' },\
          },                                                                 \
          Month: Group {                                                     \
             st: StaticText   { text: 'Month:' },                            \
             et: DropDownList { properties: {items: ['- All -', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}  }\
          },                                                                 \
    },                                                                       \
                                                                             \
    StyleAndPrint: Group {                                                   \
        orientation: 'row',                                                  \
        alignChildren: 'top',                                                \
                                                                             \
                                                                             \
        Style: Panel {                                                       \
            text: 'Calendar Style',                                          \
            alignChildren:'left',                                            \
            Language: Group {                                                \
               st: StaticText   { text: 'Language:' },                       \
               et: DropDownList { properties: { items: [                     \
                                                                             \
                  'English', 'Afrikaans', 'Albanian', 'Amharic', 'Arabic',   \
                  'Armenian', 'Basque', 'Belarusian', 'Bosnian', 'Bulgarian',\
                  'Catalan', 'Chinese', 'Cornish', 'Croatian', 'Czech',      \
                  'Danish', 'Dutch', 'English', 'Estonian', 'Finnish',       \
                  'French', 'German', 'Greek', 'Gujarati', 'Haitian Creole', \
                  'Hawaiian', 'Hebrew', 'Hindi', 'Hungarian', 'Icelandic',   \
                  'Indonesian', 'Italian', 'Japanese',                       \
                  'Korean', 'Latin', 'Latvian', 'Lithuanian', 'Luxembourgish',\
                  'Maori', 'Norwegian', 'Polish', 'Portuguese', 'Romanian',  \
                  'Romansh', 'Russian', 'Scotch Gaelic', 'Scots', 'Serbian', \
                  'Slovak', 'Slovenian', 'Spanish', 'Swedish', 'Tamil',      \
                  'Thai', 'Tok Pisin', 'Turkish', 'Ukrainian', 'Vietnamese', \
                  'Welsh']} },                                               \
                                                                             \
            },                                                               \
                                                                             \
            Weekstart: Group {                                               \
               st: StaticText   { text: 'Weeks Start on:' },                 \
               et: DropDownList { properties: { items: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}  },\
            },                                                               \
                                                                             \
            WeekNum: Group {                                                 \
              alignChildren:'left',                                          \
                                                                             \
              ShowWeekNum: Group {                                           \
                 st: StaticText   { text: 'Show Week Numbers:' },            \
                 et: DropDownList { properties: { items: ['At Left', 'No', 'At Right']}  },\
              },                                                             \
                                                                             \
              Style: Group {                                                 \
                  orientation: 'column',                                     \
                  alignChildren:'left',                                      \
                  margins: 0,                                                \
                  spacing: 0,                                                \
                  helpTip: \"With ISO 8601, 'Week 1' is the week with the first Thursday of the year. When selecting this item, it's best to set weeks to start on a Monday, as that is the ISO8601 standard as well. Select 'Jan 1' to have 'Week 1' be the week with January first.\",\
                  enabled: false,                                            \
                  ISO8601: RadioButton { text: 'ISO 8601'},                  \
                  Default: RadioButton { text: 'Jan 1' },                    \
              },                                                             \
            },                                                               \
                                                                             \
            Orientation: Group {                                             \
               helpTip: 'This is for the image, not the paper',              \
               st: StaticText   { text: 'Image Orientation:' },              \
               et: DropDownList { properties: { items: ['Landscape', 'Portrait']}  },\
            },                                                               \
        },                                                                   \
                                                                             \
        Paper: Panel {                                                       \
              text: 'Print Destination',                                     \
              alignChildren:'left',                                          \
              Sheetsize: Group {                                             \
                 st: StaticText   { text: 'Paper Size:' },                   \
                 et: DropDownList { properties: { items: ['Letter', 'A3', 'A4', 'A5', '4R']}  },\
              },                                                             \
              WidthMargin: Group {                                           \
                 s_: StaticText  { text: 'Unprintable Width:' },             \
                 et: EditText    { text: 'MMMM'  },                          \
                 st: StaticText  { text: 'mm' },                             \
              },                                                             \
                                                                             \
              HeightMargin: Group {                                          \
                 s_: StaticText  { text: 'Unprintable Height:' },            \
                 et: EditText    { text: 'MMMM'  },                          \
                 st: StaticText  { text: 'mm' },                             \
              },                                                             \
              DPI: Group {                                                   \
                 st: StaticText   { text: 'Print DPI:' },                    \
                 et: EditText     { text: '300', maxvalue: '1200',  minvalue: '72'  },\
              },                                                             \
        },                                                                   \
                                                                             \
    },                                                                       \
                                                                             \
    Annotations: Panel {                                                     \
       text: 'Annotations',                                                  \
       orientation: 'row',                                                   \
       alignChildren: 'left',                                                \
       cb: Checkbox { text: 'Include', },                                    \
                                                                             \
       from: StaticText { text: 'From:' },                                   \
       File:   EditText   { text: ''           },                            \
       Browse: Button     { text: 'Browse'     },                            \
    },                                                                       \
                                                                             \
    Misc: Panel {                                                            \
          text: 'Miscellaneous Options',                                     \
          alignChildren:'left',                                              \
                                                                             \
          RasterizeTextLayers: Group {                                       \
                 helpTip: \"When checked, the text layers for the dates are rasterized and merged into one, which makes it easier to adjust the style applied to all of them. When unchecked, the date numbers are left as individual text layers.\",\
                 st: StaticText { text: 'Rasterize & Merge Most Text Layers?' },\
                 cb: Checkbox   { value:  true      },                       \
             },                                                              \
                                                                             \
    },                                                                       \
                                                                             \
    AutoSave: Panel {                                                        \
          alignChildren:'left',                                              \
                                                                             \
          CheckBoxes: Group {                                                \
             alignChildren:'left',                                           \
                                                                             \
             YesOrNo: Group {                                                \
                 st: StaticText { text: 'Auto-save:' },                      \
                 cb: Checkbox   { value:  false      },                      \
             },                                                              \
                                                                             \
             Overwrite: Group {                                              \
                 st: StaticText { enabled: false, text: '      Silently Overwrite' },\
                 cb: Checkbox   { enabled: false, value:  false      },      \
             },                                                              \
          },                                                                 \
                                                                             \
          Dir: Group {                                                       \
              st:     StaticText { enabled: false, text: 'Directory:', },    \
              Base:   EditText   { enabled: false, text: ''            },    \
              Browse: Button     { enabled: false, text: 'Browse'      },    \
          },                                                                 \
                                                                             \
          FilePat: Group {                                                   \
             st: StaticText   { enabled: false, text: '.PSD Filename Pattern:'  },\
             et: EditText     { enabled: false, text: ''   },                \
          },                                                                 \
                                                                             \
    },                                                                       \
                                                                             \
    Default: Panel {                                                         \
       text: 'Default Configuration',                                        \
       alignChildren: 'left',                                                \
       Config: Group {                                                       \
          st: StaticText { text: 'To save the above configuration as your default:' },\
          but: Button    { text: 'Save'    },                                \
       },                                                                    \
       Restore: Group {                                                      \
          alignChildren: 'left',                                             \
          st: StaticText { text: 'To delete any saved configuration, check and press:' },\
          cb: Checkbox   { value: false },                                   \
          but: Button    { text: 'Delete', enabled: false    },              \
       },                                                                    \
    },                                                                       \
                                                                             \
    Control: Group {                                                         \
       margins: [0, 15,0, 0 ],                                               \
       alignment: 'center',                                                  \
       spacing: '20',                                                        \
       Okay:  Button { text:'Okay',  properties:{name:'ok'    } },           \
       Abort: Button { text:'Abort', properties:{name:'cancel'} },           \
    }                                                                        \
}";



// Returns a color (a SolidColor object)
function RGB(red, green, blue) // percents
{
    var color = new SolidColor();
    color.rgb.red   = red   * 255/100;
    color.rgb.green = green * 255/100;
    color.rgb.blue  = blue  * 255/100;
    return color;
}

// Returns a color (a SolidColor object)
function RGB_raw(red, green, blue) // 0..255
{
    var color = new SolidColor();
    color.rgb.red   = red;
    color.rgb.green = green;
    color.rgb.blue  = blue;
    return color;
}

// Returns a color (a SolidColor object)
function SolidBlack()
{
    return RGB(0.1,0.1,0.1);
}

// Returns a color (a SolidColor object)
function SolidWhite()
{
    return RGB(100,100,100);
}


//
// Returns the number of pixels at the current DPI for the given number of
// milimeters.
//
function mm(val)
{
    return Math.round(val * DPI / 25.4);
}

//
// Returns the number of points (as in font sizes) for the given number of
// milimeters.
//
function mm2points(mm)
{
    return mm / 25.4 * 72;
}


//
// Returns a new text layer with many things set to a default.
// Important items not set: font, size, position, justification
//
function NewTextLayer(name)
{
    var L = doc.artLayers.add();
    L.kind = LayerKind.TEXT;
    L.name = name;

    //
    // The docs aren't really clear as to the native state of a new text layer.
    // Is it always the same, or does it depend on user preferences, or perhaps on
    // what font setting was changes last?
    // 
    // When I had the following list of items enabled, to set many text parameters to
    // a known state, building a calendar was VERY VERY slow.
    //
    //    L.blendMode = BlendMode.NORMAL
    //    L.textItem.desiredGlypheScaling = 100;
    //    L.textItem.desiredLetterScaling = 0;
    //    L.textItem.desiredWordScaling = 100;
    //    L.textItem.direction = Direction.HORIZONTAL;
    //    L.textItem.fauxBold = false;
    //    L.textItem.fauxItalic = false;
    //    L.textItem.firstLineIndent = 0;
    //    L.textItem.underline = UnderlineType.UNDERLINEOFF;
    //    L.textItem.warpBend = 0;
    //    L.textItem.warpStyle = WarpStyle.NONE;
    //    L.textItem.antiAliasMethod = AntiAlias.SMOOTH;
    //    L.textItem.capitalization = TextCase.NORMAL;
    //    L.textItem.contents = text;
    //    L.textItem.horizontalScale = 100;
    //    L.textItem.tracking = 0;
    //    L.textItem.verticalScale = 100;

    return L;
}

