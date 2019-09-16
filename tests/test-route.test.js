var assert = require("assert");
var async = require("async");
var fs = require("fs");
const expect = require('expect');
const request = require('supertest');
const _ = require("lodash");
const path = require("path")

describe("Custom Code Editor : Routes Saving Options", function () {

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
            root: process.platform === "win32" && !process.env.TRAVIS ? module : undefined,
            testModule: true,
            baseUrl: 'http://localhost:7000',
            modules: {
                'apostrophe-express': {
                    port: 7000
                },
                'custom-code-editor': {
                    ace: {
                        options: {
                            "enableBasicAutocompletion": true
                        }
                    }
                }
            },
            afterInit: function (callback) {
                assert(apos.schemas);
                assert(apos.modules['custom-code-editor']);
                assert(apos.users.safe.remove);
                return apos.users.safe.remove({}, callback);
            },
            afterListen: function (err) {
                assert(!err);
                done();
            }
        });
    });

  // Test pieces.newInstance()
  it('should be able to insert a new user', function (done) {
      assert(apos.users.newInstance);
      var user = apos.users.newInstance();
      assert(user);

      user.firstName = 'Jane';
      user.lastName = 'Doe';
      user.title = 'Jane Doe';
      user.username = 'JaneD';
      user.password = '123password';
      user.email = 'jane@aol.com';

      assert(user.type === 'apostrophe-user');
      assert(apos.users.insert);
      apos.users.insert(apos.tasks.getReq(), user, function (err) {
          assert(!err);
          janeOne = user;
          done();
      });

  });
});