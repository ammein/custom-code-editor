// Get Selenium and the drivers
var seleniumServer = require('selenium-server');
var chromedriver = require('chromedriver');
var geckodriver = require('geckodriver');
module.exports = {
    src_folders: ["tests/scenarios"],
    output_folder : "/tests/report",
    globals_path: './globals.js',
    custom_commands_path: [
        "node_modules/apostrophe-nightwatch-tools/commands",
        "tests/commands"
    ],
    selenium: {
        // Information for selenium, such as the location of the drivers ect.
        start_process: true,
        server_path: seleniumServer.path,
        port: 4444, // Standard selenium port
        cli_args: {
            'webdriver.chrome.driver': chromedriver.path,
            'webdriver.gecko.driver': geckodriver.path
        }
    },
    test_workers: {
        enabled: true,
        workers: 3,
    },
    test_settings: {
        local: {
            launch_url: "http://localhost:8081",
            // ChromeDriver default port.
            selenium_port: 4444,
            selenium_host: 'localhost',
            globals: {
                // How long to wait (in milliseconds) before the test times out
                waitForConditionTimeout: 5000
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true
            }
        }
    },
}