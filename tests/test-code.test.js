var assert = require("assert");
var async = require("async");
var fs = require("fs");
const expect = require('expect');
const request = require('supertest');

describe("It should play nicely with custom-code-editor" , function(){
    var apos;

    this.timeout(5000);

    after(function(done){
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
            testModule: true,
            baseUrl: 'http://localhost:7780',
            modules: {
                'apostrophe-express': {
                    port: 7780
                },
                'apostrophe-pages' : {
                    types : [
                        {
                            name : "home",
                            label : "home"
                        },
                        {
                            name: 'default',
                            label: 'Default'
                        }
                    ]
                },
                'custom-code-editor': {}
            },
            afterInit: function (callback) {
                assert(apos.modules['custom-code-editor']);
                return callback(null);
            },
            afterListen: function (err) {
                done();
            }
        });
    })

    it('should get all the options on the browser', function(done){
        console.log("Running");
        done()
    })
})