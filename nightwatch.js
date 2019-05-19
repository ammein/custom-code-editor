module.exports = {
    src_folders: ["tests/scenarios"],
    output_folder : "/tests/report",
    custom_commands_path: [
        "node_modules/apostrophe-nightwatch-tools/commands",
        "tests/commands"
    ],
    selenium : {
        start_process : false
    },
    test_settings: {
        local: {
            launch_url: "http://localhost:8081",
            port: 3111,
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true
            }
        }
    },
}