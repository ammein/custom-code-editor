// Provide default options for choosing options on fieldset feature.
// Only provide options that are compatible with my package setup
// This is because due to my optimized push asset feature, avoid providing options
// that requires changing theme/modes. However, user may override these options directly from
// their project level setup.
module.exports =  {
    "selectionStyle" : {
        name : 'selectionStyle',
        type : "string",
        value : ["line" , "text"],
        category : "editor"
    },
    "highlightActiveLine" : {
        name : "highlightActiveLine",
        type : "boolean",
        value : null,
        category : "editor"
    },
    "highlightSelectedWord" : {
        name : "highlightSelectedWord",
        type : "boolean",
        value : null,
        category : "editor"
    },
    "readOnly" : {
        name : "readOnly",
        type : "boolean",
        value : null,
        category : "editor"
    },
    "cursorStyle" : {
        name : "cursorStyle",
        type : "string",
        value : ["ace" , "slim" , "smooth" , "wide"],
        category : "editor"
    },
    "mergeUndoDeltas" : {
        name : "mergeUndoDeltas",
        type : "string",
        value : [
            {
                title: "Always",
                value: "always"
            },
            {
                title : "Never",
                value : false
            },
            {
                title: "Timed",
                value: true
            }
        ],
        category : "editor"
    },
    "behavioursEnabled":{
        name : "behavioursEnabled",
        type : "boolean",
        value : null,
        category : "editor"
    },
    "wrapBehavioursEnabled":{
        name : "wrapBehavioursEnabled",
        type : "boolean",
        value : null,
        category : "editor"
    },
    "autoScrollEditorIntoView":{
        name : "autoScrollEditorIntoView",
        type : "boolean",
        value : null,
        help: "This is needed if editor is inside scrollable page",
        category : "editor"
    },
    "copyWithEmptySelection":{
        name : "copyWithEmptySelection",
        type : "boolean",
        value : null,
        help: "Copy/Cut the full line if selection is empty, defaults to false",
        category : "editor"
    },
    "useSoftTabs":{
        name : "useSoftTabs",
        type : "boolean",
        value : null,
        category : "editor"
    },
    "navigateWithinSoftTabs":{
        name : "navigateWithinSoftTabs",
        type : "boolean",
        value : null,
        category : "editor"
    },
    "enableMultiSelect":{
        name : "enableMultiSelect",
        type : "boolean",
        value : null,
        category : "editor"
    },
    "hScrollBarAlwaysVisible" : {
        name: "hScrollBarAlwaysVisible",
        type : "boolean",
        value : null,
        category : "renderer"
    },
    "vScrollBarAlwaysVisible" : {
        name: "vScrollBarAlwaysVisible",
        type : "boolean",
        value : null,
        category : "renderer"
    },
    "highlightGutterLine" : {
        name: "highlightGutterLine",
        type : "boolean",
        value : null,
        category : "renderer"
    },
    "animatedScroll" : {
        name : "animatedScroll",
        type : "boolean",
        value : null,
        category : "renderer"
    },
    "showInvisibles" : {
        name: "showInvisibles",
        type : "boolean",
        value : null,
        category : "renderer"
    },
    "showPrintMargin" : {
        name: "showPrintMargin",
        type: "boolean",
        value: null,
        category : "renderer"
    },
    "printMarginColumn" : {
        name: "printMarginColumn",
        type : "number",
        value: {
            min: 0,
            max: 100,
            steps: 1
        },
        category : "renderer"
    },
    "printMargin" : {
        name: "printMargin",
        type: "number",
        value : {
            min : 0,
            max : 100,
            steps : 1
        },
        category : "renderer"
    },
    "fadeFoldWidgets" : {
        name: "fadeFoldWidgets",
        type: "boolean",
        value: null,
        category: "renderer"
    },
    "showFoldWidgets" : {
        name: "showFoldWidgets",
        type: "boolean",
        value: null,
        category: "renderer"
    },
    "showLineNumbers" : {
        name: "showLineNumbers",
        type: "boolean",
        value: null,
        category: "renderer"
    },
    "showGutter" : {
        name: "showGutter",
        type: "boolean",
        value: null,
        category : "renderer"
    },
    "displayIndentGuides" : {
        name: "displayIndentGuides",
        type: "boolean",
        value: null,
        category: "renderer"
    },
    "scrollPastEnd" : {
        name: "scrollPastEnd",
        type: ["number","boolean"],
        value: {
            min : 0,
            max: 1,
            steps : 0.1
        },
        help: "Number of page sizes to scroll after document end (typical values are 0, 0.5, and 1)",
        category: "renderer"
    },
    "fixedWidthGutter" : {
        name: "fixedWidthGutter",
        type: "boolean",
        value : null,
        category: "renderer"
    },
    // We are not going to make theme changes here since we have a assets optimized push
    "scrollSpeed" : {
        name : "scrollSpeed",
        type: "number",
        value : {
            min : 0,
            max : 100,
            steps : 1
        },
        category: "mouseHandler"
    },
    "dragDelay" : {
        name:"dragDelay",
        type: "number",
        value: {
            min: 0,
            max: 100,
            steps: 1
        },
        category: "mouseHandler"
    },
    "dragEnabled" : {
        name: "dragEnabled",
        type: "boolean",
        value: null,
        category: "mouseHandler"
    },
    "focusTimeout" : {
        name: "focusTimeout",
        type: "number",
        value: null,
        category: "mouseHandler"
    },
    "tooltipFollowsMouse" : {
        name: "tooltipFollowsMouse",
        type: "boolean",
        value: null,
        category: "mouseHandler"
    },
    "overwrite" : {
        name: "overwrite",
        type: "boolean",
        value: null,
        category: "session"
    },
    "newLineMode" : {
        name: "newLineMode",
        type: "string",
        value: ["auto" , "unix" , "windows"],
        category: "session"
    },
    "tabSize" : {
        name: "tabSize",
        type: "number",
        value: {
            min: 0,
            max: 20,
            steps: 1
        },
        category: "session"
    },
    "wrap" : {
        name: "wrap",
        type: ["boolean" , "number"],
        value: null,
        category: "session"
    },
    "foldStyle" : {
        name : "foldStyle",
        type: "string",
        value : ["markbegin" , "markbeginend","manual"],
        category: "session"
    },
    "enableBasicAutocompletion" : {
        name: "enableBasicAutocompletion",
        type: "boolean",
        value: null,
        category: "extension"
    },
    "enableLiveAutocompletion" : {
        name: "enableLiveAutocompletion",
        type: "boolean",
        value: null,
        category: "extension"
    },
    "enableEmmet" : {
        name: "enableEmmet",
        type: "boolean",
        value: null,
        category: "extension"
    },
    "useElasticTabstops" : {
        name: "useElasticTabstops",
        type: "boolean",
        value: null,
        category: "extension"
    }
}