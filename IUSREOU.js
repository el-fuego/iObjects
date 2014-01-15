(function (root) {
    "use strict";

    /**
     *
     * @param code {string|number}
     */
    var IUSREOU = function (code) {
        var len,
            i;

        if (code instanceof IUSREOU) {
            this.value = code.value;
        } else {
            /**
             * Убираем пробелы
             * @type {string}
             */
            this.value = String(code).replace(/\s+/g, '');
            len = this.value.length;

            /**
             * Если код не пустой, содержит не только 0 и меньшей длинны, чем минимальная, то добавим
             * вначало необходимое кол-во 0.
             */
            if (len && this.value != 0 && len < this.options.minLength) {
                for (i = this.options.minLength - len; i > 0; i--) {
                    this.value = "0" + this.value;
                }
            }
        }

        if (!this.validate()) {
            this.value = null;
        }
    };

    IUSREOU.prototype = {
        value: null,

        options: {
            minLength: 8,
            checkSum: {
                factors: [7, 1, 2, 3, 4, 5, 6],
                lowerLimit: 30000000,
                upperLimit: 60000000
            }
        },

        /**
         * @description Правильная ли контрольная сумма
         * @returns {boolean}
         * @private
         */
        _isValidCheckSum: function () {
            var result = false,
                sum = 0,
                factors = this.options.checkSum.factors,
                lowerLimit = this.options.checkSum.lowerLimit,
                upperLimit = this.options.checkSum.upperLimit,
                i,

                /**
                 * в подсчете учавствуют не все цифры
                 */
                len = factors.length,
                factor,
                lastDigit,
                modulo,
                value = this.value;

            if (!isNaN(value)) {
                lastDigit = value[value.length - 1];

                for (i = 0; i < len; i++) {
                    if (value > lowerLimit && value < upperLimit) {
                        factor = factors[i];
                    } else {
                        factor = i + 1;
                    }

                    sum += value[i] * factor;
                }

                modulo = sum % 11;

                if (modulo > 10) {
                    sum = 0;

                    for (i = 0; i < len; i++) {
                        if (value > lowerLimit && value < upperLimit) {
                            factor = factors[i]  + 2;
                        } else {
                            factor = i + 1 + 2;
                        }

                        sum += value[i] * factor;
                    }

                    modulo = sum % 11;
                }

                if (modulo == 10) {
                    result = true;
                } else {
                    /**
                     * @description Результат деления должен совпадать с последней цифрой
                     * @type {boolean}
                     */
                    result = modulo == lastDigit;
                }
            }

            return result;
        },

        /**
         *
         * @returns {boolean}
         */
        validate: function () {
            return !!(
                this.value &&
                    (/^[0-9]+$/).test(this.value) &&

                    /**
                     * все нули
                     */
                    +this.value != 0 &&
                    this._isValidCheckSum()
            );
        },

        /**
         *
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
            var obj = new IUSREOU(value);

            return this.value === obj.value;
        },

        /**
         *
         * @returns {string}
         */
        toHtml: function () {
            return "<span>" + this.toString() + "</span>";
        },

        /**
         *
         * @returns {boolean}
         */
        isDefault: function () {
            return this.value == null;
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = IUSREOU;
    } else {
        root.IUSREOU = IUSREOU;
    }
}(this));