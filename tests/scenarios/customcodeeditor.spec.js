const steps = require('apostrophe-nightwatch-tools/steps');
const server = require('apostrophe-nightwatch-tools/server');

module.exports = Object.assign(
    {
        before: (client, done) => {
            console.log(process.argv);
            console.log('IN START');
            client.resizeWindow(1200, 800);
            if (!this._server) {
                this._server = server.create('localhost', 3111);
                this._server.start(done);
            }
        },
        after: (client, done) => {
            console.log('IN AFTER');
            client.end(() => {
                console.log('STOPPING FROM AFTER');
                this._server.stop(done);
            });
        },
    },
    steps.main(),
    steps.login(),
    steps.navigateToHome(),
    {
        'Make sure custom-code-editor functional' : (client) => {
            
        }
    }
);