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
        config : {
            fontSize : 16, // Editor Font Size (Number or String)
            editorHeight : 500, // Editor Height (Number or String)
            dropdown : {
                enable : true, // Enable it for switching modes button (Boolean)
                height : 30, // Height Dropdown (Number or String)
                borderRadius : 5, // Border Radius Dropdown (Number or String)
                fontFamily : "Mont-Regular", // Font Family Dropdown (String)
                fontSize : 16 , // Font Size Dropdown (Number or String)
                position : {
                    // All top , left , right , bottom dropdown position enable for configs
                    bottom : 20,
                    right : 20
                },
                arrowColor : "blue" // To change arrow color in dropdown (String)
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
By default , `defaultMode : 'javascript'` enable. But you can choose a default mode by yourself ! Name any mode available for you. Let say a command prompt whenever you created a new widget with this schema on it

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
        name : 'sh',
        title : 'Bash' // This will make dropdown name as Bash instead of Sh
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
        // List of all modes that you want to define. The options you may write like this
        title : '<title of your mode>',
        name : '<name of your mode (case sensitive)>',
        snippet : '<code snippet>'
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
scripts : {
    files : [
        {
            name : 'parentFolder/*',
            when : 'user'
        }
    ]
    acceptFiles : ["con.min.js"] // and other prefix extension file names available
}
```

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