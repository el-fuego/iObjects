(function (root, undefined) {
    "use strict";

    /**
     *
     * @param cvvCode {string|number}
     */
    var ICVV = function (cvvCode) {
        if (cvvCode instanceof ICVV) {
            this.value = cvvCode.value;
        } else {
            this.value = String(cvvCode).replace(/\s+/g, '');
        }

        if (!this.validate()) {
            this.value = "";
        }
    };

    ICVV.prototype = {
        /**
         *
         * @returns {boolean}
         */
        validate: function () {
            return (/^[0-9]{3,4}$/).test(this.value);
        },

        /**
         *
         * @returns {string}
         */
        toString: function () {
            return this.value || "";
        },

        /**
         *
         * @param value
         * @returns {boolean}
         */
        is: function (value) {
            var obj = new ICVV(value);

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

    root.ICVV = ICVV;
}(this));