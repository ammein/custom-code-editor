/* eslint-disable no-undef */
let assert = require('assert');

describe('Custom Code Editor : Basic Schema Test', function() {
    let apos;

    // Apostrophe took some time to load
    // Ends everything at 50 seconds
    this.timeout(require("apostrophe/test-lib/util").timeout);

    after(function(done) {
        require('apostrophe/test-lib/util').destroy(apos, done);
    });

    it('should be a property of the apos object', function (done) {
        apos = require('apostrophe')({
            testModule: true,
            baseUrl: 'http://localhost:7780',
            modules: {
                'apostrophe-express': {
                    port: 7780,
                    session: {
                        secret: 'xx'
                    }
                },
                // Add an alt field to images schema, by default the title is used but
                // we recommend enabling the alt field for clarity.
                'apostrophe-images': {
                    enableAltField: true
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

    it('should submit the schema with empty object and must not return an error', function(done) {
        let req = apos.tasks.getReq();
        let schema = apos.schemas.compose({
            addFields: [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here'
            }]
        });
        let output = {};
        apos.schemas.convert(req, schema, 'form', {}, output, function(err) {
            assert(!err);
            done();
        })
    });

    it('should always return string value even the submitted value is undefined', function(done) {
        let req = apos.tasks.getReq();
        let schema = apos.schemas.compose({
            addFields: [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here'
            }]
        });
        let output = {};
        apos.schemas.convert(req, schema, 'form', {
            mycode: {
                code: apos.launder.string(undefined),
                type: apos.launder.string(undefined)
            }
        }, output, function (err) {
            assert(!err);
            done();
        })
    })

    it('should trigger an error if the field is required with empty value', function(done) {
        let req = apos.tasks.getReq();
        let schema = apos.schemas.compose({
            addFields: [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here',
                required: true
            }]
        });

        let output = {};

        apos.schemas.convert(req, schema, 'form', {}, output, function(err) {
            assert(err);
            done();
        })
    });

    it('should not trigger any error if value present on required field', function(done) {
        let req = apos.tasks.getReq();
        let schema = apos.schemas.compose({
            addFields: [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here',
                required: true
            }]
        });

        let output = {};

        apos.schemas.convert(req, schema, 'form', {
            mycode: {
                code: '<html></html>',
                type: 'html'
            }
        }, output, function (err) {
            assert(!err);
            done();
        })
    });

    it('should not panicked even the value is absent for code', function(done) {
        let req = apos.tasks.getReq();
        let schema = apos.schemas.compose({
            addFields: [{
                type: 'custom-code-editor',
                name: 'mycode',
                label: 'Paste your code here',
                required: true
            }]
        });

        let output = {};

        apos.schemas.convert(req, schema, 'form', {
            mycode: {
                code: '',
                type: 'html'
            }
        }, output, function (err) {
            assert(!err);
            done();
        })
    })
})