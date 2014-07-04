(function (root) {
    "use strict";

    var defaultSplitter = "/",
        /**
         *
         * @param data {string}
         * @param splitter {string}
         */
        ICardExpiry = function (data, splitter) {
            var dateData;

            if (data instanceof ICardExpiry) {
                this.value = data.value;
                this.month = data.month;
                this.year = data.year;
                this.splitter = data.splitter;

                return this;
            }

            this.splitter = splitter || this.splitter;
            dateData = ICardExpiry.split(data, this.splitter);
            this.month = dateData[0];
            this.year = dateData[1];
            this.value = this.toString();

            if (!this.validate()) {
                this._toDefaults();
            }
        };

    ICardExpiry.prototype = {
        value: "",

        month: 0,

        year: 0,

        splitter: defaultSplitter,

        _toDefaults: function () {
            this.value = '';
            this.month = 0;
            this.year = 0;
            this.splitter = defaultSplitter;
        },

        /**
         *
         * @returns {boolean}
         */
        validate: function () {
            var month = this.month,
                year = this.year,
                today = new Date(),
                currentYear = today.getFullYear(),

                // getYear is not recommended method
                currentYearShort = +String(currentYear).substring(2, 4),

                // 1-12
                currentMonth = today.getMonth() + 1,
                yearAsString = String(year),
                len = yearAsString.length,
                isCurrentYear = (
                    len === 2 && year == currentYearShort
                ) || (
                    len === 4 && year == currentYear
                );

            return (
                month > 0 && month < 13 && month % 1 === 0
            ) && (
                len === 2 || len === 4
            ) && (
                len !== 2 || year >= currentYearShort
            ) && (
                len !== 4 || year >= currentYear
            ) && year % 1 === 0 && (!isCurrentYear || month >= currentMonth);
        },

        /**
         *
         * @returns {string}
         */
        toString: function (format, splitter) {
            var year = String(this.year);

            if (!this.validate()) {
                return '';
            }

            if (format !== 'full' && year.length > 2) {
                year = year.substring(2, 4);
            }

            return ICardExpiry.monthToString(this.month) + (splitter || this.splitter) + year;
        },

        /**
         *
         * @param value
         * @returns {boolean}
         */
        is: function (value) {
            var obj = new ICardExpiry(value);

            return this.value === obj.value;
        },

        /**
         *
         * @returns {string}
         */
        toHtml: function () {
            return "<span>" + this.toString.call(this, arguments) + "</span>";
        }
    };

    ICardExpiry.format = function (str, splitter) {
        str = String(str || '');
        splitter = splitter || defaultSplitter;

        var data,
            isNotNumber = isNaN(str),
            hasOnlyOneSymbol = str.length === 1,
            isOnlyOne = hasOnlyOneSymbol && str == 1,
            formattedSplitter = String(splitter).trim(),
            result = "";

        if (!str) {
            return result;
        }

        data = this.split(str, formattedSplitter);

        if (isOnlyOne) {
            result += "1";
        } else {
            result += this.monthToString(data[0]);
        }

        if (data[0] > 1 || (isNotNumber && data[0] > 1) || (result.length > 1 && !hasOnlyOneSymbol)) {
            result += splitter;

            if (data[1]) {
                result += data[1];
            }
        }

        return result;
    };

    ICardExpiry.split = function (data, splitter) {
        splitter = splitter || defaultSplitter;
        data = String(data).trim();

        var parsedData = data.split(splitter),
            month,
            year;

        if (parsedData.length === 1 && data.length > 2) {
            month = data.substr(0, 2);
            year = data.substring(2);
        } else {
            month = parsedData[0].replace(/\s+/g, '');
            year = parsedData[1] && parsedData[1].replace(/\s+/g, '');
        }

        return [
            isNaN(month) ? 0 : month,
            isNaN(year) ? 0 : year
        ];
    };

    ICardExpiry.monthToString = function (month) {
        var m = +month;

        return (m > 0 && m < 10 ? '0' : '') + m;
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = ICardExpiry;
    } else {
        root.ICardExpiry = ICardExpiry;
    }
}(this));