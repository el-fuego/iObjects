(function (root, undefined) {
    "use strict";

    /**
     * @author Knyazevich Denis, Pulyaev Yuriy
     * @description Accounts Parser, use:a = new IAccount('1234 12 34 12341234')
     * @constructor
     * @param value
     * @return {*}
     */
    var IAccount = function (value) {
        if (!value) {
            return this;
        }

        /**
         * param is IAccount
         */
        if (typeof value === 'object' && value instanceof IAccount) {
            this.value = value.value;
        } else {
            /**
             * param is number
             */
            if (typeof value === 'number') {

                this.value = value.toString();
            } else if (typeof value === 'string') {
                /**
                 * for view number-account
                 * @type {Array}
                 */
                var arr = value.split('-');
                value = arr[0];

                this.value = value.replace(/[^0-9]+/g, '') || this.value;
                this.account = (arr[1] || '').replace(/[^0-9]+/g, '') || this.account;
            }
        }

        this.account = this.account || this.value;

        return this;
    };

    IAccount.prototype = {
        value: null,
        account: null,
        countBeforeSplitter: 4,
        minLength: 12,
        splitter: '<span>',

        /**
         * add ' ' every [num] digits
         * @param str
         * @param splitter
         * @return {String}
         * @private
         */
        _addSplitter: function (str, splitter) {

            splitter = splitter || this.splitter;

            /**
             * local copy
             * @type {*}
             */
            var arr = [];

            while (str.length) {
                if (str.length > this.countBeforeSplitter) {
                    arr.push(str.substring(0, this.countBeforeSplitter));
                    str = str.substring(this.countBeforeSplitter);
                } else {
                    arr.push(str.substring(0, str.length));
                    str = '';
                }
            }

            /**
             * splitter is tag?
             */
            if ((/^<[^>]+>$/).test(splitter)) {

                var openedTag = splitter;
                var closedTag = splitter.replace(/^<([^>]+)>$/, '</$1>');

                return openedTag + arr.join(closedTag + openedTag) + closedTag;
            }

            return arr.join(splitter);
        },

        formatters: {

            /**
             * For example, XXXX XXXX XXXX XXXX
             * @param intStr
             * @param splitter
             * @return {String}
             */
            full: function (intStr, splitter) {

                return this._addSplitter(intStr, splitter);
            },

            /**
             * For example, XXXX **** **** XXXX
             * @param intStr
             * @param splitter
             * @return {String}
             */
            hidden: function (intStr, splitter) {

                // too short number
                if (intStr.length <= this.countBeforeSplitter * 2) {
                    return this.formatters.full.apply(this, arguments);
                }

                var hidden = '';
                var i = intStr.length - this.countBeforeSplitter * 2;
                while (i--) {
                    hidden += '*';
                }

                return this._addSplitter(
                    intStr.substring(0, this.countBeforeSplitter) +
                        hidden +
                        intStr.substring(intStr.length - this.countBeforeSplitter, intStr.length),
                    splitter
                );
            },

            /**
             * For example, ** XXXX
             * @param intStr
             * @return {String}
             */
            "short": function (intStr) {
                return '**' + intStr.substring(intStr.length - this.countBeforeSplitter, intStr.length);
            }
        },

        /**
         * @description Get string like '1234123412341234'
         * @param format {"full"|"short"}
         * @return {null|String}
         */
        toString: function (format) {
            var str;

            str = this.value || "";

            if (format === "full" && this.account) {
                str += "-" + this.account;
            }

            return str;
        },

        /**
         *
         */
        toNumber: function () {
            if (this.value.length > 16) {
                return 0;
            }

            return parseInt(this.value, 10);
        },

        /**
         * Get string like     '1234 1234 1234 1234'
         * or (by default)    '<span>1234</span><span class="hidden">1234</span><span class="hidden">1234</span><span>1234</span>'
         * format =    null || "full" || "hidden" || "short"
         * splitter =  null || " " || "<span>"
         * @param format
         * @param splitter
         * @return {String}
         */
        toHtml: function (format, splitter) {

            if (!this.value) {
                return '';
            }

            /**
             * default format
             */
            if (!format) {
                format = 'full';
            }

            /**
             * check format
             */
            if (typeof format !== 'string') {
                return '';
            }

            if (typeof this.formatters[format] !== 'function') {
                return '';
            }

            return this.formatters[format].call(this, this.value, splitter || this.splitter);
        },

        /**
         * @description Check on Luhn algorithm
         * @return {Boolean}
         */
        isCard: function () {
            return this._luhnValidate(this.value);
        },

        /**
         * check card's type on Visa
         * @return {Boolean}
         */
        isVisa: function () {
            return (this.value && [5, 6].indexOf(+this.value.substr(0, 1)) >= 0);
        },

        /**
         * check card's type on MasterCard
         * @return {Boolean}
         */
        isMasterCard: function () {
            return (this.value && +this.value.substr(0, 1) != 4);
        },

        /**
         * check digits count
         * @return {Boolean}
         */
        isAccount: function () {

            /**
             * check digits count
             */
            return ([9, 10, 12, 14, 16, 19].indexOf(this.value.length) >= 0);
        },

        /**
         * Check account
         * @return {Boolean}
         */
        validate: function () {

            if (!this.value) {
                return false;
            }

            /**
             * If this is not a card and not Visa or Mastercard, detected as account
             */
            if (!this.isCard() && ((this.isVisa() || this.isMasterCard()) && this.isAccount())) {
                return false;
            }

            return true;
        },

        /**
         * Javascript code copyright 2009 by Fiach Reid : www.webtropy.com
         */
        _luhnCalculate: function (str) {
            var sum = 0,
                i,
                mod,
                delta = [0, 1, 2, 3, 4, -4, -3, -2, -1, 0];

            for (i = 0; i < str.length; i++) {
                sum += parseInt(str.substring(i, i + 1), 10);
            }

            for (i = str.length - 1; i >= 0; i -= 2) {
                var deltaIndex = parseInt(str.substring(i, i + 1), 10);
                sum += delta[deltaIndex];
            }

            mod = sum % 10;
            mod = 10 - mod;

            if (mod == 10) {
                mod = 0;
            }

            return mod;
        },

        /**
         *
         * @param number
         * @returns {boolean}
         * @private
         */
        _luhnValidate: function (number) {
            var digit = parseInt(number.substring(number.length - 1, number.length), 10),
                less = number.substring(0, number.length - 1);

            return (this._luhnCalculate(less) == parseInt(digit, 10));
        },

        /**
         * Compare accounts. True if equal
         * @param value
         * @return {Boolean}
         */
        is: function (value) {
            var obj = new IAccount(value);

            return (
                obj.value && (
                    obj.value === this.value
                ) && (
                    !obj.account || !this.account || obj.account === this.account
                )
            );
        }
    };

    /**
     * Check account
     * @return {Boolean}
     */
    IAccount.prototype.toBoolean = function () {
        return this.validate();
    };

    root.isAccount = IAccount;
}(this));