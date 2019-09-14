const _ = require("lodash");
const path = require("path");
// Provides my own options to be tested on server without any pushAssets to browser
// Since that this would only occur on server for testModule
module.exports = {
    name: 'custom-code-editor',
    alias: 'customCodeEditor',
    beforeConstruct: function (self, options) {
        options.stylesheets = _.defaults(options.stylesheets, {
            files: [],
            acceptFiles: []
        });

        options.scripts = _.defaults(options.scripts, {
            files: [],
            acceptFiles: [],
            pushAllAce: false
        });

        options.ace = _.defaults(options.ace, {
            theme: '',
            defaultMode: '',
            modes: [],
            optionsTypes: {}
        });

        options.ace.optionsTypes = _.merge(require("../aceTypes.js"), _.keyBy(options.ace.optionsTypes, 'name'))

        options.pathLib = path.join(__dirname + "/lib");

        options.ace.defaultMode = options.ace.defaultMode || 'javascript';

        options.ace.theme = options.ace.theme || "ambiance";

        if (options.ace.clearModes) {
            options.ace.modes = options.ace.modes;
        } else {
            var extensionMode = options.ace.modes;
            var originalMode = [{
                    title: "Bash",
                    name: 'sh',
                    snippet: `#!/bin/bash
                    # GNU bash, version 4.3.46
                    @code-here`
                },
                {
                    title: 'ActionScript',
                    name: 'actionscript'
                },
                {
                    title: 'C++',
                    name: 'c_cpp',
                    snippet: `//Microsoft (R) C/C++ Optimizing Compiler Version 19.00.23506 for x64

                    #include <iostream>

                    int main()
                    {
                        @code-here
                    }`
                },
                {
                    title: 'C#',
                    name: 'csharp',
                    snippet: `//Rextester.Program.Main is the entry point for your code. Don't change it.
                    //Compiler version 4.0.30319.17929 for Microsoft (R) .NET Framework 4.5

                    using System;
                    using System.Collections.Generic;
                    using System.Linq;
                    using System.Text.RegularExpressions;

                    namespace Rextester
                    {
                    public class Program
                    {
                        public static void Main(string[] args)
                        {
                                // code goes here
                                @code-here
                        }
                    }
                    }`
                },
                {
                    name: 'php',
                    snippet: `<html>
                    <head>
                    <title>PHP Test</title>
                    </head>
                    <body>
                    <?php //code goes here
                    @code-here
                    ?> 
                    </body>
                    </html>`
                },
                {
                    name: 'html',
                    snippet: `<!DOCTYPE html>
        <html>
        <head>
        <title>
        <!-- Title Here -->
        </title>
        </head>
        <body>
        <!-- Code-here -->
        @code-here
        </body>
        </html>`
                },
                {
                    name: 'javascript',
                    snippet: `document.addEventListener("DOMContentLoaded" , function(){
            @code-here
        });`
                }
            ];

            options.ace.modes = _.values(_.merge(_.keyBy(originalMode, 'name'), _.keyBy(extensionMode, 'name')));
        }

        options.stylesheets.files = [{
            name: 'codeStyle',
            when: 'user'
        }].concat(options.stylesheets.files || []);

        options.stylesheets.acceptFiles = [
            "css",
            "less",
            "sass"
        ].concat(options.stylesheets.acceptFiles || []);

        options.scripts.files = [{
            name: 'user',
            when: 'user'
        }, {
            name: 'ace/*',
            when: 'user'
        }, {
            name: 'clipboard/clipboard.min',
            when: 'user'
        }, {
            name: 'ace/snippets/*',
            when: 'user'
        }].concat(options.scripts.files || []);

        options.scripts.acceptFiles = [
            "js",
            "min.js"
        ].concat(options.scripts.acceptFiles || []);
    },
    afterConstruct: function (self) {
        self.addFieldCodeType();
        self.pushCreateSingleton();
    },
    construct: function (self, options) {
        self.pathLib = options.pathLib;
        self.name = options.name;
        self.ace = options.ace;

        // Browser Push
        self.pushCreateSingleton = function () {

            var options = {};

            _.defaults(options, {
                browser: {}
            });

            _.extend(options.browser, {
                name: self.name,
                action: self.action,
                ace: self.ace
            });

            self.apos.push.browserMirrorCall('user', self);

            self.apos.push.browserCall('user', 'apos.create(?, ?)', self.__meta.name, options.browser);
        };

        // Add Code FieldType
        self.addFieldCodeType = function () {
            self.apos.schemas.addFieldType({
                name: self.name,
                partial: self.fieldTypePartial,
                converters: {
                    code: function (req, data, name, object, field, callback) {
                        if (!data[name]) {
                            if (field.required) {
                                return callback('required');
                            }
                            object[name] = null;
                            return setImmediate(callback);
                        }
                        object[name] = {
                            code: self.apos.launder.string(data[name].code),
                            type: self.apos.launder.string(data[name].type)
                        };
                        return setImmediate(callback);
                    },
                    form: 'code'
                }
            });
        };

        // Add HTML Data
        self.fieldTypePartial = function (data) {
            return self.partial('code', data);
        };
    }
}