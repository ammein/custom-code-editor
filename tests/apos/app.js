var path = require('path');

var apos = require('apostrophe')({
  shortName: 'apostrophe-test',
  baseUrl: "http://localhost:3000",
  root: module,

  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {

    // Apostrophe module configuration

    // Note: most configuration occurs in the respective
    // modules' directories. See lib/apostrophe-assets/index.js for an example.
    
    // However any modules that are not present by default in Apostrophe must at
    // least have a minimal configuration here: `moduleName: {}`

    // If a template is not found somewhere else, serve it from the top-level
    // `views/` folder of the project
    'custom-code-editor' : {
      ace : {
        theme : "monokai",
        config: {
          // editorHeight: 500, // Editor Height (Number or String)
          saveCommand: {
            message: 'You save the code'
          },
          dropdown: {
            enable: true, // Enable it for switching modes button (Boolean)
            height: 30, // Height Dropdown (Number or String)
            borderRadius: 5, // Border Radius Dropdown (Number or String)
            fontFamily: "Mont-Regular", // Font Family Dropdown (String)
            fontSize: 16, // Font Size Dropdown (Number or String)
            position: {
              // All top , left , right , bottom dropdown position enable for configs
              bottom: 20,
              right: 20
            },
            arrowColor: "blue" // To change arrow color in dropdown (String)
          }
        }
      }
    },

    'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') }

  }
});

module.exports = apos