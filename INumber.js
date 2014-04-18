(function (root, undefined) {
    var floatKey = "float",
        intKey = "int",
        fractionKey = "fraction",

        /**
         * @author Knyazevich Denis, Pulyaev Yuriy
         * Number Parser|normalizator
         * need:    log.js
         * use:        a = new INumber('1.02')
         * a.toString()
         * @param val
         * @param fractionPointer
         * @return {*}
         */
        INumber = function (val, fractionPointer) {
            var arr,
                factor,
                isNegative;

            if (val instanceof INumber) {
                this[floatKey] = val[floatKey];
                this[intKey] = val[intKey];
                this[fractionKey] = val[fractionKey];
                this._isDefault = false;

                return this;
            }

            if (val == null || val === "") {
                this._setDefaultData();
            } else if (typeof val === 'number') {

                this._setAttributesByFloat(val);

            } else if (typeof val === 'string' && val.replace(/[^0-9,. ]/g, '').length > 0) {
                /**
                 * replace &nbsp; &#160; ect. and whitespaces
                 * @type {*}
                 */
                val = val.replace(/(&(#[0-9]{3,4}|[a-z]+);)|\s+/gi, '');

                /**
                 * use pointer from params if getted
                 */
                if (typeof fractionPointer === 'string') {

                    arr = val.split(fractionPointer);

                    /**
                     * default pointer
                     */
                } else {

                    /**
                     * 1 234.56
                     * 1,234.56
                     * @type {*}
                     */
                    arr = val.split('.');

                    /**
                     * @description 1 234,56 (arr.length != 2 - invalid, because arr.length > 2 - invalid parameter "val")
                     */
                    if (arr.length === 1) {
                        arr = val.split(',');
                    }
                }

                // invalid "val"
                if (arr.length > 2) {
                    return this;
                }

                /**
                 * without fraction
                 */
                if (!arr || arr.length !== 2) {
                    arr = [val, '0'];
                }

                /**
                 * replace not digits && two "-" :)
                 * @type {String|XML}
                 */
                arr[0] = arr[0].replace(/[,\. ]/g, '').replace(/\-\-/g, '-');
                arr[1] = arr[1].replace(/[,\. ]/g, '');

                /**
                 * check for errors
                 */
                if (!(/^-?[0-9]+$/).test(arr[0]) || !(/^[0-9]+$/).test(arr[1])) {
                    return this;
                }

                /**
                 * 0.2 = 0.20
                 */
                if (arr[1].length === 1) {
                    arr[1] = arr[1] + '0';
                }

                isNegative = arr[0].indexOf('-') >= 0;

                arr[0] = arr[0].replace(/\-/g, '');

                factor = Math.pow(10, arr[1].length || 2);

                /**
                 * Установка значений.
                 * Делаем дополнительное округление для исправления бага 5.56 -> 5.5600000000000005
                 */
                this._setAttributesByFloat(
                    (isNegative ? -1 : 1) * (
                        Math.round((+arr[0] + (arr[1] / factor)) * factor) / factor
                    )
                );
            }

            return this;
        };

    INumber.prototype = {

        /**
         * attributes for info
         */
        "float": null,
        "int": null,
        fraction: null,
        fractionPointer: '.',
        thousandPointer: ' ',
        htmlTag: 'small',
        _isDefault: true,

        /**
         * @description set default data. For example, where input value is invalid
         * @private
         */
        _setDefaultData: function () {
            this._setAttributesByFloat(0);
            this._isDefault = true;
        },

        /**
         * set float, int, fraction by float value
         * @param num
         * @private
         */
        _setAttributesByFloat: function (num) {
            this[floatKey] = num || 0;
            this[intKey] = parseInt(num, 10) || 0;
            this[fractionKey] = Math.abs(Math.round((this[floatKey] - this[intKey]) * 100)) || 0;
            this._isDefault = false;

            return this;
        },

        /**
         * String like '00023'
         * @param num
         * @param length
         * @return {*}
         * @private
         */
        _addZeros: function (num, length) {

            var ret = num.toString();

            while (ret.length < length) {
                ret = '0' + ret;
            }

            return ret;
        },

        /**
         * Get full number string
         * @param fractionPointer : null || '.'
         * @param thousandPointer : null || ' '
         * @param shortFormat : null || true || false
         * @param toFixed : if true, return 1 522 from 1522.00
         * @param toABS : false return 1.00 from -1.00
         * @return {String}
         */
        toString: function (fractionPointer, thousandPointer, shortFormat, toFixed, toABS) {
            var fractionStr,
                intStr,
                /**
                 * insert to array every 3 digits
                 * @type {Array}
                 */
                intArr = [];

            toFixed = (isNaN(toFixed) || toFixed <= 2) ? 2 : toFixed;

            /**
             * set default pointers
             */
            if (typeof fractionPointer !== 'string') {
                fractionPointer = this.fractionPointer;
            }

            if (typeof thousandPointer !== 'string') {
                thousandPointer = this.thousandPointer;
            }

            if (typeof shortFormat !== 'boolean') {
                shortFormat = false;
            }

            /**
             * add zeros to fraction
             * @type {*|String}
             */
            fractionStr = (toFixed > 2) ? (this[floatKey] || 0).toFixed(toFixed).toString().split('.')[1] || '0' : (this[fractionKey] || 0).toString();

            while (fractionStr.length < 2) {
                fractionStr = '0' + fractionStr;
            }

            /**
             * add pointer to thousands
             * @type {String}
             */
            intStr = Math.abs(this[intKey] || 0).toString();

            while (intStr.length > 0) {

                if (intStr.length > 3) {

                    intArr.unshift(intStr.substring(intStr.length - 3, intStr.length));

                    intStr = intStr.substring(0, intStr.length - 3);

                } else {

                    intArr.unshift(intStr.substring(0, intStr.length));
                    intStr = '';
                }
            }

            return ((this.isNegative() && !toABS) ? '- ' : '') + intArr.join(thousandPointer) + (shortFormat && !this[fractionKey] ? '' : fractionPointer + fractionStr);
        },


        /**
         * Get full number string with <htmlTag> in fraction
         * @param fractionPointer : null || '.'
         * @param thousandPointer : null || ' '
         * @param htmlTag : null || 'tagName'
         * @param shortFormat : null || true || false
         * @param toFixed return 1 522 from 1522.00
         * @param toABS return 1.00 from -1.00
         * @return {String}
         */
        toHtml: function (fractionPointer, thousandPointer, htmlTag, shortFormat, toFixed, toABS) {
            var arr;

            /**
             * set default pointers
             */
            if (typeof fractionPointer !== 'string') {
                fractionPointer = this.fractionPointer;
            }

            if (typeof thousandPointer !== 'string') {
                thousandPointer = this.thousandPointer;
            }

            if (typeof htmlTag !== 'string') {
                htmlTag = this.htmlTag;
            }

            if (typeof shortFormat !== 'boolean') {
                shortFormat = false;
            }

            /**
             * split to [amount, fraction]
             * @type {Array}
             */
            arr = this.toString(fractionPointer, thousandPointer, shortFormat, toFixed, toABS).replace(/ /g, '&nbsp;').split(fractionPointer);

            /**
             * add tag to fraction
             * @type {String}
             */
            if (arr[1]) {
            arr[1] = '<' + htmlTag + '>' + arr[1] + '</' + htmlTag + '>';
            }

            return arr.join(fractionPointer);
        },

        /**
         * Get Float
         * @return {number}
         */
        toFloat: function () {
            return (this[floatKey] || 0);
        },

        /**
         *
         * @returns {number}
         */
        toNumber: function () {
            return this.toFloat();
        },

        /**
         *
         * @returns {number}
         */
        toInteger: function () {
            return (this[intKey] || 0);
        },

        /**
         *
         * @returns {boolean}
         */
        isNull: function () {
            return (this[floatKey] === 0 || this[floatKey] === null);
        },

        /**
         *
         * @returns {boolean}
         */
        isNegative: function () {
            return this.toFloat() < 0;
        },

        /**
         *
         * @returns {INumber}
         */
        getAbs: function () {
            return new INumber(Math.abs(this.toFloat()));
        },

        /**
         *
         * @returns {INumber}
         */
        getInverted: function () {
            return new INumber(-1 * this.toFloat());
        },

        /**
         * Check data
         * @return {Boolean}
         */
        validate: function () {
            return this[floatKey] !== null;
        },

        /**
         *
         * @param digits
         */
        toFixed: function (digits) {
            digits = +(digits || 2);

            var factor = Math.pow(10, digits);

            return Math.round(this[floatKey] * factor) / factor;
        },

        /**
         * Inner value is null
         * @returns {boolean}
         */
        isDefault: function () {
            return !!this._isDefault && this[floatKey] !== null;
        },

        /**
         *
         * @param value
         * @returns {boolean}
         */
        is: function (value) {
            var obj = new INumber(value);

            return this.toFloat() == obj.toFloat();
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = INumber;
    } else {
        root.INumber = INumber;
    }
}(this));