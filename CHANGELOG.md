### 3.4.0
- Update README.md (Thanks to @BoDonkey - https://github.com/BoDonkey)
- Update Ace-Builds files that contains more updated modes, snippets & etc.
- Fixed pushAssets scripts that were hilariously error when checking the regex

### 3.3.0
- Update packages to the new ApostropheCMS 2.0 version
- Add YML Tests

### 3.2.0
- Update packages to the new ApostropheCMS 2.0 version
- Tests mocha successful to the new Mocha v10

### 3.1.8
- Add `appearance : none` to checkbox to remove default checkbox CSS
- Fix all codes by removing ES6 codes for minifying ApostropheCMS issue

### 3.1.7
- Fix DOM where warnings occured on same values of id.

### 3.1.6
- Build Passing
- Add Unit Tests

### 3.1.4
- Adjust Readme to use proper configuration

### 3.1.3
- Using _.assign() to assign existing config options
- Make merge options to be able on undefined some property that are will not be use or override.

### 3.1.1
- New feature, specific field customization available to override

### 3.0.2
- Fix README and typos.
- Bug Fixes.

## 3.0.1
- Button Options display issue.

### 3.0.0
- New feature released, Options Customizer. Also change a bit stylish UI for user friendly.

### 2.9.0
- Update CSS to be cursor:pointer for better mouse hover experience

### 2.8.6
- Adjust README for better "first setup" experience to beginners.

### 2.8.0
- Push Asset Feature where push modes & themes that are only defined by User. The rest of the JS files will not be pushed. However , you can push All Ace JS files by configure option in scripts object. Refer the documentation.

### 2.6.7
- Fix every `name` of the modes into lowerCase(). This to avoid errors when developers setting it to capitalize words or any uppercase letters (tested). Also fix `getTitle` where `.capitalize()` helper is removed from that variable.

### 2.6.5
- Fix CSS where code folding can't be seen in your code editor. Now you can press it on gutter area.

### 2.6.0
- **NEW SAVE FEATURE ADDED !** Provide new shortcut key to save your own selection and switch dropdown with your own selection ! . Adjust README to have better documentation to all developers.

- Fix if got empty modes when `clearModes : true` and should return text of `object[name].type`. This will not return empty text on dropdown when you have an existing value in schema.

### 2.5.0

- Fix default mode name should be show in dropdown if got `object[name]`. This will not be return empty text on dropdown.

### 2.3.0

- Adjust README and FIXED on existing dropdown `title` bug that would not update if open the schema again