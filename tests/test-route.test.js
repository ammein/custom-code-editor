/* eslint-disable no-global-assign */
/* eslint-disable no-undef */
let assert = require('assert');
let fs = require('fs');
const expect = require('expect').expect;
const request = require('supertest');
const _ = require('lodash');
const path = require('path');

describe('Custom Code Editor : Routes Saving Options', function () {

    // Apostrophe took some time to load
    // Ends everything at 50 seconds
    this.timeout(require("apostrophe/test-lib/util").timeout);

    let dummyUser;
    let body = {
        'customCodeEditor': {
            'enableEmmet': true
        }
    }

    let apos;

    after(function (done) {
        require('apostrophe/test-lib/util').destroy(apos, done);
    });

    it('should be a property of the apos object', function (done) {
        apos = require('apostrophe')({
            testModule: true,
            baseUrl: 'http://localhost:7000',
            modules: {
                'apostrophe-express': {
                    port: 7999,
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
                        options: {
                            'enableBasicAutocompletion': true
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
        let user = apos.users.newInstance();
        assert(user);

        user.firstName = 'Abu';
        user.lastName = 'Bakar';
        user.title = 'Abu Bakar';
        user.username = 'abuBakar';
        user.password = '123password';
        user.email = 'abu@dummy.com';

        assert(user.type === 'apostrophe-user');
        assert(apos.users.insert);
        apos.users.insert(apos.tasks.getReq(), user, function (err) {
            assert(!err);
            dummyUser = user;
            done();
        });
    });

    it('should get empty user save options on customCodeEditor', function(done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        req.user = _.assign(existingUser, myUser);
        apos.customCodeEditor.getOptions(req, function(err, result) {
            if (err) {
                console.log('ERROR (GET) : ', err)
            }
            assert(!err)
            expect(result).toMatchObject({});
            expect(Object.keys(result).length).toBe(0);
            done();
        })
    });

    it('should save user options successfully', function(done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        req.user = _.assign(existingUser, myUser);
        req.body = _.cloneDeep(body)
        apos.customCodeEditor.submit(req, function(err) {
            if (err) {
                console.log('ERROR (POST) : ', err)
            }
            assert(!err);
            // Check User Database to be match with customCodeEditor saving options
            apos.users.find(req, { username: 'abuBakar' }).toObject(function(err, user) {
                if (err) {
                    console.log('ERROR (USER POST) : ', err)
                }
                assert(!err);
                expect(user.customCodeEditor).toMatchObject(body.customCodeEditor);
                assert(user.username === 'abuBakar');
                done()
            })
        })
    });

    it('should get previous saves options', function(done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        req.user = _.assign(existingUser, myUser);
        apos.customCodeEditor.getOptions(req, function (err, result) {
            if (err) {
                console.log('ERROR (GET) : ', err)
            }
            assert(!err)
            expect(result).toMatchObject(body.customCodeEditor);
            expect(Object.keys(result).length).toBe(1);
            // Check User Database to be match with customCodeEditor saving options
            apos.users.find(req, { username: 'abuBakar' }).toObject(function (err, user) {
                if (err) {
                    console.log('ERROR (USER GET) : ', err)
                }
                assert(!err);
                // Must match with the result
                expect(user.customCodeEditor).toMatchObject(result);
                assert(user.username === 'abuBakar');
                done();
            })
        })
    });

    it('should reset options successfully using DELETE route', function(done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        req.user = _.assign(existingUser, myUser);

        apos.customCodeEditor.removeOptions(req, function(err) {
            if (err) {
                console.log('ERROR (DELETE) : ', err);
            }
            assert(!err);
            // Check user to see if it is truly removes all the options
            apos.users.find(req, { username: 'abuBakar' }).toObject(function(err, user) {
                if (err) {
                    console.log('ERROR (USER DELETE) : ', err);
                }
                assert(!err);
                assert(user.username === 'abuBakar');
                expect(user['customCodeEditor']).toBe(undefined);
                done();
            })
        });
    });

    it('should get empty saves options after removed all the options', function(done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        req.user = _.assign(existingUser, myUser);
        apos.customCodeEditor.getOptions(req, function (err, result) {
            if (err) {
                console.log('ERROR (GET) : ', err)
            }
            assert(!err)
            expect(result).toMatchObject({});
            expect(Object.keys(result).length).toBe(0);
            done();
        })
    });

    it('should save user options successfully - second time', function (done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        req.user = _.assign(existingUser, myUser);
        req.body = _.cloneDeep(body)
        apos.customCodeEditor.submit(req, function (err) {
            if (err) {
                console.log('ERROR (POST) : ', err)
            }
            assert(!err);
            // Check User Database to be match with customCodeEditor saving options
            apos.users.find(req, {
                username: 'abuBakar'
            }).toObject(function (err, user) {
                if (err) {
                    console.log('ERROR (USER POST) : ', err)
                }
                assert(!err);
                expect(user.customCodeEditor).toMatchObject(body.customCodeEditor);
                assert(user.username === 'abuBakar');
                done()
            })
        })
    });

    it('should not submit wrong key value to save and must maintain the saves value', function(done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        let cloneBody = _.cloneDeep(body);
        req.user = _.assign(existingUser, myUser);
        req.body = {
            'NotCustomCodeEditor': cloneBody.customCodeEditor
        }
        apos.customCodeEditor.submit(req, function(err) {
            assert(!err);

            // Check User Database to be available
            apos.users.find(req, {
                username: 'abuBakar'
            }).toObject(function (err, user) {
                assert(!err);
                expect(user.username).toBe('abuBakar');
                expect(user.customCodeEditor).toMatchObject(body.customCodeEditor);
                expect(user['NotCustomCodeEditor']).not.toBeTruthy();
                expect(user['NotCustomCodeEditor']).toBeFalsy();

                apos.customCodeEditor.getOptions(req, function(err, result) {
                    assert(!err);
                    expect(result).toMatchObject(body.customCodeEditor);
                    done();
                })
            })
        })
    });

    it('should reset options successfully using DELETE route - second time', function (done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        req.user = _.assign(existingUser, myUser);

        apos.customCodeEditor.removeOptions(req, function (err) {
            if (err) {
                console.log('ERROR (DELETE) : ', err);
            }
            assert(!err);
            // Check user to see if it is truly removes all the options
            apos.users.find(req, {
                username: 'abuBakar'
            }).toObject(function (err, user) {
                if (err) {
                    console.log('ERROR (USER DELETE) : ', err);
                }
                assert(!err);
                assert(user.username === 'abuBakar');
                expect(user['customCodeEditor']).toBe(undefined);
                done();
            })
        });
    });

    it('should not submit wrong key value to save and must return nothing', function (done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        let cloneBody = _.cloneDeep(body);
        req.user = _.assign(existingUser, myUser);
        req.body = {
            'NotCustomCodeEditor': cloneBody.customCodeEditor
        }
        apos.customCodeEditor.submit(req, function (err) {
            assert(!err);

            // Check User Database to be available
            apos.users.find(req, {
                username: 'abuBakar'
            }).toObject(function (err, user) {
                assert(!err);
                expect(user.username).toBe('abuBakar');
                expect(user.customCodeEditor).toBe(null)
                expect(user['NotCustomCodeEditor']).not.toBeTruthy();
                expect(user['NotCustomCodeEditor']).toBeFalsy();

                apos.customCodeEditor.getOptions(req, function (err, result) {
                    assert(!err);
                    expect(result).toMatchObject({});
                    done();
                })
            })
        })
    });

    it('should save user options successfully - last time', function (done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        req.user = _.assign(existingUser, myUser);
        req.body = _.cloneDeep(body)
        apos.customCodeEditor.submit(req, function (err) {
            if (err) {
                console.log('ERROR (POST) : ', err)
            }
            assert(!err);
            // Check User Database to be match with customCodeEditor saving options
            apos.users.find(req, {
                username: 'abuBakar'
            }).toObject(function (err, user) {
                if (err) {
                    console.log('ERROR (USER POST) : ', err)
                }
                assert(!err);
                expect(user.customCodeEditor).toMatchObject(body.customCodeEditor);
                assert(user.username === 'abuBakar');
                done()
            })
        })
    });

    it('should not saves wrong key value and must maintain the saves value', function (done) {
        let req = apos.tasks.getReq();
        let existingUser = _.cloneDeep(req.user);
        let myUser = _.cloneDeep(dummyUser);
        let cloneBody = _.cloneDeep(body);
        req.user = _.assign(existingUser, myUser);
        req.body = {
            'NotCustomCodeEditor': {
                'highlightActiveLine': false
            }
        }
        apos.customCodeEditor.submit(req, function (err) {
            assert(!err);

            // Check User Database to be available
            apos.users.find(req, {
                username: 'abuBakar'
            }).toObject(function (err, user) {
                assert(!err);
                expect(user.username).toBe('abuBakar');
                expect(user.customCodeEditor).toMatchObject(body.customCodeEditor);
                expect(user['NotCustomCodeEditor']).not.toBeTruthy();
                expect(user['NotCustomCodeEditor']).toBeFalsy();

                apos.customCodeEditor.getOptions(req, function (err, result) {
                    assert(!err);
                    expect(result).toMatchObject(body.customCodeEditor);
                    done();
                })
            })
        })
    });
});