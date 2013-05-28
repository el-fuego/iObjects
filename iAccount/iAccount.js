/**
 * @author Knyazevich Denis, Pulyaev Yuriy
 * Accounts Parser|normalizator
 * need:    log.js
 * objects:    iCard
 * use:        a = new iAccount('1234 12 34 12341234')
 * @constructor
 * @param val
 * @return {*}
 */
iAccount = function (val) {
    /**
     * set default
     * @type {null}
     */
    this.val = null;
    /**
     * @type {null}
     */
    this.account = null;


    //===================================
    // param is undefined
    if (!val) {
        return;
    }

    /**
     * param is iAccount
     */
    if (typeof val === 'object' && val instanceof iAccount) {

        this.val = val.val;
    } else {
        /**
         * param is number
         */
        if (typeof val === 'number') {

            this.val = val.toString();
        } else if (typeof val === 'string') {
            var arr = val.split('-'); // для вида number-account
            val = arr[0];

            this.val = val.replace(/[^0-9]+/g, '') || null;

            // TODO: remove. Used at XSLT JS
            this.account = (arr[1] || '').replace(/[^0-9]+/g, '') || this.val;

        }
    }


    if (this.account === null) {
        this.account = this.val;
    }

    /**
     * check data
     */
    if (this.validate()) {
        return this;
    }

};

iAccount.prototype = {

    'val':               null,
    countBeforeSplitter: 4,
    minLength:           12,
    splitter:            '<span>',

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
         * @param splitter
         * @return {String}
         */
        "short": function (intStr, splitter) {

            return '**' + intStr.substring(intStr.length - this.countBeforeSplitter, intStr.length);
        }
    },

    /**
     * Get string like '1234123412341234' a.toString('full' || 'hidden' || 'short')
     * @return {null|String}
     */
    toString: function () {
        return this.val || '';
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

        if (!this.val) {
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

        return this.formatters[format].call(this, this.val, splitter || this.splitter);
    },

    /**
     * check digits count and first digit
     * @return {Boolean}
     */
    isCard: function () {
        var len = this.val.length;

        /**
         * check digits count
         * check first digit
         */
        return (
            ([13, 14, 18, 19].indexOf(len) >= 0 && (
                [3, 4, 5, 6, 7].indexOf(+this.val[0]) >= 0 || (/^2222227/).test(this.val)
            )) || (len == 16 && !(/^22222/).test(this.val))
        );
    },

    /**
     * check card's type on Visa
     * @return {Boolean}
     */
    isVisa: function () {
        return (this.val && [5, 6].indexOf(+this.val.substr(0, 1)) >= 0);
    },

    /**
     * check card's type on MasterCard
     * @return {Boolean}
     */
    isMasterCard: function () {
        return (this.val && +this.val.substr(0, 1) != 4);
    },

    /**
     * check digits count
     * @return {Boolean}
     */
    isAccount: function () {

        /**
         * check digits count
         */
        return ([9, 10, 12, 14, 16, 19].indexOf(this.val.length) >= 0);
    },

    /**
     * Check account
     * @return {Boolean}
     */
    validate: function () {

        if (!this.val) {
            return false;
        }

        /**
         * Check type
         */
        var isCard = this.isCard();
        if (!isCard && !this.isAccount()) {
            return false;
        }

        /**
         * Visa/MC card validation (Luhn Algorithm)
         */
        if (isCard) {
            /*
             var sum = 0;
             var i;
             for (i = 0; i < this.val.length; i++) {

             var p = window.parseInt(this.val[i]);
             if (i % 2 == 0) {
             p *= 2;
             if (p > 9) {
             p -= 9;
             }
             }

             sum += p;
             }

             return sum % 10 == 0;*/

            return this._luhnValidate(this.val);
        }

        return true;

    },

    /**
     * Javascript code copyright 2009 by Fiach Reid : www.webtropy.com
     */
    _luhnCalculate: function (str) {
        var sum = 0;
        var i;
        var delta = [0, 1, 2, 3, 4, -4, -3, -2, -1, 0];

        for (i = 0; i < str.length; i++) {
            sum += window.parseInt(str.substring(i, i + 1));
        }
        for (i = str.length - 1; i >= 0; i -= 2) {
            var deltaIndex = window.parseInt(str.substring(i, i + 1));
            sum += delta[deltaIndex];
        }
        var mod = sum % 10;
        mod = 10 - mod;
        if (mod == 10) {
            mod = 0;
        }
        return mod;
    },

    _luhnValidate: function (number) {
        var digit = window.parseInt(number.substring(number.length - 1, number.length));
        var less = number.substring(0, number.length - 1);

        return (this._luhnCalculate(less) == window.parseInt(digit));
    },

    /**
     * Compare accounts. True if equal
     * @param account
     * @return {Boolean}
     */
    is: function (account) {
        var number = new window.iAccount(account);

        return (number.val && (number.val == this.val));
    }
};

/**
 * Get Integer value
 * @return {Integer}
 */
window.iAccount.prototype.toInt = window.iAccount.prototype.toInteger = window.iAccount.prototype.toNubmer = window.iAccount.prototype.toFloat = function () {
    if (this.val.length > 16) {
        return 0;
    }

    return window.parseInt(this.val);
};

/**
 * Check account
 * @return {Boolean}
 */
iAccount.prototype.toBoolean = function () {
    return this.validate();
};
