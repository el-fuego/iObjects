(function (root, undefined) {
    "use strict";

    /**
     *
     * @param val
     * @returns {IEmail}
     * @constructor
     */
    var IEmail = function (val) {
        var data;

        if (!val) {
            return this;
        }

        if (val instanceof IEmail) {
            this.value = val.value;
            this.name = val.name;
            this.domain = val.domain;
        } else {
            val = String(val).trim().toLowerCase();
            if (this._mask.test(val)) {
                data = val.split('@');
                this.value = val;
                this.name = data[0] || '';
                this.domain = data[1] || '';
            }
        }

        return this;
    };
    IEmail.prototype = {
        value: "",
        name: "",
        domain: "",

        /** @lends IEmail.prototype */
        _mask: (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i),

        /**
         * Проверка правильности адреса
         * @return {*}
         */
        validate: function () {
            return this._mask.test(this.value);
        },

        /**
         *
         * @param value
         * @returns {boolean}
         */
        is: function (value) {
            var obj = new IEmail(value);

            return this.value === obj.value;
        },

        /**
         *
         * @returns {string}
         */
        toString: function () {
            return this.value;
        },

        /**
         *
         * @returns {string}
         */
        toHtml: function () {
            return "<span>" + this.toString() + "</span>";
        }
    };
    root.IEmail = IEmail;
}(this));