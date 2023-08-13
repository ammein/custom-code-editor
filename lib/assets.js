/* eslint-disable brace-style */
/* eslint-disable no-useless-return */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
module.exports = function (self, options) {
    self.pushAssets = function () {
        _.each(options.stylesheets.files || [], function (item) {

            if ((/^(.*?)((\/|\\)\*)/g).test(item.name)) {

                let itemRegex = (item.name).match(/^(.*?)(?=(\/|\\)\*)(\\|\/)/g);

                // eslint-disable-next-line no-path-concat
                let pathCSS = path.join(__dirname + '/../public/css', itemRegex.toString());

                fs.readdirSync(pathCSS).filter((file) => {
                    let acceptFiles = new RegExp(`^(\\S*)(?=\\.(?=${options.stylesheets.acceptFiles.join('|')}))`);

                    if ((file).match(/^(.*)(?=\.)/g) === null || (acceptFiles).test(file)) {
                        return;
                    } else {

                        let pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
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

                let itemRegex = (item.name).match(/^(.*?)(?=(\/|\\)\*)(\\|\/)/g);

                // eslint-disable-next-line no-path-concat
                let pathJS = path.join(__dirname + '/../public/js', itemRegex.toString());

                fs.readdirSync(pathJS).filter((file) => {
                    let acceptFiles = new RegExp(`^(\\S*)(?=\\.(?=${options.scripts.acceptFiles.join('|')}))`);

                    let allAceModes = new RegExp('(?!^mode-)(\\w+)(?=\\.js)', 'g');

                    let unAcceptedFiles = new RegExp(`^(w*)(?!mode-|theme-|${self.ace.modes.map((elem) => elem.name).join('|')}).*$`, 'i');

                    let unAcceptedSnippets = new RegExp(`^(?=.*\\/ace\\/snippets\\/(${self.ace.modes.map((elem) => elem.name).join('|')})).*$`, 'i');

                    let allThemes = new RegExp('(?!^theme-)(\\w+)(?=\\.js)', 'g');

                    if ((file).match(/^(.*)(?=\.)/g) === null || (acceptFiles).test(file) === false) {
                        return;
                    } else {
                        // Optimized pushAsset to avoid push all unused asset at once
                        if (!options.scripts.pushAllAce) {
                            // eslint-disable-next-line curly
                            for (let i = 0; i < self.ace.modes.length; i++)(function (i) {

                                let pushFile = '';

                                // Only push on acceptable modes
                                if ((allAceModes).test(file) && (file).match(allAceModes)[0] === self.ace.modes[i].name) {
                                    pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
                                    self.pushAsset('script', pushFile, {
                                        when: item.when
                                    });
                                    return;
                                }

                                // Only push on acceptable themes
                                else if ((allThemes).test(file) && (file).match(allThemes)[0] === self.ace.theme) {
                                    // eslint-disable-next-line no-var
                                    pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
                                    self.pushAsset('script', pushFile, {
                                        when: item.when
                                    });
                                    return;
                                }
                                // If it match snippets directory specifically for ace , run this pushAsset
                                else if ((/^(?=.*(snippets)).*$/i).test(itemRegex) && (unAcceptedSnippets).test(pathJS)) {
                                    // eslint-disable-next-line no-var
                                    pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
                                    self.pushAsset('script', pushFile, {
                                        when: item.when
                                    });
                                    return;
                                }
                                // Push the rest of the ace with accepted modes , themes & snippets
                                else if ((unAcceptedFiles).test(file) && (itemRegex.toString()).match(/^(?=.*(snippets)).*$/i) === null) {
                                    pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
                                    self.pushAsset('script', pushFile, {
                                        when: item.when
                                    });
                                    return;
                                }
                            })(i);
                            return;
                        }
                        let pushFile = itemRegex + (file).match(/^(.*)(?=\.)/g);
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