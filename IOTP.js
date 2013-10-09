(function (root) {
    "use strict";

    /**
     *
     * @param otpCode {string|number}
     */
    var IOTP = function (otpCode) {
        if (otpCode instanceof IOTP) {
            this.value = otpCode.value;
        } else {
            /**
             * Убираем пробелы и разделитель "-"
             * @type {string}
             */
            this.value = String(otpCode).replace(/\s+/g, '').replace(/-+/g, '');
        }

        if (!this.validate()) {
            this.value = "";
        }
    };

    IOTP.prototype = {
        value: "",

        /**
         *
         * @returns {boolean}
         */
        validate: function () {
            return (/^[0-9]{8}$/).test(this.value);
        },

        /**
         *
         * @returns {string}
         */
        toString: function (options) {
            options = options || {};

            var code = this.value || "",
                i,
                len = code.length,
                result = code,
                separator = options.separator || "-",
                separatedPartLength = options.separatedPartLength || 2;

            if (options.isNeedSeparated) {
                for (i = 0; i < len; i = i + separatedPartLength) {
                    result += code.substring(i, separatedPartLength) + separator;
                }

                if (len % separatedPartLength != 0) {
                    result += code.substring(len - (len % separatedPartLength), len);
                }
            }

            return result;
        },

        /**
         *
         * @param value
         * @returns {boolean}
         */
        is: function (value) {
            var obj = new IOTP(value);

            return this.value === obj.value;
        },

        /**
         *
         * @returns {string}
         */
        toHtml: function () {
            return "<span>" + this.toString() + "</span>";
        }
    };

    root.IOTP = IOTP;
}(this));