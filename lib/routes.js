const _ = require("lodash");
module.exports = function(self,options){
    self.submit = function (req, callback) {
        return self.apos.users.find(req, { _id: req.user._id }).toObject(function (err, pieces) {
            if (err) {
                return callback(err);
            }

            var clonePieces = _.cloneDeep(pieces);
            if (clonePieces[self.options.alias]) {
                clonePieces[self.options.alias] = Object.assign(clonePieces[self.options.alias], req.body[self.options.alias]);
            } else {
                clonePieces[self.options.alias] = req.body[self.options.alias];
            }

            return self.apos.modules["apostrophe-users"].update(req, clonePieces, callback);
        })
    }

    self.getOptions = function (req, callback) {
        return self.apos.users.find(req, { _id: req.user._id }).toObject(function (err, pieces) {
            if (err) {
                return callback(err);
            }

            if (pieces[self.options.alias]) {
                return callback(null, pieces[self.options.alias]);
            }

            return callback(null, {});
        })
    }

    self.removeOptions = function (req, callback) {
        return self.apos.users.find(req, { _id: req.user._id }).toObject(function (err, pieces) {
            if (err) {
                return callback(err);
            }

            if (pieces[self.options.alias]) {
                var clonePieces = _.cloneDeep(pieces);

                delete clonePieces[self.options.alias];

                return self.apos.modules["apostrophe-users"].update(req, clonePieces, callback);
            }

            return callback(null)
        })
    }

    self.route('post', 'submit', function (req, res) {
        self.submit(req, function (err) {
            if (err) {
                res.send({
                    status: "error",
                    message: err
                })
            }
            res.send({
                status: "success",
                message: "Custom Code Editor User Options Saved"
            })
        })
    })

    self.route('get', 'options', function (req, res) {
        self.getOptions(req, function (err, result) {
            if (err) {
                res.send({
                    status: "error",
                    message: err
                })
            }

            res.send({
                status: "success",
                message: JSON.stringify(result)
            })
        })
    })

    self.route('delete', 'remove', function (req, res) {
        self.removeOptions(req, function (err, result) {
            if (err) {
                res.send({
                    status: "error",
                    message: err
                })
            }

            res.send({
                status: "success",
                message: "Successfully removed all saved options"
            })
        })
    })
}