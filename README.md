# Custom-Code-Editor ApostropheCMS Schema
An ApostropheCMS Custom Schema for your own custom-code-editor field

This schema uses Ace Editor library that you may found here [Ace Editor](https://ace.c9.io/)

![Ace Editor Example](https://media.giphy.com/media/33F6GoBCalksXavQyN/giphy.gif)

# Install
From within your apostrophe project `npm install --save custom-code-editor`

Include in app.js:
```javascript
// In app.js
  modules: {
    'custom-code-editor': {},
    // ... other modules
}
```


# Enable Code Editor Schema
Simple :
```javascript
addFields : [
    {
        type : 'custom-code-editor',
        name : 'mycode',
        label : 'Paste your code here'
    }
]
```

### Widget.html Get `custom-code-editor` Value
This custom-code-editor schema returns an object. 
```javascript
{
    code : '<string code value>',
    type : '<modes>'
}
```

If you did an example above , in `widget.html` you can simply get an object like this :

```twig
{{ data.widget.mycode.code }}
{{ data.widget.mycode.type }}
```

or you can simply use `apos.log()` to see what's available on `custom-code-editor` objects :

```twig
{{ apos.log(data.widget.mycode) }}
```


# Ace Editor Options Available

```javascript
// in lib/modules/custom-code-editor/index.js
module.exports = {
    ace : {
        theme : 'tomorrow', // themes available : https://github.com/ajaxorg/ace/tree/master/lib/ace/theme (Case Sensitive)
        defaultMode : 'javascript',
        options : {
            // All options available in : https://github.com/ajaxorg/ace/wiki/Configuring-Ace
        },
        modes : [
            {
                title : 'Javascript', // Title to Override Name
                name : 'javascript', // Name of the mode (Case-Sensitive)
                snippet : '// Content Start Here \n print(\"Hello World\") \n @code-here', // Default Value (String)
                disableSnippet : true // Disable default snippet value when switching (OPTIONAL - Boolean)
            }
        ],
        config: {
            fontSize: 16, // Editor Font Size (Number or String)
            editorHeight: 500, // Editor Height (Number or String)
            dropdown: {
                enable: true, // Enable it for switching modes button (Boolean)
                height: 30, // Height Dropdown (Number or String)
                borderRadius: 5, // Border Radius Dropdown (Number or String)
                fontFamily: "Mont-Regular", // Font Family Dropdown (String)
                backgroundColor : "Orange", // Background Color Dropdown (String)
                textColor : "white", // Text Color Dropdown (String)
                fontSize: 16, // Font Size Dropdown (Number or String)
                position: {
                    // All top , left , right , bottom dropdown position enable for configs
                    bottom: 20,
                    right: 20
                },
                arrowColor: "blue" // To change arrow color in dropdown (String)
            }
        }
    }
}
```

# List of default modes available
- ActionScript
- Bash
- C++
- C#
- PHP
- HTML
- Javascript

# Name Of The Modes References
### [List of all Modes](https://github.com/ajaxorg/ace/blob/master/lib/ace/ext/modelist.js#L45)

# How to Override Existing Mode ?
Simple , make sure the name of the mode is similar to default modes provided. 

### Default Mode
By default , `defaultMode : 'javascript'` enable. But you can choose a default mode by yourself ! Name any mode available for you. Let say you want 'css' to be in default mode.

```javascript
ace : {
    defaultMode : 'css' // Same as `name : 'css' in mode : []`
}
```

> This will open a starting mode , then you can choose other mode by choosing modes on your dropdown

### Enable Snippet
To enable your snippet added automatically when this schema is open , you have to enable dropdown
```javascript
ace : {
    config : {
        dropdown : {
            enable : true
        }
    }
}
```

WARNING !
Once enable your dropdown , you will frustated with the position of dropdown is on top left corner. It is because the dropdown do not have customized position. Let's position the dropdown on bottom left corner with some offset of 30px from the container

```javascript
ace : {
    config : {
        dropdown : {
            enable : true
            position : {
                bottom : 30,
                left : 30
            }
        }
    }
}
```

### Disable Snippet
If you want it to disable snippet for specific mode. Write the `name` of the modes and insert your `disableSnippet` :

```javascript
ace : {
    modes : [
        {
            name : "html",
            disableSnippet : true // This will not automatically change snippet when you change mode on dropdown
        }
    ]
}
```

### Override Snippet
Also , if you wanted to override default snippet for specific mode. Write the `name` of the modes and insert your `snippet` :

```javascript
ace : {
    modes : [
        {
            name: 'javascript', // name must be the same as existing default mode
            snippet: "document.addEventListener(\"DOMContentLoaded\" , function(){\n
            @code-here\n
        });"
        }
    ]
}
```

### `@code-here` On Snippet
What is that syntax for ? Well , whenever you change your mode on dropdown , existing codes on schema will replace automatically on new snippet on `@code-here`. Amazing right ? If you did not provide that syntax , your existing value on editor schema will be lost. Let's make a new override snippet and has our own `@code-here` on it :
```javascript
      modes : [
         {
            name :'javascript',
            content : "// Content Start Here \n print(\"Hello World\") \n @code-here"
         }
      ],
```

### Title of Dropdown
By default , the name of a dropdown will be on `name` property. But some of the name does not make sense ! Can I change it ? Yes you can , simply add `title` property like existing mode called **bash** :
```javascript
ace : {
    modes : [
        {
            name : 'sh',
            title : 'Bash' // This will make dropdown name as Bash instead of Sh
        }
    ]
}
```

### Clear Default Modes
What if I want to clear all default modes and define them myself ? Easy , add an option to `clearModes : true` :
```javascript
ace : {
    clearModes : true
}
```

Once you clear your mode , you can define your own modes without considering any overrides mode. Isn't this makes your life easier ?
```javascript
ace : {
    modes : [
        {
            // List of all modes that you want to define. The options you may write like this
            title : '<title of your mode>',
            name : '<name of your mode (case sensitive)>',
            snippet : '<code snippet>'
        }
    ]
}
```

> Don't worry about indent in Snippet , it will automatically beautify the codes whenever you enter your new content

# Insert My Own Theme
By default , `theme : 'ambiance'` . If you wish to change theme (Case Sensitive) :
```javascript
ace : {
    theme : 'monokai'
}
```
You can find all available themes here : [All Ace Editor Themes Available](https://github.com/ajaxorg/ace/tree/master/lib/ace/theme)

# Ace Editor Options
Now this one , I just extend it for you to enable ace editor options.

```javascript
ace : {
    options : {
        // Same property and value as in : https://github.com/ajaxorg/ace/wiki/Configuring-Ace
        // Example :
        cursorStyle: "smooth",
    }
}
```

Again , you can refer options that are available by Ace Editor here :
[Ace Editor Options](https://github.com/ajaxorg/ace/wiki/Configuring-Ace)

# Ace Editor & Dropdown Configurations
Well , you also can customize your own dropdown/ace editor css styles. All dropdown configuratins available for you are :

```javascript
ace : {
    config : {
        fontSize : '<Number or String>', // Editor Font Size
        editorHeight : '<Number or String>', // Editor Height
        dropdown : {
            enable : '<Boolean>', // Enable it for switching modes button
            height : '<Number or String>', // Height Dropdown - Default : 30
            borderRadius : '<Number or String>', // Border Radius Dropdown
            fontFamily : '<String>', // Font Family Dropdown
            fontSize : '<Number or String>' , // Font Size Dropdown
            backgroundColor : "<String>", // Background Color Dropdown (String)
            textColor : "<String>", // Text Color Dropdown (String)
            position : {
                top : '<Number or String>',
                bottom : '<Number or String>',
                right : '<Number or String>',
                left : '<Number or String>'
            },
            arrowColor : '<String or Hex or RGB or RGBA>' // To change arrow color in dropdown - Default : "black"
        }
    }
}
```

You must be thinking , why `fontSize` and `editorHeight` is available for editor options ? While we can do it in :

```javascript
ace : {
    options : {
        // all editor options
    }
}
```

Because we have a css issue on `!important` to override apostrophe css default normalize. So I did it for you to easily override it on `config` options. Or maybe you can push your own file to override it. Either way , both are possible override options :)

Again , you can find yourself available themes for your ace editor schema down here :
[All Ace Editor Themes Available](https://github.com/ajaxorg/ace/tree/master/lib/ace/theme)

# How To Insert My Stylesheets/Scripts Files ?
I provide a simple object for you. Behold !

### Stylesheets inside `public/css/<all css files>`
```javascript
ace : {
    // All ace options
},
stylesheets : {
    files : [
        {
            name : 'parentFolder/*', // This will get all files inside the parent folder
            when : 'user'
        },
        {
            name : 'parentFolder/style', // This will get style.css inside parentFolder
            when : 'user'
        }
    ],
    acceptFiles : ["css" , "sass" , "less" , "min.css"] // List of all accept files (Less , CSS and SASS are push by default)
}
```

> Default `acceptFiles` : `css` , `sass` and `less`

### Scripts inside `public/js/<all js files>`
How about javascripts files ? Same as above example :

```javascript
ace : {
    // All ace options
},
scripts : {
    files : [
        {
            name : 'parentFolder/*', // This will get all files inside the parent folder
            when : 'user'
        },
        {
            name : 'parentFolder/myScript', // This will get myScript.js inside parentFolder
            when : 'user'
        }
    ],
    acceptFiles : ["js" , "min.js"] // List of all accept files (js and min.js are push by default)
}
```

> Default `acceptFiles` : `js` and `min.js`.

### Error on pushing file assets
If you receive an error while pushing files assets to browser , please make sure your directory is in correct path without extension name and accept any files extension name by your own modified extension names. For example

```javascript
ace : {
    // All ace options
},
scripts : {
    files : [
        {
            // Get all files inside parentFolder
            name : 'parentFolder/*',
            when : 'user'
        },
        {
            // If got subfolder inside parentFolder
            // Include it too
            name : 'parentFolder/subFolder/*', 
            when : 'user'
        },
        {
            name : 'index', // get index.js
            when : 'user'
        }
    ]
    acceptFiles : ["con.min.js"] // and other prefix extension file names available
}
```

> NOTE : You don't have to include `'js/filedirectory'` or `'css/filedirectory'` in it. APOSTROPHECMS will push based on `self.pushAsset()` that you may found in [ApostropheCMS Push Asset Documentation](https://apostrophecms.org/docs/tutorials/getting-started/pushing-assets.html#configuring-stylesheets). Easy right ?

# Browser

### Browser Object
How can I get this schema browser object for my `custom-code-editor` ?

Simply you can find it on :

```javascript
apos.customCodeEditor
```

### Get Editor Browser Object
How can I get from the one that defined in javascript browser at `var editor = ace.edit("editor")` as in Ace Editor Website has telling you about ?

You can get it via browser scripting
```javascript
apos.customCodeEditor.editor
```

By that , you can test anything on browser-side. For example you open on Chrome Developer Tools and enter :

```javascript
apos.customCodeEditor.editor.session.getValue()
```

### Get Multiple Editor Browser in Single Schema
Oops ! How can I get specific editor browser object if I have two fields in a same schema ? I made a simple for you , let say you have this fields :

```javascript
addFields : [
    {
        type : 'custom-code-editor',
        name : 'mycode',
        label : 'Paste Your First Code Here'
    },
    {
        type : 'custom-code-editor',
        name : 'mysecondcode',
        label : 'Paste Your Second Code Here'
    }
]
```

Next, simply get the `name` property to get specific schema in browser object : 
```javascript
// First Editor
apos.customCodeEditor.mycode.editor

// Second Editor
apos.customCodeEditor.mysecondcode.editor
```

> Easy right ? Hell yeah it is ! :D

# How To
### Search Bar
Ace got it owns search bar. Simply hit `Ctrl + F` ! 

![Search Function](https://media.giphy.com/media/dQlgFYEG6CbgoHWdHw/giphy.gif)

### ***NEW FEATURE (Save Selection)
Now this one is a new function ONLY for ApostropheCMS . If you hit `Ctrl + Shift + S` while selecting new code, it will replace an existing highlighted text previously when you change your mode. Don't believe me ? Check it out !

![Save Feature](https://media.giphy.com/media/4EFt3QBgKu1NG5oz5a/giphy.gif)

Wait ! Can I change save command ? Yup , you can. Add options like this :
```javascript
ace : {
    config : {
        saveCommand : {
            win : 'Ctrl-Shift-F', // Windows Key
            mac : 'Command-Shift-F',// Mac Key,
            message : 'Your Selected Text Saved ! ' // Your custom save message
        }
    }
}
```

# Advanced Configuration
I know you are a tough coder living in Apostrophe who have sleepless night configuring this ace editor by yourself. Sometimes you just feel my options does not fit you enough. Well , nobody stopping you from configuring my custom code editor by yourself ! But I'm still need to guide you on this.

Let say you want to add MORE commands that you already refer to [Ace Editor HOW TO](https://ace.c9.io/#nav=howto) or maybe add new events by yourself. First , let's create new js file to any name you like and push like this :

```javascript
// In custom-code-editor/index.js
ace : {
    // All ace options
},
scripts : {
    files : [
        {
            name : 'custom', // will get /js/custom.js
            when : 'user'
        }
    ]
}
```

And inside `custom.js` :
```javascript
// In custom-code-editor/public/js/custom.js

apos.define('custom-code-editor', {
    construct : function(self,options){
        // create superPopulate to extend method
        var superPopulate = self.populate;

        // Get extension self object
        var _this = self;

        self.populate = function(object, name, $field, $el, field, callback){
            // Locate the element on specific schema
            var $fieldSet = apos.schemas.findFieldset($el, name);

            // Get Editor
            var $fieldInput = $fieldSet.find("[data-editor]").get(0);

            // Init Editor
            var editor = ace.edit($fieldInput);

            // ... your custom codes here

            superPopulate(object, name , $field , $el , field , callback);
        }
    }
})
```

## Methods available
These methods are available for you to use :


| Method | Description |
| --- | --- |
| self.populate | Run once. If contain any bind event like clickEvent, mouseEvent and etc, it will execute normally like your javascript browser. Check documentation here : [self.populate](https://apostrophecms.org/docs/tutorials/intermediate/custom-schema-field-types.html#handling-user-input-the-browser-side)
| self.method | Run multiple times. It will trigger on submission. Check documentation here : [self.convert](https://apostrophecms.org/docs/tutorials/intermediate/custom-schema-field-types.html#what-39-s-going-on-in-this-code) |
| _this | Just an example use of self . Because inside self.populate ,you cannot access self directly. You have to define it to a new variable. It returns all methods & options. |
| self.has / _this.has | `self.has`/`_this.has` accepts object and a string of path. This works similar as `_.has` in lodash but to access nested object , you only can use dot notation in that string. It returns `boolean`. |


### How to use .has method ?

 How to use ? Simple :

```javascript
var myObject = {
    nested : {
        anotherNested : {
            valueHere : true
        }
    }
}

// _this from extension object from self as shown example previously
_this.has(myObject , "nested.anotherNested.valueHere");
// Returns true

_this.has(myObject , "nested.anotherNested.getValue"); 
// Returns false since there is no getValue property inside anotherNested.myObject
```

#### Access all options available in `ace : {}` object
Simple , you can access it via `self.ace` or `_this.ace`

# Changelog


### 2.6.0
- **NEW SAVE FEATURE ADDED !** Provide new shortcut key to save your own selection and switch dropdown with your own selection ! . Adjust README to have better documentation to all developers.

- Fix if got empty modes when `clearModes : true` and should return text of `object[name].type`. This will not return empty text on dropdown when you have an existing value in schema.

### 2.5.0

- Fix default mode name should be show in dropdown if got `object[name]`. This will not be return empty text on dropdown.

### 2.3.0

- Adjust README and FIXED on existing dropdown `title` bug that would not update if open the schema again