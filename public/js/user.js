apos.define('custom-code-editor', {
    afterConstruct: function (self) {
        self.addFieldCodeType();
    },
    construct: function (self, options) {

        self.name = self.__meta.name;

        self.ace = options.ace;

        self.addFieldCodeType = function () {
            apos.schemas.addFieldType({
                name: self.name,
                populate: self.populate,
                convert: self.convert
            })
        }

        // To avoid using lodash _.has
        self.has = function (object, path) {
            var curObj = object;
            var pathArr = path.match(/([^\.\[\]]+)/g);
            for (var p in pathArr) {
                if (curObj === undefined || curObj === null) return curObj; // should probably test for object/array instead
                curObj = curObj[pathArr[p]];
            }
            return curObj;
        }

        // Get the field ready and pickup the current code value
        self.populate = function (object, name, $field, $el, field, callback) {
            // Capitalize helper
            String.prototype.capitalize = function () {
                return this.charAt(0).toUpperCase() + this.slice(1);
            }

            // Locate the element 
            var $fieldSet = apos.schemas.findFieldset($el, name);

            var originalValue;

            // Init The Element
            var $fieldInput = $fieldSet.find("[data-editor]").get(0);

            var editor = ace.edit($fieldInput);

            // Pass to self object
            self.editor = editor;

            // Default Empty Value
            editor.setValue("");

            editor.session.setMode("ace/mode/" + self.ace.defaultMode.toLowerCase());
            editor.setTheme("ace/theme/" + self.ace.theme);

            // If got specific height for editor-container
            if (self.has(self.ace, "config.editorHeight")) {
                $($fieldSet.find(".editor-container")).css({
                    height: self.ace.config.editorHeight
                })
            }

            // If got fontSize config for editor
            if (self.has(self.ace, "config.fontSize")) {
                $($fieldInput).attr('style', (typeof self.ace.config.fontSize === "number") ? "font-size :" + self.ace.config.fontSize.toString() + "px !important;" : "font-size :" + self.ace.config.fontSize + " !important;");
            }

            // Options reference : https://github.com/ajaxorg/ace/wiki/Configuring-Ace
            if (self.has(self.ace, "options")) {
                // use setOptions method to set several options at once
                var options = self.ace.options;
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        editor.setOptions(Object.assign(options));
                    }
                }
            }

            // If dropdown enable
            if (self.has(self.ace, "config.dropdown.enable")) {

                // Only Set if got no object. Set to defaultMode
                if (!object[name]) {
                    $($fieldSet.find("#buttonDropdown")).text(self.ace.defaultMode.capitalize());
                }

                // Enable Dropdown
                $($fieldSet.find(".dropdown")).css({
                    display: 'block'
                })
                // Dropdown
                $fieldSet.find("#buttonDropdown").on("click", function () {
                    $($fieldSet.find("#myDropdown")).toggleClass("show");
                    $($fieldSet.find("#myDropdown")).css("top", $($fieldSet.find(".dropdown")).height() + "px");
                })

                // create dropdown modes
                for (var i = 0; i < self.ace.modes.length; i++) {
                    var dropdown = $fieldSet.find("#myDropdown");
                    var li = document.createElement("li");
                    li.innerHTML =
                        (self.ace.modes[i].title) ? self.ace.modes[i].title.capitalize() : self.ace.modes[i].name.capitalize();
                    $(dropdown).append(li);

                    if (self.ace.modes[i].title) {
                        li.setAttribute("data-name", self.ace.modes[i].name.toLowerCase());
                        li.setAttribute("data-title", self.ace.modes[i].title.capitalize());
                    } else {
                        li.setAttribute("data-name", self.ace.modes[i].name.toLowerCase());
                    }

                    // Set Mode
                    if (self.ace.defaultMode === self.ace.modes[i].name) {

                        editor.session.setMode("ace/mode/" + self.ace.defaultMode.toLowerCase());

                        if (self.ace.modes[i].snippet && !self.ace.modes[i].disableSnippet) {

                            var beautify = ace.require("ace/ext/beautify");
                            editor.session.setValue(self.ace.modes[i].snippet);
                            beautify.beautify(editor.session);
                            // Find the template for replace the code area
                            var find = editor.find('@code-here', {
                                backwards: false,
                                wrap: true,
                                caseSensitive: true,
                                wholeWord: true,
                                regExp: false
                            });

                            // If found
                            if (find) {
                                editor.replace("");
                            }
                        }
                    }

                };

                var allItems = $fieldSet.find("#myDropdown > li");

                for (var i = 0; i < allItems.length; i++)(function (i) {
                    $(allItems.get(i)).on("click", function () {
                        var getText = $(this).attr("data-name");
                        var getTitle = $(this).attr("data-title");

                        $fieldSet.find("#buttonDropdown").text((getTitle) ? getTitle.capitalize() : getText.capitalize());
                        // Set Mode
                        for (var i = 0; i < self.ace.modes.length; i++)(function (i) {
                            if (getText === self.ace.modes[i].name) {

                                editor.session.setMode("ace/mode/" + self.ace.modes[i].name.toLowerCase());

                                if (self.ace.modes[i].snippet) {
                                    // If got disableContent , get out from this if else
                                    if (self.ace.modes[i].disableSnippet)
                                        return;

                                    var beautify = ace.require("ace/ext/beautify");
                                    editor.session.setValue(self.ace.modes[i].snippet);
                                    beautify.beautify(editor.session);
                                    // If changing mode got existing codes , replace the value
                                    if (editor.getSelectedText().length > 1)
                                        return originalValue = editor.replace(editor.getSelectedText());

                                    // Find the template for replace the code area
                                    var find = editor.find('@code-here', {
                                        backwards: false,
                                        wrap: true,
                                        caseSensitive: true,
                                        wholeWord: true,
                                        regExp: false
                                    });

                                    // If found
                                    if (find && originalValue !== undefined) {
                                        editor.replace(originalValue);
                                    } else {
                                        editor.replace("");
                                    }
                                    return;
                                }
                            }
                        })(i);
                    })
                })(i);

                $($fieldSet.find("#myInput")).on("keyup", function () {
                    var input, filter, ul, li, a, i;
                    input = $fieldSet.find("#myInput");
                    filter = $(input).val().toUpperCase();
                    div = $fieldSet.find("#myDropdown");
                    a = $(div).find("li");
                    for (i = 0; i < a.length; i++)(function (i) {
                        txtValue = $(a.get(i)).text();

                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            $(a.get(i)).css("display", "");
                        } else {
                            $(a.get(i)).css("display", "none");
                        }
                    }(i));
                })

                var dropdownObject = self.ace.config.dropdown;

                // Dropdown Config
                $($fieldSet.find(".dropdown")).css({
                    top: (self.has(dropdownObject, "position.top")) ? self.ace.config.dropdown.position.top : "",
                    left: (self.has(dropdownObject, "position.left")) ? self.ace.config.dropdown.position.left : "",
                    right: (self.has(dropdownObject, "position.right")) ? self.ace.config.dropdown.position.right : "",
                    bottom: (self.has(dropdownObject, "position.bottom")) ? self.ace.config.dropdown.position.bottom : "",
                    height: (self.has(dropdownObject, "height")) ? self.ace.config.dropdown.height : 30,
                    lineHeight: (self.has(dropdownObject, "height")) ? self.ace.config.dropdown.height + "px" : 30 + "px",
                    borderRadius: (self.has(dropdownObject, "borderRadius")) ? self.ace.config.dropdown.borderRadius : 0,
                    boxShadow: (self.has(dropdownObject, "boxShadow")) ? self.ace.config.dropdown.boxShadow : "",
                    width: (self.has(dropdownObject, "width")) ? self.ace.config.dropdown.width : "",
                    backgroundColor: (self.has(dropdownObject, "backgroundColor")) ? self.ace.config.dropdown.backgroundColor : ""
                })

                $($fieldSet.find(".button-dropdown")).css({
                    color: (self.has(dropdownObject, "textColor")) ? self.ace.config.dropdown.textColor : "",
                    fontFamily: (self.has(dropdownObject, "fontFamily")) ? self.ace.config.dropdown.fontFamily : "",
                    fontSize: (self.has(dropdownObject, "fontSize")) ? self.ace.config.dropdown.fontSize : ""
                })

                // Because we cannot get psuedo class , just make inline stylesheet in code.html and write it again if got this config
                if (self.ace.config.dropdown.arrowColor) {
                    $($fieldSet.find("style")).each(function () {
                        var text = $(this).text();
                        text = text.replace(/(?:color\s*:\s*(?:.*))/g, "color :" + self.ace.config.dropdown.arrowColor + " !important");
                        $(this).text(text);
                    });
                }
            } else {
                $($fieldSet.find(".dropdown")).css({
                    display: 'none'
                })
            }

            // Fix Wrong Tooltip offset position for apostrophe modal
            // $($fieldSet.find("#editor")).mousemove(function(event){

            //     y = event.pageY;
            //     x = event.pageX;

            //     ace.require('ace/tooltip').Tooltip.prototype.setPosition = function () {

            //         var _ace = this;

            //          _ace.getElement().style.left = x + (self.ace.config.tooltip.offsetX) ? self.ace.config.tooltip.offsetX : 0 + "px";
            //          _ace.getElement().style.top = y + (self.ace.config.tooltip.offsetY) ? self.ace.config.tooltip.offsetY : 0 + "px";

            //         // To make it default to the parentNode (Ace Editor Container)
            //         // y -= $(this.$parentNode).offset().top;
            //         // x -= $(this.$parentNode).offset().left;
            //     };

            // });

            // if got object
            if (object[name]) {
                editor.session.setValue(object[name].code);
                editor.session.setMode("ace/mode/" + object[name].type.toLowerCase());
                originalValue = editor.getValue();

                // Find modes. When found , set title if available, else set name of the mode. If not found , set to default type object
                for (var i = 0; i < self.ace.modes.length; i++)(function (i) {
                    if (self.ace.modes[i].name.match(/(?!(\/|\\))(?:\w)*$/g)[0] === object[name].type.toLowerCase()) {
                        var getTitle = (self.ace.modes[i].title) ? self.ace.modes[i].title : object[name].type.capitalize();
                        $($fieldSet.find("#buttonDropdown")).text(getTitle);
                        return;
                    } else if (object[name].type.toLowerCase() === self.ace.defaultMode.toLowerCase()) {
                        var getTitle = object[name].type.capitalize();
                        $($fieldSet.find("#buttonDropdown")).text(getTitle);
                        return;
                    }
                })(i);
            }

            // Pass Editor Data Object so that can be use in self.convert
            $fieldSet.data("editor", editor);

            return setImmediate(callback);
        }


        // Clean up data and reject if unacceptable
        self.convert = function (data, name, $field, $el, field, callback) {

            // Locate the element 
            var $fieldSet = apos.schemas.findFieldset($el, name);

            // Get Editor
            var editor = $fieldSet.data('editor');

            var beautify = ace.require("ace/ext/beautify");

            beautify.beautify(editor.session);

            // Set into object serverside
            data[name] = {
                code: editor.getValue(),
                type: editor.session.getMode().$id.match(/(?!(\/|\\))(?:\w)*$/g)[0]
            }

            if (field.required && !(data[name]))
                return setImmediate(_.partial(callback, "required"));

            return setImmediate(callback);

        }

        apos.customCodeEditor = self;
    }
});