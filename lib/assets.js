const _ = require("lodash");
const fs = require("fs");
const path = require("path");
module.exports = function (self, options) {
    self.pushAssets = function () {
        _.each(options.stylesheets.files || [], function (item) {

            if ((/^(.*?)((\/|\\)\*)/g).test(item.name)) {

                var itemRegex = (item.name).match(/^(.*?)(?=(\/|\\)\*)(\\|\/)/g);

                var pathCSS = path.join(__dirname + "/../public/css", itemRegex.toString());

                fs.readdirSync(pathCSS).filter((file) => {
                    var acceptFiles = new RegExp(`^(\S*)(?=\.(?=${options.stylesheets.acceptFiles.join("|")}))`);


                    if ((file).match(/^(.*)(?=\.)/g) === null || (acceptFiles).test(file)) {
                        return;
                    } else {

                        var pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
                        self.pushAsset('stylesheet', pushFile, {
                            when: item.when
                        });
                        return;
                    }
                });
            } else {
                self.pushAsset('stylesheet', item.name, {
                    when: item.when
                });
            }
        })

        _.each(options.scripts.files || [], function (item) {

            if ((/^(.*?)((\/|\\)\*)/g).test(item.name)) {

                var itemRegex = (item.name).match(/^(.*?)(?=(\/|\\)\*)(\\|\/)/g);

                var pathJS = path.join(__dirname + "/../public/js", itemRegex.toString());

                fs.readdirSync(pathJS).filter((file) => {
                    var acceptFiles = new RegExp(`^(\S*)(?=\.(?=${options.scripts.acceptFiles.join("|")}))`);

                    var allAceModes = new RegExp("(?!^mode-)(\\w+)(?=\.js)", "g");

                    var notModes = new RegExp("^((?!mode-).)*$", "g");

                    var allThemes = new RegExp("(?!^theme-)(\\w+)(?=\.js)", "g");

                    var notThemes = new RegExp("^((?!theme-).)*$", "g");

                    if ((file).match(/^(.*)(?=\.)/g) === null || (acceptFiles).test(file)) {
                        return;
                    }
                    else {
                        if (!options.scripts.pushAllAce) {
                            for (var i = 0; i < self.ace.modes.length; i++)(function (i) {
                                var excludeFile = new RegExp(`^((?!\w*)|${self.ace.modes.map((elem) => elem.name).join("|")}|worker-|ext-|ace).*$`, "g");

                                // Only push on acceptable modes
                                if ((allAceModes).test(file) && (file).match(allAceModes)[0] === self.ace.modes[i].name) {
                                    var pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
                                    self.pushAsset('script', pushFile, {
                                        when: item.when
                                    });
                                    return;
                                }

                                // Only push on acceptable themes
                                else if ((allThemes).test(file) && (file).match(allThemes)[0] === self.ace.theme) {
                                    var pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
                                    self.pushAsset('script', pushFile, {
                                        when: item.when
                                    });
                                    return;
                                }

                                // Push the rest of the ace with accepted modes
                                else if (((notModes).test(file) && (notThemes).test(file)) && (excludeFile).test(file)) {
                                    var pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
                                    self.pushAsset('script', pushFile, {
                                        when: item.when
                                    });
                                    return;
                                }
                            })(i);
                            return;
                        }
                        var pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
                        self.pushAsset('script', pushFile, {
                            when: item.when
                        });
                        return;
                    }
                });
            } else {
                self.pushAsset('script', item.name, {
                    when: item.when
                });
            }
        })
    }
}