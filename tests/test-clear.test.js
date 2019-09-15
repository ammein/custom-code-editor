var assert = require("assert");
var async = require("async");
var fs = require("fs");
const expect = require('expect');
const request = require('supertest');
const _ = require("lodash");
const path = require("path");

describe("Custom Code Editor : Clear Modes and Push All Assets", function () {
    var originalOptionsTypes = require("../aceTypes");
    var apos;

    // Apostrophe took some time to load
    // Ends everything at 50 seconds
    this.timeout(50000);

    after(function (done) {
        try {
            require("apostrophe/test-lib/util").destroy(apos, done);
        } catch (e) {
            console.warn('Old version of apostrophe does not export test-lib/util library, just dropping old test db');
            apos.db.dropDatabase();
            setTimeout(done, 1000);
        }
    });

    it('should be a property of the apos object', function (done) {
        apos = require('apostrophe')({
            // Make it `module` to be enabled because we have pushAssets method called
            root: module,
            testModule: true,
            baseUrl: 'http://localhost:7990',
            modules: {
                'apostrophe-express': {
                    port: 7990
                },
                'custom-code-editor': {
                    ace: {
                        clearModes : true
                    },
                    scripts : {
                        pushAllAce : true
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

    it('should clear all the modes options' , function() {
        expect(JSON.stringify(apos.customCodeEditor.ace.modes)).toEqual(JSON.stringify([]))
        expect(apos.customCodeEditor.ace.modes.length).toBe(0)
    })

    it('should received all the modes when \"pushAllAce\" is defined', function(done) {
        // Read All the Files that shows available mode
        var pathPublicAce = path.join(__dirname + "/../public/js/ace");
        var allModes = [];
        var extractModeRegex = new RegExp("[^mode-](.*)", "g")
        fs.readdirSync(pathPublicAce).filter(function(value, i, arr) {
            if (value.match(/mode-/g)){
                allModes.push(value.match(extractModeRegex)[0])
            }
        })
        for (var i = apos.assets.pushed.scripts.length - 1; i >= 0; i--) {
            var web = apos.assets.pushed.scripts[i].web
            var file = apos.assets.pushed.scripts[i].file

            if (web.match(/custom-code-editor/g)) {
                if (file.match(/mode-/g)) {
                    allModes.forEach(function(mode, i , arr) {
                        var regex = new RegExp("mode-" + mode, 'g')
                        var anyMode = new RegExp("(mode-.*)$", 'g');
                        if (file.match(regex)) {
                            expect(file.match(anyMode)).toEqual([
                                expect.stringMatching(regex)
                            ])
                        } else if (!file.match(regex)) {
                            expect(file.match(regex)).toBeNull()
                        }
                    })
                }
            }
        }

        done();
    });

    it('should get all the themes when "pushAllAce" is defined ', function (done) {
        // Read All the Files that shows available mode
        var pathPublicAce = path.join(__dirname + "/../public/js/ace");
        var allThemes = []
        var extractModeRegex = new RegExp("[^theme-](.*)", "g")
        fs.readdirSync(pathPublicAce).filter(function (value, i, arr) {
            if (value.match(/theme-/g)) {
                allThemes.push(value.match(extractModeRegex)[0])
            }
        })
        for (var i = apos.assets.pushed.scripts.length - 1; i >= 0; i--) {
            var web = apos.assets.pushed.scripts[i].web
            var file = apos.assets.pushed.scripts[i].file

            if (web.match(/custom-code-editor/g)) {
                if (file.match(/theme-/g)) {
                    allThemes.forEach(function (theme, i, arr) {
                        var regex = new RegExp("theme-" + theme, 'g');
                        var anyTheme = new RegExp("(theme-.*)$", 'g');
                        if (file.match(regex)) {
                            expect(file.match(anyTheme)).toEqual([
                                expect.stringMatching(regex)
                            ])
                        } else if (!file.match(regex)) {
                            expect(file.match(regex)).toBeNull()
                        }
                    })
                }
            }
        }

        done();
    });
});