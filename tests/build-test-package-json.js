const fs = require('fs');
const info = JSON.parse(fs.readFileSync('package.json'));

// For Apostrophe version more than 2.96.2, we need to generate package.json inside `/tests/` folder
// so that the test modules can be imported in current `/tests/` folder. 
// We must also include `custom-code-editor` dependencies as well as it will
// automatically install my current npm package folder into node_modules inside `/tests/` folder.
info.dependencies = info.dependencies || {};
info.dependencies.apostrophe = info.devDependencies.apostrophe;
info.dependencies[info.name] = info.version;
fs.writeFileSync('./tests/package.json', JSON.stringify({
  "//": "Automatically generated to satisfy moog-require, do not edit",
  dependencies: info.dependencies || {},
  devDependencies: info.devDependencies || {}
}, null, '  '));