/* eslint-disable no-var */
/* eslint-disable no-undef */
let assert = require('assert');
const expect = require('expect').expect;
const _ = require('lodash');
const path = require('path');

describe('Custom Code Editor : Override Options and Push Asset Test', function () {
    let originalOptionsTypes = require('../aceTypes');
    let apos;

    let snippetCSS = '/* This is CSS3 */ \n { box-sizing : border-box; \n font : inherit; } \n \n @code-here';
    let snippetBatch = '# Welcome to Command Prompt \n # Enter Any Command Here \n @code-here';

    // Apostrophe took some time to load
    // Ends everything at 50 seconds
    this.timeout(require("apostrophe/test-lib/util").timeout);

    after(function (done) {
        require('apostrophe/test-lib/util').destroy(apos, done);
    });

    it('should be a property of the apos object', function (done) {
        apos = require('apostrophe')({
            // Make it `module` to be enabled because we have pushAssets method called
            root: module,
            testModule: true,
            baseUrl: 'http://localhost:7790',
            modules: {
                'apostrophe-express': {
                    port: 7790,
                    session: {
                        secret: 'xx'
                    }
                },
                // Add an alt field to images schema, by default the title is used but
                // we recommend enabling the alt field for clarity.
                'apostrophe-images': {
                    enableAltField: true
                },
                'custom-code-editor': {
                    ace: {
                        theme: 'monokai',
                        defaultMode: 'html',
                        options: {
                            'enableBasicAutocompletion': true
                        },
                        modes: [
                            {
                                title: 'CSS',
                                name: 'css',
                                snippet: snippetCSS
                            },
                            {
                                title: 'html',
                                name: 'html'
                            },
                            {
                                title: 'Command Prompt',
                                name: 'batchfile',
                                snippet: snippetBatch
                            }
                        ]
                    },
                    config: {
                        dropdown: {
                            enable: true,
                            height: 30,
                            borderRadius: 5,
                            fontFamily: 'Mont-Regular',
                            fontSize: 16,
                            position: {
                                bottom: 20,
                                right: 20
                            },
                            arrowColor: 'yellow'
                        }
                    }
                }
            },
            afterInit: function (callback) {
                assert(apos.schemas);
                assert(apos.modules['custom-code-editor']);
                return callback(null);
            },
            afterListen: function (err) {
                assert(!err);
                done();
            }
        });
    });

    it('should get all the ace options to be the same', function() {
        let originalModes = [{
                title: 'Bash',
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

        expect(apos.customCodeEditor.ace).toMatchObject({
            theme: 'monokai',
            defaultMode: 'html',
            options: {
                'enableBasicAutocompletion': true
            },
            modes: _.values(_.merge(_.keyBy(originalModes, 'name'), _.keyBy([{
                    title: 'CSS',
                    name: 'css',
                    snippet: snippetCSS
                },
                {
                    title: 'html',
                    name: 'html'
                },
                {
                    title: 'Command Prompt',
                    name: 'batchfile',
                    snippet: snippetBatch
                }
            ], 'name'))),
            optionsTypes: originalOptionsTypes
        })
    });

    it('should get all the files according to the defined modes', function() {
        // Push to all modes name to be expect
        const expected = []
        _.forEach(apos.customCodeEditor.ace.modes, function (value, i, arr) {
            expected.push(new RegExp('mode-' + value.name, 'g'))
        })

        for (let i = apos.assets.pushed.scripts.length - 1; i >= 0; i--) {
            let web = apos.assets.pushed.scripts[i].web
            var file = apos.assets.pushed.scripts[i].file

            if (web.match(/custom-code-editor/g)) {
                _.forEach(expected, function(value, i, arr) {
                    if (file.match(/mode-/g)) {
                        if (file.match(value)) {
                            // If file match with the defined modes
                            expect(file).toEqual(
                                expect.stringMatching(value)
                            )
                        } else if (!file.match(value)) {
                            // If file not match with the defined modes
                            expect(file).not.toEqual(
                                expect.stringMatching(value)
                            )
                        }
                    }
                })
            }
        }
    });

    it('should get the file that according to the defined theme', function () {
        let theme = new RegExp('theme-' + apos.customCodeEditor.ace.theme, 'g')
        for (let i = apos.assets.pushed.scripts.length - 1; i >= 0; i--) {
            let web = apos.assets.pushed.scripts[i].web
            let file = apos.assets.pushed.scripts[i].file

            if (web.match(/custom-code-editor/g)) {
                if (file.match(/theme-/g)) {
                    if (file.match(theme)) {
                        // If file match with the defined modes
                        expect(file).toEqual(
                            expect.stringMatching(theme)
                        )
                    } else if (!file.match(theme)) {
                        // If file not match with the defined modes
                        expect(file).not.toEqual(
                            expect.stringMatching(theme)
                        )
                    }
                }
            }
        }
    });

    it('should not push custom mode via browser options or any illegal options passing from project level module', function () {
        // Push to all modes name to be expect
        const expected = []
        _.forEach(apos.customCodeEditor.ace.modes, function (value, i, arr) {
            expected.push(new RegExp('mode-' + value.name, 'g'))
        })

        // Pass Custom Mode Hardcoded
        expected.push(/mode-python/g)

        for (let i = apos.assets.pushed.scripts.length - 1; i >= 0; i--) {
            let web = apos.assets.pushed.scripts[i].web
            var file = apos.assets.pushed.scripts[i].file

            if (web.match(/custom-code-editor/g)) {
                _.forEach(expected, function (value, i, arr) {
                    if (file.match(/mode-/g)) {
                        if (file.match(value)) {
                            // If file match with the defined modes
                            expect(file).toEqual(
                                expect.stringMatching(value)
                            )
                        } else if (!file.match(value)) {
                            // If file not match with the defined modes
                            expect(file).not.toEqual(
                                expect.stringMatching(value)
                            )
                        }
                    }
                })
            }
        }
    });

    it('should not push custom theme via browser options or any illegal options passing from project level module', function () {
        // Pass Custom Theme Hardcoded
        apos.customCodeEditor.ace.theme = 'solarized_dark'
        let theme = new RegExp('theme-' + apos.customCodeEditor.ace.theme, 'g')
        for (let i = apos.assets.pushed.scripts.length - 1; i >= 0; i--) {
            let web = apos.assets.pushed.scripts[i].web
            let file = apos.assets.pushed.scripts[i].file

            if (web.match(/custom-code-editor/g)) {
                if (file.match(/theme-/g)) {
                    // Must not matched with defined theme push, since
                    // theme asset is always pushing one JS file
                    expect(file).not.toEqual(
                        expect.stringMatching(theme)
                    )
                }
            }
        }
    });
});