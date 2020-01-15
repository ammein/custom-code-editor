apos.define('custom-code-editor', {
    // Extend apostrophe-context to use self.api, self.link and self.html
    extend: 'apostrophe-context',
    afterConstruct: function (self) {
        self.addFieldCodeType();
    },
    construct: function (self, options) {

        self.name = self.__meta.name;

        self.ace = options.ace;

        self.cloneAce = _.cloneDeep(self.ace);

        self.addFieldCodeType = function () {
            apos.schemas.addFieldType({
                name: self.name,
                populate: self.populate,
                convert: self.convert
            })
        }

        self.aceOptionsUI = function (object, type, editor, $fieldSet) {
            var lists = document.createElement("li");
            switch (type) {
                case "slider":
                    (function () {
                        var label = document.createElement("label");
                        var output = document.createElement("span");
                        output.classList.add("range-slider__value");
                        var forLabel = apos.utils.cssName(object.name).replace(/-/g, " ");
                        var category = apos.utils.cssName(object.category).replace(/-/g, " ");

                        label.innerHTML = forLabel + " :";
                        label.setAttribute("for", object.name);
                        var input = document.createElement("input");
                        $(label).css("text-transform", "capitalize");
                        $(input).addClass("range-slider__range");
                        input.name = object.name;
                        input.type = "range";
                        input.max = object.value.max;
                        input.min = object.value.min;
                        input.step = object.value.steps;
                        output.style.display = "none";

                        // Set the value
                        if (object.saveValue !== undefined) {
                            input.value = object.saveValue;
                            editor.setOption(object.name, object.saveValue);
                        } else if (object.saveValue === undefined) {
                            (editor.getOptions()[object.name]) ? input.value = editor.getOptions()[object.name] : input.value = 0;
                        }

                        // Save to cache
                        self.cache = self.cache.concat({ [object.name]: (object.saveValue !== undefined) ? object.saveValue : editor.getOptions()[object.name] })

                        input.addEventListener('input', function () {
                            this.nextElementSibling.style.display = "inline";
                            this.nextElementSibling.innerHTML = this.value;
                        });
                        input.addEventListener("change", function () {
                            input.setAttribute("value", this.value);
                            editor.setOption(object.name, this.value);
                        })

                        lists.id = object.name;
                        $(lists).addClass("lists-inputs");
                        lists.setAttribute("data-category", category);
                        lists.appendChild(label);
                        lists.appendChild(input);
                        lists.appendChild(output);

                        // Help Text
                        if (object.help) {
                            var help = document.createElement("span");
                            help.innerHTML = object.help;
                            help.style.fontSize = "12px";
                            help.style.fontStyle = "italic";
                            help.style.display = "block";
                            lists.appendChild(help);
                        }

                    })()
                    break;
                case "dropdownArray":
                    (function () {
                        var label = document.createElement("label");
                        var forLabel = apos.utils.cssName(object.name).replace("-", " ");
                        var category = apos.utils.cssName(object.category).replace(/-/g, " ");
                        label.innerHTML = forLabel + " :";
                        label.setAttribute("for", object.name);
                        $(label).css("text-transform", "capitalize");
                        var select = document.createElement("select");
                        select.name = object.name;
                        object.value.forEach(function (value, i, arr) {
                            var options = document.createElement("option");
                            options.value = value;
                            options.textContent = value;

                            // Set the value
                            if (object.saveValue === value) {
                                options.selected = true;
                                editor.setOption(object.name, object.saveValue);
                            } else if (object.saveValue === undefined) {
                                (editor.getOptions()[object.name] === value) ? options.selected = true : null;
                            }
                            select.appendChild(options);
                        })

                        // Save to cache
                        self.cache = self.cache.concat({ [object.name]: (object.saveValue !== undefined) ? object.saveValue : editor.getOptions()[object.name] })

                        select.addEventListener("change", function () {
                            editor.setOption(object.name, this.value);
                        })
                        lists.id = object.name;
                        $(lists).addClass("lists-inputs");
                        lists.setAttribute("data-category", category);
                        lists.appendChild(label);
                        lists.appendChild(select);

                        // Help Text
                        if (object.help) {
                            var help = document.createElement("span");
                            help.innerHTML = object.help;
                            help.style.fontSize = "12px";
                            help.style.fontStyle = "italic";
                            help.style.display = "block";
                            lists.appendChild(help);
                        }
                    })();
                    break;
                case "dropdownObject":
                    (function () {
                        var label = document.createElement("label");
                        var forLabel = apos.utils.cssName(object.name).replace("-", " ");
                        var category = apos.utils.cssName(object.category).replace(/-/g, " ");
                        label.innerHTML = forLabel + " :";
                        label.setAttribute("for", object.name);
                        $(label).css("text-transform", "capitalize");
                        var select = document.createElement("select");
                        select.name = object.name;
                        select.value = object.value;
                        object.value.forEach(function (value, i, arr) {
                            var options = document.createElement("option");
                            options.value = value.value;
                            options.textContent = value.title;

                            // Set the value
                            if (object.saveValue === value.value) {
                                options.selected = true;
                                editor.setOption(object.name, object.saveValue)
                            } else if (object.saveValue === undefined) {
                                (editor.getOptions()[object.name] === value.value) ? options.selected = true : null;
                            }

                            select.appendChild(options);
                        });

                        // Save to cache
                        self.cache = self.cache.concat({ [object.name]: (object.saveValue !== undefined) ? object.saveValue : editor.getOptions()[object.name] })

                        select.addEventListener("change", function () {
                            var value = (this.value === "true" || this.value === "false") ? JSON.parse(this.value) : this.value;
                            editor.setOption(object.name, value);
                        })
                        lists.id = object.name;
                        $(lists).addClass("lists-inputs");
                        lists.setAttribute("data-category", category);
                        lists.appendChild(label);
                        lists.appendChild(select);

                        // Help Text
                        if (object.help) {
                            var help = document.createElement("span");
                            help.innerHTML = object.help;
                            help.style.fontSize = "12px";
                            help.style.fontStyle = "italic";
                            help.style.display = "block";
                            lists.appendChild(help);
                        }
                    })();
                    break;
                case "checkbox":
                    (function () {
                        var label = document.createElement("label");
                        var forLabel = apos.utils.cssName(object.name).replace(/-/g, " ");
                        var category = apos.utils.cssName(object.category).replace(/-/g, " ");
                        label.innerHTML = forLabel + " :";
                        label.setAttribute("for", object.name);
                        $(label).css("text-transform", "capitalize");
                        var input = document.createElement("input");
                        input.name = object.name;
                        input.type = "checkbox";

                        // Set the value
                        if (object.saveValue !== undefined) {
                            input.checked = object.saveValue;
                            editor.setOption(object.name, object.saveValue);
                        } else if (object.saveValue === undefined) {
                            editor.getOptions()[object.name] ? input.checked = editor.getOptions()[object.name] : null;
                        }

                        // Save to cache
                        self.cache = self.cache.concat({ [object.name]: (object.saveValue !== undefined) ? object.saveValue : editor.getOptions()[object.name] ? true : false })

                        $(input).addClass("error");
                        input.addEventListener("change", function () {
                            if (this.checked) {
                                editor.setOption(object.name, true);
                            } else {
                                editor.setOption(object.name, false);
                            }
                        })
                        lists.id = object.name;
                        $(lists).addClass("lists-inputs");
                        lists.setAttribute("data-category", category);
                        lists.appendChild(label);
                        lists.appendChild(input);

                        // Help Text
                        if (object.help) {
                            var help = document.createElement("span");
                            help.innerHTML = object.help;
                            help.style.fontSize = "12px";
                            help.style.fontStyle = "italic";
                            help.style.display = "block";
                            lists.appendChild(help);
                        }
                    })();
            }
            return lists;
        }

        self.isArray = function(item){
            if(!item){
                return false;
            }
            // check if got object in it
            for(var i = 0; i < item.length; i++){
                if(item[i].constructor === Object){
                    return false
                }
            }
            return item && typeof item === 'object' && item.constructor === Array;
        }

        self.isObject = function(item){
            if (!item) {
                return false;
            }
            return item && typeof item === 'object' && item.constructor === Object;
        }

        self.isString = function(item){
            if (!item) {
                return false;
            }
            return typeof item === "string" && typeof item.length === "number"
        }

        self.isArrayOfObject = function(item){
            if (!item) {
                return false;
            }

            // check if got object in it
            for (var i = 0; i < item.length; i++) {
                if (item[i].constructor !== Object) {
                    return false
                }
            }

            // Also check if the item is not a string
            return !self.isString(item);
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

            // Customize field options if any. Only allow some override options to be available
            if (self.has(field , "ace")) {
                // Immutable Copies
                self.ace = _.merge({} , {
                    modes: self.ace.modes,
                    theme: self.ace.theme,
                    defaultMode: self.has(field.ace, "defaultMode") ? field.ace.defaultMode.toLowerCase() : self.ace.defaultMode.toLowerCase(),
                    // Let the devs to set undefined on config property if any, else just override it
                    config: _.assign(field.ace.config === undefined ? undefined : {}, self.ace.config, field.ace.config),
                    options: self.ace.options,
                    optionsTypes: self.ace.optionsTypes
                })
            } else {
                // Safely apply clone options from project level module even there is no field options configure
                self.ace = self.cloneAce;
            }

            // Locate the element 
            var $fieldSet = apos.schemas.findFieldset($el, name);

            var originalValue;

            // Init The Element
            var $fieldInput = $fieldSet.find("[data-editor]").get(0);

            var editor = ace.edit($fieldInput);

            // Pass to self object but by schema name prefix (Trigger this if got more than one schema , else pass to editor property)
            if ($el.find(".editor[data-editor]").length > 1) {
                self[name] = {
                    editor: editor
                }
            } else {
                // Pass to self object
                self.editor = editor;
            }

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

                // Save new value when press save command
                editor.commands.addCommand({
                    name: 'saveNewCode',
                    bindKey: {
                        win: (self.has(self.ace, "config.saveCommand.win")) ? self.ace.config.saveCommand.win : 'Ctrl-Shift-S',
                        mac: (self.has(self.ace, "config.saveCommand.mac")) ? self.ace.config.saveCommand.mac : 'Command-Shift-S'
                    },
                    exec: function (editor) {
                        // If Two or more editor in single schema , show field name
                        if ($el.find(".editor[data-editor]").length > 1) {
                            apos.notify((self.has(self.ace, "config.saveCommand.message")) ? self.ace.config.saveCommand.message + " - Field Name : " + name : 'Selected Code Saved Successfully' + " - Field Name : " + name, {
                                type: "success",
                                dismiss: 2
                            });
                        } else {
                            apos.notify((self.has(self.ace, "config.saveCommand.message")) ? self.ace.config.saveCommand.message : 'Selected Code Saved Successfully', {
                                type: "success",
                                dismiss: 2
                            });
                        }

                        originalValue = editor.getSelectedText();
                    },
                    readOnly: false
                });

                // Only Set if got no object. Set to defaultMode
                if (!object[name]) {
                    $($fieldSet.find(".button-dropdown")).text(self.ace.defaultMode.capitalize());
                }

                // Enable Dropdown
                $($fieldSet.find(".dropdown")).css({
                    display: 'block'
                })
                // Dropdown
                $fieldSet.find(".button-dropdown").on("click", function () {
                    $($fieldSet.find(".dropdown-content")).toggleClass("show");
                    $($fieldSet.find(".dropdown-content")).css("top", $($fieldSet.find(".dropdown")).height() + "px");
                })

                // create dropdown modes
                for (var i = 0; i < self.ace.modes.length; i++) {
                    var dropdown = $fieldSet.find(".dropdown-content");
                    var li = document.createElement("li");
                    li.innerHTML =
                        (self.ace.modes[i].title) ? self.ace.modes[i].title : self.ace.modes[i].name.capitalize();
                    $(dropdown).append(li);

                    if (self.ace.modes[i].title) {
                        li.setAttribute("data-name", self.ace.modes[i].name.toLowerCase());
                        li.setAttribute("data-title", self.ace.modes[i].title);
                    } else {
                        li.setAttribute("data-name", self.ace.modes[i].name.toLowerCase());
                    }

                    // Set defaultMode if found defined modes
                    if (self.ace.defaultMode.toLowerCase() === self.ace.modes[i].name.toLowerCase()) {

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

                var allItems = $fieldSet.find(".dropdown-content > li");

                for (var i = 0; i < allItems.length; i++)(function (i) {
                    $(allItems.get(i)).on("click", function () {
                        var getText = $(this).attr("data-name");
                        var getTitle = $(this).attr("data-title");

                        $fieldSet.find(".button-dropdown").text((getTitle) ? getTitle : getText.capitalize());
                        // Set Mode
                        for (var i = 0; i < self.ace.modes.length; i++)(function (i) {
                            if (getText === self.ace.modes[i].name.toLowerCase()) {

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

                $($fieldSet.find(".my-input")).on("keyup", function () {
                    var input, filter, ul, li, a, i;
                    input = $fieldSet.find(".my-input");
                    filter = $(input).val().toUpperCase();
                    div = $fieldSet.find(".dropdown-content");
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

            // OPTIONS CUSTOMIZER BEGINS
            var optionsContainer = $fieldSet.find(".options-container");
            var optionsInner = $fieldSet.find(".options-inner");
            var unorderedLists = document.createElement("ul");
            var buttonOptions = $fieldSet.find(".button-options");
            var moreOptions = $fieldSet.find(".press-more-options");
            var optionsCustomizer = self.has(self.ace.config, "optionsCustomizer") ? self.ace.config.optionsCustomizer.enable : true;

            $(buttonOptions).css("display" , "none");

            // If optionsCustomizer is enabled
            if (optionsCustomizer) {

                $(buttonOptions).css("display", "");

                // Toggle Options Container
                $(buttonOptions).click(function (e) {
                    $(optionsContainer).toggleClass("show");
                })

                $(optionsContainer).on({
                    scroll: function (e) {
                        if ($(moreOptions).find(".more-options").hasClass("show")) {
                            $(moreOptions).find(".more-options").removeClass("show");
                        }
                    },
                    click: function (e) {
                        if (e.target !== moreOptions.get(0) && $(moreOptions).find(".more-options").hasClass("show")) {
                            $(moreOptions).find(".more-options").removeClass("show");
                        }
                    }
                })

                // Toggle More Options
                $(moreOptions).click(function (e) {
                    $(moreOptions).find(".more-options").toggleClass("show");
                })

                // When editor is on focus
                editor.on("focus", function () {
                    // Remove Options Container if options container is on show class
                    if ($(optionsContainer).hasClass("show")) {
                        $(optionsContainer.removeClass("show"));
                    }
                })

                // Make cache for set all default options at initialization
                self.cache = [];

                $.get("/modules/" + self.name + '/options', null, function (result) {
                    if (result.status === "success" && Object.keys(result.message).length > 0) {
                        return loopOptions(JSON.parse(result.message));
                    }
                    // Always return empty object to avoid catastrophe crashed
                    return loopOptions({});
                })

                var originalOptions;

                function loopOptions(myOptions) {
                    // Loop over existing ace options and filter with our options
                    originalOptions = editor.getOptions();
                    for (let key of Object.keys(editor.getOptions())) {
                        if (editor.getOptions().hasOwnProperty(key)) {
                            let editorOptions = editor.getOptions()[key];

                            // Match name of optionsTypes, build the field
                            // But filter on each type of value
                            var optionsTypes = self.ace.optionsTypes;

                            if (optionsTypes[key] && optionsTypes[key].name === key) {
                                switch (true) {
                                    case self.isArray(optionsTypes[key].value):
                                        optionsTypes[key] = myOptions[key] !== undefined ? Object.assign(optionsTypes[key], { saveValue: myOptions[key] }) : optionsTypes[key];

                                        unorderedLists.appendChild(self.aceOptionsUI(optionsTypes[key], "dropdownArray", editor, $fieldSet));
                                        break;
                                    case self.isObject(optionsTypes[key].value):
                                        optionsTypes[key] = myOptions[key] !== undefined ? Object.assign(optionsTypes[key], { saveValue: myOptions[key] }) : optionsTypes[key];

                                        unorderedLists.appendChild(self.aceOptionsUI(optionsTypes[key], "slider", editor, $fieldSet));
                                        break;
                                    case self.isArrayOfObject(optionsTypes[key].value):
                                        optionsTypes[key] = myOptions[key] !== undefined ? Object.assign(optionsTypes[key], { saveValue: myOptions[key] }) : optionsTypes[key];

                                        unorderedLists.appendChild(self.aceOptionsUI(optionsTypes[key], "dropdownObject", editor, $fieldSet));
                                        break;
                                    case optionsTypes[key].type === "boolean":
                                        optionsTypes[key] = myOptions[key] !== undefined ? Object.assign(optionsTypes[key], { saveValue: myOptions[key] }) : optionsTypes[key];

                                        unorderedLists.appendChild(self.aceOptionsUI(optionsTypes[key], "checkbox", editor, $fieldSet));
                                }
                            }
                        }
                    }

                    optionsInner.append(unorderedLists);

                    var title = true;

                    // Add Category
                    var lists = unorderedLists.childElementCount;
                    var inc = 0;
                    for (var i = 0; i < lists; i++) {
                        var h1 = document.createElement("h1");
                        var li = document.createElement("li");
                        $(h1).addClass("category");
                        var category = unorderedLists.children[inc].dataset.category;
                        if (unorderedLists.children[inc - 1] && unorderedLists.children[inc - 1].dataset.category !== category) {
                            title = true;

                            // Last children will put more space before header (Follows UI format)
                            unorderedLists.children[inc - 1].style.marginBottom = "28px";
                        }

                        if (title) {
                            h1.innerHTML = " " + category + " Options";
                            li.setAttribute("data-category", category);
                            li.id = apos.utils.camelName(category);
                            $(li).css("cursor", "pointer");
                            li.appendChild(h1);
                            $(h1).addClass("uncollapse");
                            li.dataset.header = category;
                            unorderedLists.insertBefore(li, unorderedLists.children[inc]);

                            // Increment the number by 1 because we prepend the new DOM to the lists
                            inc++;

                            // Set title to false
                            title = false
                        }

                        // Normal increment
                        inc++;
                    }

                    // Initialize Clipboardjs
                    new ClipboardJS('.copy-options');
                    // copy/reset/save options onclick
                    $fieldSet.find(".copy-options, .undo-options, .save-options, .delete-options").on("click", function () {
                        var button = this;
                        var allCopy = {};
                        optionsInner.find("li:not([data-header])").each(function (i, value) {
                            var key = Object.keys(self.cache[i])[0];
                            var cacheValue = self.cache[i];
                            var input = value.querySelector("[name='" + value.id + "']");


                            // Detect changes by comparing all cache with incoming list arrays.
                            // This will be useful and only executes if it not matches the cache value
                            switch (true) {
                                case (/select/g).test(input.type) && cacheValue[input.name] !== undefined:
                                    if (button.className === "delete-options") {
                                        // Reset the cache first, then run checking
                                        cacheValue[input.name] = originalOptions[input.name];
                                    }

                                    // Transform the value
                                    var value = (input.options[input.selectedIndex].value === "true" || input.options[input.selectedIndex].value === "false") ? JSON.parse(input.options[input.selectedIndex].value) : input.options[input.selectedIndex].value;

                                    if (value !== cacheValue[input.name]) {
                                        if (button.className === "copy-options" || button.className === "save-options") {
                                            allCopy[input.name] = input.options[input.selectedIndex].value;
                                        }
                                        else if (button.className === "undo-options") {
                                            // Revert to default value
                                            input.value = cacheValue[input.name];

                                            // Delete assigned myOptions
                                            delete myOptions[key];

                                            // And reset options on editor
                                            editor.setOption(input.name, cacheValue[input.name]);
                                        }
                                        else if (button.className === "delete-options") {
                                            // Revert to default value based on module options
                                            input.value = originalOptions[input.name];

                                            // And reset options on editor
                                            editor.setOption(input.name, originalOptions[input.name]);
                                        }
                                    }
                                    break;

                                case (/range/g).test(input.type):
                                    if (button.className === "delete-options") {
                                        // Reset the cache first, then run checking
                                        cacheValue[input.name] = originalOptions[input.name];
                                    }

                                    if (
                                        parseFloat(input.value) !== cacheValue[input.name] &&
                                        input.getAttribute("value") !== null
                                    ) {
                                        if (button.className === "copy-options" || button.className === "save-options") {
                                            allCopy[input.name] = parseFloat(input.value);
                                        }
                                        else if (button.className === "undo-options") {
                                            // Revert to default value
                                            input.value = cacheValue[input.name];

                                            // Display none on span value
                                            input.nextElementSibling.style.display = "none";

                                            // Delete assigned myOptions
                                            delete myOptions[key];

                                            // And reset options on editor
                                            editor.setOption(input.name, cacheValue[input.name]);

                                            // Remove the attribute as default
                                            input.removeAttribute("value");
                                        }
                                        else if (button.className === "delete-options") {
                                            // Revert to default value based on module options
                                            input.value = originalOptions[input.name];

                                            // Display none on span value
                                            input.nextElementSibling.style.display = "none";

                                            // And reset options on editor
                                            editor.setOption(input.name, originalOptions[input.name]);

                                            // Remove the attribute as default
                                            input.removeAttribute("value");
                                        }
                                    }
                                    break;

                                case (/checkbox/g).test(input.type):
                                    if (button.className === "delete-options") {
                                        // Reset the cache first, then run checking
                                        cacheValue[input.name] = originalOptions[input.name] === undefined ? false : originalOptions[input.name];
                                    }

                                    if (input.checked !== cacheValue[input.name]) {
                                        if (button.className === "copy-options" || button.className === "save-options") {
                                            allCopy[input.name] = input.checked
                                        } else if (button.className === "undo-options") {
                                            // Revert to default value
                                            input.checked = cacheValue[input.name];

                                            // Delete assigned myOptions
                                            delete myOptions[key];

                                            // And reset options on editor
                                            editor.setOption(input.name, cacheValue[input.name]);
                                        } else if (button.className === "delete-options") {
                                            // Revert to default value based on module options
                                            input.checked = originalOptions[input.name];

                                            // And reset options on editor
                                            editor.setOption(input.name, originalOptions[input.name]);
                                        }
                                    }
                                    break;
                            }
                        })

                        if (button.className === "copy-options") {
                            // Merge allCopy options
                            if (Object.keys(myOptions).length > 0) {
                                allCopy = Object.assign(myOptions, allCopy);

                                // Loop and find if existing default saved options detected matches module options
                                for (let key of Object.keys(originalOptions)) {
                                    if (originalOptions.hasOwnProperty(key)) {

                                        // Only allow non-module options to be copy
                                        if (originalOptions[key] === allCopy[key]) {
                                            delete allCopy[key];
                                        }
                                    }
                                }
                            }

                            // Will use clipboard.js, much more functional to all browsers
                            button.dataset.clipboardText = JSON.stringify(allCopy);

                            // Click again to copy the dataset
                            button.click();
                        } else if (button.className === "save-options") {
                            if (Object.keys(allCopy).length > 0) {
                                self.api('submit', {
                                    [apos.utils.camelName(self.name)]: allCopy
                                }, function (result) {
                                    if (result.status === "success") {
                                        apos.notify("Options successfully Saved", {
                                            type: "success",
                                            dismiss: 2
                                        });
                                    } else {
                                        apos.notify("ERROR : " + result.message, {
                                            type: "error",
                                            dismiss: 2
                                        });
                                    }
                                })
                            } else {
                                apos.notify("ERROR : Save unsuccessful, options empty. Try adjust your desire options than your default settings.", {
                                    type: "error",
                                    dismiss: 10
                                })
                            }
                        } else if (button.className === "delete-options") {
                            $.ajax({
                                url: '/modules/' + self.name + "/remove",
                                type: "DELETE",
                                success: function (result) {
                                    if (result.status === "success") {
                                        // Set myOptions to be empty too
                                        myOptions = {}

                                        // Loop the optionsTypes, if there is `saveValue` assigned to it, delete it
                                        for(let key of Object.keys(self.ace.optionsTypes)){
                                            if(self.ace.optionsTypes.hasOwnProperty(key)){
                                                if(self.ace.optionsTypes[key].saveValue !== undefined){
                                                    delete self.ace.optionsTypes[key].saveValue;
                                                }
                                            }
                                        }

                                        apos.notify("Saved options successfully removed", {
                                            type: "success",
                                            dismiss: 2
                                        });
                                    } else {
                                        apos.notify("ERROR : " + result.message, {
                                            type: "error",
                                            dismiss: 10
                                        });
                                    }
                                }
                            })
                        }
                    })

                    // Toggle Header
                    optionsInner.find("[data-header]").on("click", function () {
                        var header = this;

                        // get all related categories
                        var nextSiblings = $(header).nextUntil(`li:not([data-category="${header.dataset.category}"])`);

                        if ($(header).find("h1").hasClass("uncollapse")) {
                            $(header).find("h1").removeClass("uncollapse");
                            $(header).find("h1").addClass("collapse");
                            $(header).find("h1").css("margin-bottom", 0);
                            nextSiblings.css("display", "none");
                        } else {
                            $(header).find("h1").removeClass("collapse");
                            $(header).find("h1").addClass("uncollapse");
                            $(header).find("h1").css("margin-bottom", "");
                            nextSiblings.css("display", "");
                        }
                    })

                    // Find lists
                    $($fieldSet.find(".my-options")).on("keyup", function () {
                        var input, filter, ul, myLists, i;
                        input = $fieldSet.find(".my-options");
                        filter = $(input).val().toUpperCase();
                        ul = $fieldSet.find(optionsInner).find("ul");
                        header = ul.find("li[data-header]");
                        myLists = ul.find("li");
                        for (i = 0; i < myLists.length; i++)(function (i) {
                            txtValue = $(myLists.get(i)).text();

                            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                $(myLists.get(i)).css("display", "");

                                // Searching for any header that same as category. Remain display
                                $(myLists.get(i)).prevAll(`[data-header="${myLists.get(i).dataset.category}"]`).css("display", "");
                            } else {
                                $(myLists.get(i)).css("display", "none");
                            }
                        }(i));
                    })
                }
            }


            // if got object
            if (object[name]) {
                editor.session.setValue(object[name].code);
                editor.session.setMode("ace/mode/" + object[name].type.toLowerCase());
                originalValue = editor.getValue();

                // Find modes. When found , set title if available, else set name of the mode. If not found , set to default type object
                for (var i = 0; i < self.ace.modes.length; i++)(function (i) {
                    if (self.ace.modes[i].name.toLowerCase() === object[name].type.toLowerCase()) {
                        var getTitle = (self.ace.modes[i].title) ? self.ace.modes[i].title : object[name].type.capitalize();
                        $($fieldSet.find(".button-dropdown")).text(getTitle);
                        return;
                    } else if (object[name].type.toLowerCase() === self.ace.defaultMode.toLowerCase()) {
                        var getTitle = object[name].type.capitalize();
                        $($fieldSet.find(".button-dropdown")).text(getTitle);
                        return;
                    }
                })(i);

                // Set if clearModes and there is no single mode at all
                if (self.ace.modes.length === 0) {
                    $($fieldSet.find(".button-dropdown")).text(object[name].type.capitalize());
                }
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

            if (field.required && data[name])
                return setImmediate(_.partial(callback, "required"));

            return setImmediate(callback);

        }

        apos.customCodeEditor = self;
    }
});