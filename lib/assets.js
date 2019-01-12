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

                    if ((file).match(/^(.*)(?=\.)/g) === null || (acceptFiles).test(file)) {
                        return;
                    } else {
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