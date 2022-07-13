/* eslint-disable standard/no-callback-literal */
module.exports = function(self, options) {
    self.addFieldCodeType = function () {
        self.apos.schemas.addFieldType({
            name: self.name,
            partial: self.fieldTypePartial,
            converters: {
                code: function (req, data, name, object, field, callback) {

                    if (!data[name]) {
                        if (field.required) {
                            return callback('required');
                        }
                        object[name] = null;
                        return setImmediate(callback);
                    }
                    object[name] = {
                        code: self.apos.launder.string(data[name].code),
                        type: self.apos.launder.string(data[name].type)
                    };
                    return setImmediate(callback);
                },
                form: 'code'
            }
        });
    };

    self.fieldTypePartial = function (data) {
        return self.partial('code', data);
    };
}