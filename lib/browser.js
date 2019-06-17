const _ = require("lodash");
module.exports = function(self, options){
      self.pushCreateSingleton = function () {

          var options = {};

          _.defaults(options, {
              browser: {}
          });

          _.extend(options.browser, {
              name: self.name,
              action: self.action,
              ace : self.ace,
              aceOptionsTypes : options.aceOptionsTypes
          });

          self.apos.push.browserMirrorCall('user', self);

          self.apos.push.browserCall('user', 'apos.create(?, ?)', self.__meta.name, options.browser);
      };
}