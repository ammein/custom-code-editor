var assert = require("assert");

describe("Custom Code Editor : Basic Schema Test" , function(){
    var apos;

    // Apostrophe took some time to load
    // Ends everything at 50 seconds
    this.timeout(50000);

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
            // Windows seems to have problem with symlinkSync created by Apostrophe,
            // Therefore, make it run on current folder and creates all nessecary files on current directory to initialize
            root : process.platform === "win32" && !process.env.TRAVIS ? module : undefined,
            testModule: true,
            baseUrl: 'http://localhost:7780',
            modules: {
                'apostrophe-express': {
                    port: 7780
                },
                'custom-code-editor': {}
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

    it('should submit the schema with empty object and must not return an error', function(done){
        var req = apos.tasks.getReq();
        var schema = apos.schemas.compose({
            addFields : [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here'
            }]
        });
        var output = {};
        apos.schemas.convert(req, schema, 'form', {}, output, function(err) {
            assert(!err);
            done();
        })
    });

    it('should always return string value even the submitted value is undefined' , function(done) {
        var req = apos.tasks.getReq();
        var schema = apos.schemas.compose({
            addFields: [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here'
            }]
        });
        var output = {};
        apos.schemas.convert(req, schema, 'form', {
            mycode : {
                code: apos.launder.string(undefined),
                type: apos.launder.string(undefined)
            }
        }, output, function (err) {
            assert(!err);
            done();
        })
    })

    it('should trigger an error if the field is required with empty value', function(done) {
        var req = apos.tasks.getReq();
        var schema = apos.schemas.compose({
            addFields: [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here',
                required : true
            }]
        });

        var output = {};

        apos.schemas.convert(req, schema, 'form', {}, output, function(err) {
            assert(err);
            done();
        })
    });

    it('should not trigger any error if value present on required field' , function(done) {
        var req = apos.tasks.getReq();
        var schema = apos.schemas.compose({
            addFields: [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here',
                required: true
            }]
        });

        var output = {};

        apos.schemas.convert(req, schema, 'form', {
            mycode : {
                code : '<html></html>',
                type : "html"
            }
        }, output, function (err) {
            assert(!err);
            done();
        })
    });

    it('should not panicked even the value is absent for code', function(done) {
        var req = apos.tasks.getReq();
        var schema = apos.schemas.compose({
            addFields: [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here',
                required: true
            }]
        });

        var output = {};

        apos.schemas.convert(req, schema, 'form', {
            mycode: {
                code : "",
                type: "html"
            }
        }, output, function (err) {
            assert(!err);
            done();
        })
    })
})