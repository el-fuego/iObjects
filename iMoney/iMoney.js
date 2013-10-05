(function (window) {
    "use strict";

    /**
     * @author Knyazevich Denis, Pulyaev Yuriy
     * Money Parser|normalizator
     * need:    log.js
     * use:        a = new iMoney('1.02')
     * a.toString()
     * @param val
     * @param kopeksPointer
     * @return {*}
     */
    iMoney = function (val, kopeksPointer) {

        /**
         * set defaults
         * @type {null}
         */
        this['float'] = this['int'] = this['kopeks'] = null;

        /**
         * param is undefined
         */
        if (typeof val === 'undefined' || val === null || val === "") {

            this['float'] = this['int'] = this['kopeks'] = 0;

        } else if (typeof val === 'object' && val instanceof iMoney) {

            this['float'] = val['float'];
            this['int'] = val['int'];
            this['kopeks'] = val['kopeks'];
            return this;

        }

        if (typeof val === 'number') {

            this._setAttributesByFloat(val);

        } else if (typeof val === 'string' && val.replace(/[^0-9,. ]/g, '').length > 0) {

            var arr = null;

            /**
             * replace &nbsp; &#160; ect. and whitespaces
             * @type {*}
             */
            val = val.replace(/(&(#[0-9]{3,4}|[a-z]+);)|\s+/gi, '');


            /**
             * use pointer from params if getted
             */
            if (typeof kopeksPointer === 'string') {

                arr = val.split(kopeksPointer);

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
                 * 1 234,56
                 */
                if (!arr || arr.length !== 2) {
                    arr = val.split(',');
                }
            }

            /**
             * without kopeks
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

            var isNegative = arr[0].indexOf('-') >= 0;

            arr[0] = arr[0].replace(/\-/g, '');

            var factor = Math.pow(10, arr[1].length || 2);

            /**
             * Установка значений.
             * Делаем дополнительное округление для исправления бага 5.56 -> 5.5600000000000005
             */
            this._setAttributesByFloat((isNegative ? -1 : 1) * (
                Math.round((+arr[0] + (arr[1] / factor)) * factor) / factor
            ));
        }
    };

    iMoney.prototype = {

        /**
         * attributes for info
         */
        "float":         null,
        "int":           null,
        kopeks:          null,
        kopeksPointer:   '.',
        thousandPointer: ' ',
        htmlTag:         'small',


        /**
         * set float, int, kopeks by float value
         * @param num
         * @private
         */
        _setAttributesByFloat: function (num) {

            this['float'] = num || 0;
            this['int'] = parseInt(num) || 0;
            this['kopeks'] = Math.abs(Math.round(( this['float'] - this['int'] ) * 100)) || 0;

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
         * Get full money string
         * @param kopeksPointer : null || '.'
         * @param thousandPointer : null || ' '
         * @param shortFormat : null || true || false
         * @param toFixed : if true, return 1 522 from 1522.00
         * @param toABS : false return 1.00 from -1.00
         * @return {String}
         */
        toString: function (kopeksPointer, thousandPointer, shortFormat, toFixed, toABS) {
            toFixed = (isNaN(toFixed) || toFixed <= 2) ? 2 : toFixed;

            /**
             * set default pointers
             */
            if (typeof kopeksPointer !== 'string') {
                kopeksPointer = this.kopeksPointer;
            }

            if (typeof thousandPointer !== 'string') {
                thousandPointer = this.thousandPointer;
            }

            if (typeof shortFormat !== 'boolean') {
                shortFormat = false;
            }

            /**
             * add zeros to kopeks
             * @type {*|String}
             */
            var kopeksStr = (toFixed > 2) ? (this['float'] || 0).toFixed(toFixed).toString().split('.')[1] || '0' : (this['kopeks'] || 0).toString();

            while (kopeksStr.length < 2) {
                kopeksStr = '0' + kopeksStr;
            }

            /**
             * add pointer to thousands
             * @type {String}
             */
            var intStr = Math.abs(this['int'] || 0).toString();

            /**
             * insert to array every 3 digits
             * @type {Array}
             */
            var intArr = [];
            while (intStr.length > 0) {

                if (intStr.length > 3) {

                    intArr.unshift(intStr.substring(intStr.length - 3, intStr.length));

                    intStr = intStr.substring(0, intStr.length - 3);

                } else {

                    intArr.unshift(intStr.substring(0, intStr.length));
                    intStr = '';
                }
            }

            return ((this.isNegative() && !toABS) ? '- ' : '') + intArr.join(thousandPointer) + (shortFormat && !this['kopeks'] ? '' : kopeksPointer + kopeksStr);
        },


        /**
         * Get full money string with <htmlTag> in kopeks
         * @param kopeksPointer : null || '.'
         * @param thousandPointer : null || ' '
         * @param htmlTag : null || 'tagName'
         * @param shortFormat : null || true || false
         * @param toFixed : true: return 1 522 from 1522.00
         * @param toABS : false return 1.00 from -1.00
         * @return {String}
         */
        toHtml: function (kopeksPointer, thousandPointer, htmlTag, shortFormat, toFixed, toABS) {

            /**
             * set default pointers
             */
            if (typeof kopeksPointer !== 'string') {
                kopeksPointer = this.kopeksPointer;
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
             * split to [amount, kopeks]
             * @type {Array}
             */
            var arr = this.toString(kopeksPointer, thousandPointer, shortFormat, toFixed, toABS).replace(/ /g, '&nbsp;').split(kopeksPointer);

            /**
             * add tag to kopeks
             * @type {String}
             */
            arr[1] = '<' + htmlTag + '>' + arr[1] + '</' + htmlTag + '>';

            return arr.join(kopeksPointer);
        },

        /**
         * Get Float, Integer, Number
         * @return {null|int}
         */
        toFloat:   function () {
            return (this['float'] || 0);
        },
        toNumber:  function () {
            return (this['float'] || 0);
        },
        toInteger: function () {
            return (this['int'] || 0);
        },
        toInt:     function () {
            return (this['int'] || 0);
        },

        isNull: function () {
            return  (this['float'] == 0 || this['float'] == null);
        },

        isNegative: function () {
            return  this.toFloat() < 0;
        },

        getAbs: function () {
            return new iMoney(Math.abs(this.toFloat()));
        },

        getInverted: function () {
            return new iMoney(-1 * this.toFloat());
        },

        /**
         * Check data
         * @return {Boolean}
         */
        validate: function () {
            return this['float'] !== null;
        },

        /**
         *
         * @param digits
         */
        toFixed: function (digits) {
            digits = +(digits || 0);

            var factor = Math.pow(10, digits);

            return Math.round(this['float'] * factor) / factor;
        }
    };

    window.iMoney = iMoney;
}(window));