/**
 * @author Knyazevich Denis, Pulyaev Yuriy
 * Currency Parser|normalizator
 * use:        a = new iDate('1.01.2012 12:38')
 * a.toString('dd.mm.yyyy HH:MM:ss.l')
 * @param val
 * @constructor
 * @return {*}
 */

/**
 * @class iDate
 * @param val {iDate|Number|String|Object}
 */
iDate = function (val) {

    // copy attributes
    this.attributes = {};
    this.attributes = this._clone(this.defaults);
    var date = new Date();

    /**
     * undefined
     */
    if (val === undefined) {
        this._setDate(date);

    } else if (typeof val === 'object' && val instanceof iDate) {
        /**
         * iDate
         */
        this.attributes = this._clone(val.attributes);

    } else if (typeof val === 'object' && val !== null) {
        /**
         * shift parameters
         */
        var dateType = val.hours || val.minutes || val.seconds || val.ms ? 'now' : 'today';
        this.attributes = this._clone((new iDate(dateType)).getShifted(val).attributes);

    } else if (typeof val === 'number') {
        /**
         * number
         */

        // milliseconds
        if (val > 60 * 60 * 24 * 1000) {
            date = new Date(val);
            // days
        } else {
            date = new Date(+(new Date()) + val * 60 * 60 * 24 * 1000);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
        }
        this._setDate(date);

    } else if (val === 'today' || val === 'tomorrow' || val === 'yesterday' || val === 'now') {
        /**
         * string
         */
        var today = new Date();

        if (val === 'tomorrow') {
            date = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1,
                0,
                0,
                0,
                0
            );
        } else if (val === 'yesterday') {
            date = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 1,
                0,
                0,
                0,
                0
            );
        } else if (val === 'today') {
            date = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                0,
                0,
                0,
                0
            );
        }

        this._setDate(date);
    } else if (val instanceof Date) {
        this._setDate(val);
    } else if (typeof val === 'string') {
        /**
         * parse date and time
         */

        var parsedDate = false;
        var parsedTime = false;
        var i, l;

        for (i = 0, l = this.parsers.date.length; i < l && !parsedDate && this.parsers.date[i]; i++) {
            parsedDate = this.parsers.date[i].call(this, val);
        }
        for (i = 0, l = this.parsers.time.length; i < l && !parsedTime; i++) {
            parsedTime = this.parsers.time[i].call(this, val);
        }

        /**
         * check date, f.e. 31.02.1991
         * @type {Date}
         */
        var someDate =
            new Date(this.attributes.year.val, (this.attributes.month.val || 1) - 1, this.attributes.date.val || 1);

        if (
            (
                someDate.getDate() != (this.attributes.date.val || 1)
            ) || (
                someDate.getMonth() + 1 != (this.attributes.month.val || 1)
            ) || (
                someDate.getFullYear() != this.attributes.year.val
            )
        ) {

            var attr;

            for (attr in this.attributes) {
                if (this.attributes.hasOwnProperty(attr) && this.attributes[attr].val != null) {
                    this.attributes[attr].val = null;
                }
            }
        }
    }
};

iDate.prototype = {

    /**
     * default string formats
     */
    dateFormat:        'dd.mm.yyyy',
    timeFormat:        'HH:MM',
    fullFormat:        'dd.mm.yyyy HH:MM',
    timestampFormat:   "yyyy-mm-dd'T'HH:MM:ssZ",
    formatSplitterReg: /^dd|mm|yyyy|yy|HH|MM|ss|l|'[^']+'|"[^"]+"|./,
    formatReg:         /^dd|mm|yyyy|yy|HH|MM|ss|l$/,
    parsers:           {

        date: [

            /**
             * yyyy-mm-dd || yyyymmdd || yyyymm
             * @param dateStr
             * @return {Boolean}
             */
            function (dateStr) {

                // do not use 0? for month or date at first position
                var reg = (/((19|20)[0-9]{2})[\.\-]?(0[1-9]|1[0-2]|[1-9])[\.\-]?(0[1-9]|[12][0-9]|3[01]|[1-9])?/);


                if (reg.test(dateStr)) {
                    var arr = reg.exec(dateStr);

                    if (arr[4]) {
                        this.set('date', (+arr[4]));
                    }
                    this.set('month', (+arr[3]));
                    this.set('year', (+arr[1]));

                    return true;
                }

                return false;
            },

            /**
             * dd.mm.yyyy | dd.mm.yy | dd.mm
             * @param dateStr
             * @return {Boolean}
             */
            function (dateStr) {

                var reg =
                    (/(^|\s)(0[1-9]|[12][0-9]|3[01]|[1-9])[\.\-](0[1-9]|1[0-2]|[1-9])([\.\-]?((19|20)[0-9]{2}|[0-9]{2}))?($|\s)/);

                if (reg.test(dateStr)) {
                    var arr = reg.exec(dateStr);

                    this.set('date', (+arr[2]));
                    this.set('month', (+arr[3]));

                    if (arr[5]) {
                        this.set('year', (+arr[5]));
                    }

                    return true;
                }

                return false;
            },

            /**
             * 28 янв 2010
             * 28 января 2010
             * 28 jan 2010
             * 28 січ 2010
             * @param dateStr
             * @return {Boolean}
             */
            function (dateStr) {

                var reg = (/(?:^|\s)(0[1-9]|[12][0-9]|3[01]|[1-9])(?:\s+)([А-Яа-яA-Za-zїЇіІєЄёЁ]+)(?:[\s.]+)((19|20)[0-9]{2}|[0-9]{2})/);

                if (reg.test(dateStr)) {
                    var arr = reg.exec(dateStr);

                    var monthIndex = this._getMonthIndexByName(arr[2]);
                    if (monthIndex !== null) {
                        this.set('month', monthIndex);
                    }

                    this.set('date', (+arr[1]));
                    this.set('year', (+arr[3]));
                    return true;
                }

                return false;
            }
        ],

        time: [

            // HH:MM:ss.l || HH:MM:ss || HH:MM
            function (dateStr) {

                var reg =
                    (/(0[0-9]|1[0-9]|2[0-3]|[0-9]):(0[0-9]|[1-5][0-9]|[0-9])(:(0[0-9]|[1-5][0-9]|[0-9]))?(\.([0-9][0-9][0-9]|[0-9][0-9]|[0-9]))?/);

                if (reg.test(dateStr)) {
                    var arr = reg.exec(dateStr);

                    this.set('hours', (+arr[1]));
                    this.set('minutes', (+arr[2]));

                    if (arr[4]) {
                        this.set('seconds', (+arr[4]));
                    }

                    if (arr[6]) {
                        this.set('ms', (+arr[6]));
                    }

                    return true;
                }

                return false;
            }
        ]
    },

    /**
     * default data
     * use .get() .set() to access
     */
    defaults: {
        date:    {
            isDefault: true,
            masks:     {dd: function (val) {
                return this._addZeros(val || 1, 2);
            }}
        },
        month:   {
            isDefault: true,
            masks:     {mm: function (val) {
                return this._addZeros(val || 1, 2);
            }}
        },
        year:    {
            isDefault: true,
            masks:     {
                yy:   function (val) {

                    if (!val && val != 0) {
                        val = (new Date()).getFullYear();
                    }

                    return this._addZeros(val.toString().substring(val.toString().length - 2), 2);

                },
                yyyy: function (val) {

                    if (!val && val != 0) {
                        val = (new Date()).getFullYear();
                    }

                    return this._addZeros(val, 4);
                }
            }
        },
        hours:   {
            isDefault: true,
            masks:     {HH: function (val) {
                return this._addZeros(val || 0, 2);
            }}
        },
        minutes: {
            isDefault: true,
            masks:     {MM: function (val) {
                return this._addZeros(val || 0, 2);
            }}
        },
        seconds: {
            isDefault: true,
            masks:     {ss: function (val) {
                return this._addZeros(val || 0, 2);
            }}
        },
        ms:      {
            isDefault: true,
            masks:     {l: function (val) {
                return this._addZeros(val || 0, 3);
            }}
        }
    },

    _monthIndexMasks: {
        /**
         * i - украинская и английская
         */
        '1':  /янв[а-я]*|с[іi]ч[а-я]*|jan[a-z]*/i,
        '2':  /фев[а-я]*|лют[а-я]*|feb[a-z]*/i,
        '3':  /мар[а-я]*|бер[а-я]*|mar[a-z]*/i,
        /**
         * i - украинская и английская
         */
        '4':  /апр[а-я]*|кв[іi][а-я]*|apr[a-z]*/i,
        '5':  /ма[йя]|тра[а-я]*|may[a-z]*/i,
        '6':  /июн[а-я]*|чер[а-я]*|jun[a-z]*/i,
        '7':  /июл[а-я]*|лип[а-я]*|jul[a-z]*/i,
        '8':  /авг[а-я]*|сер[а-я]*|aug[a-z]*/i,
        '9':  /сен[а-я]*|вер[а-я]*|sep[a-z]*/i,
        '10': /окт[а-я]*|жов[а-я]*|oct[a-z]*/i,
        '11': /ноя[а-я]*|лис[а-я]*|nov[a-z]*/i,
        '12': /дек[а-я]*|гру[а-я]*|dec[a-z]*/i
    },

    /**
     * Get month number (1..12)
     * @param monthName {String}
     * @return {null|Number}
     * @private
     */
    _getMonthIndexByName: function (monthName) {
        var i;
        for (i in this._monthIndexMasks) {
            if (this._monthIndexMasks.hasOwnProperty(i) && this._monthIndexMasks[i].test(monthName)) {
                return +i;
            }
        }

        return null;
    },

    _monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ],

    /**
     * Get month name
     * @return {String}
     */
    getMonthName: function () {
        return this._monthNames[this.get('month') - 1];
    },


    /**
     * Array of masks and splitters
     * @param format {String} some kind of 'dd.mm.yyyy HH:MM'
     * @return {Array}
     * @private
     */
    _splitFormat: function (format) {

        var f = format;
        var splittedArr = [];

        while (this.formatSplitterReg.test(f)) {

            splittedArr.push(this.formatSplitterReg.exec(f)[0]);

            f = f.replace(this.formatSplitterReg, '');
        }

        return splittedArr;
    },

    /**
     * String like '00023'
     * @param num {Float}
     * @param length {integer} length of string vs zeros
     * @return {String}
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
     * Set date to attributes
     * @param date {Date}
     * @private
     */
    _setDate: function (date) {

        this.set('date', date.getDate());
        this.set('month', date.getMonth() + 1);
        this.set('year', date.getFullYear());
        this.set('hours', date.getHours());
        this.set('minutes', date.getMinutes());
        this.set('seconds', date.getSeconds());
        this.set('ms', date.getMilliseconds());
    },

    /**
     * Set attribute
     * @param key {String|Object} '' || {key: val}
     * @param [val] {*}
     * @return {*}
     */
    set: function (key, val) {

        /**
         * key is object?
         */
        if (typeof key === 'object' && val == null) {
            var i;
            for (i in key) {
                if (key.hasOwnProperty(i)) {
                    this.set(i, key[i]);
                }
            }

            return this;
        }

        /**
         * inserting '12' year (mean '2012')
         */
        if (key == 'year' && val.toString().length <= 2) {
            val = (+val < 70) ? 2000 + val : 1900 + val;
        }

        if (key == 'month' && val < 1) {
            val = 12;
            this.attributes.year.val = this.attributes.year.val - 1;
        }

        this.attributes[key].val = parseFloat(val);
        this.attributes[key].isDefault = false;

        return this;
    },

    /**
     * Get attribute
     * @param key {String}
     * @return {String|null}
     */
    get: function (key) {
        return (key.toLowerCase() == 'getdayofweek') ? this.getDayOfWeek() : (this.attributes[key].val || null);
    },

    /**
     * Get full date string
     * @param format {String|null} null || some kind of 'dd.mm.yyyy HH:MM'
     * @return {String}
     */
    toString: function (format) {

        if (format == null) {
            format = this.fullFormat;
        }

        var splitted = this._splitFormat(format);
        var ret = '';

        while (splitted.length) {

            var str = splitted.shift();
            var val = str;
            var i;
            var j;

            /**
             * elem is a date mask
             * try to find mask at attributes masks
             */
            if (this.formatReg.test(str)) {
                for (i in this.attributes) {
                    if (this.attributes.hasOwnProperty(i) && this.attributes[i].masks) {
                        for (j in this.attributes[i].masks) {
                            if (j === str) {
                                val = this.attributes[i].masks[j].call(this, this.attributes[i].val);
                            }
                        }
                    }
                }
            }

            ret += val.replace(/^'([^']+)'|"([^"]+)"$/, "$1$2");
        }

        return ret;
    },


    /**
     * Get Date object
     * @return {Date}
     */
    toDate: function () {
        var arr = this.toString('yyyy mm dd HH MM ss l').split(' ');
        arr[1]--;
        return new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]);
    },

    /**
     * Get date only string
     * @param format {String|null} null || some kind of 'dd.mm.yyyy'
     * @return {String}
     */
    date: function (format) {

        if (format == null) {
            format = this.dateFormat;
        }

        return this.toString(format);
    },

    /**
     * Get time only string
     * @param format {String|null} null || some kind of 'HH:MM:ss.l'
     * @return {String}
     */
    time: function (format) {

        format = format || this.timeFormat;

        return this.toString(format);
    },

    /**
     * Get unix timestamp string
     * @return {String}
     */
    timestamp: function () {
        return this.toString(this.timestampFormat);
    },

    /**
     * Get date in milliseconds, since 1 january 1970
     * @return {Integer}
     */
    getMilliseconds: function () {
        var milliseconds = Date.parse(this.toDate());
        /**
         * bug with 1970 year
         */
        if (milliseconds < 0) {
            milliseconds = Date.parse(new Date("1970", "0", "02"));
        }
        return milliseconds;
    },

    /**
     * Return the difference between dates
     * @param date {iDate|*} iDate || iDate parameters
     * @return {Object} {years, months, days, hours, minutes, seconds, ms}
     */
    getDifference: function (date) {

        if (!date) {
            return null;
        }

        if (!(date instanceof iDate)) {
            date = new window.iDate(date);
        }

        return {
            years:   this.get('year') - date.get('year'),
            months:  this.get('month') - date.get('month'),
            days:    this.get('date') - date.get('date'),
            hours:   this.get('hours') - date.get('hours'),
            minutes: this.get('minutes') - date.get('minutes'),
            seconds: this.get('seconds') - date.get('seconds'),
            ms:      this.get('ms') - date.get('ms')
        };
    },

    /**
     * returns the difference between dates at specified units
     * @units default is "days"
     * @param date {iDate|*} iDate || iDate parameters
     * @param units {String} "years" || "months" || "days" || "hours" || "minutes" || "seconds" || "ms". Default "days"
     * @return {Float}
     */
    getUnitDifference: function (date, units) {

        if (!date) {
            return null;
        }

        units = units || 'days';

        if (!(date instanceof iDate)) {
            date = new iDate(date);
        }

        switch (units.toLowerCase()) {
        case 'years':
            return this.get('year') - date.get('year') + (
                this.get('month') - date.get('month') + (
                    this.get('date')  - date.get('date') + (
                        this.get('hours')  - date.get('hours') + (
                            this.get('minutes')  - date.get('minutes') + (
                                this.get('seconds')  - date.get('seconds') + (
                                    this.get('ms')  - date.get('ms')
                                ) / 100
                            ) / 60
                        ) / 60
                    ) / 24
                ) / (365 / 12)
            ) / 12;
        case 'months':
            return (this.get('year')  - date.get('year')) * 12 +
                this.get('month') - date.get('month') + (
                    this.get('date')  - date.get('date') + (
                        this.get('hours')  - date.get('hours') + (
                            this.get('minutes')  - date.get('minutes') + (
                                this.get('seconds')  - date.get('seconds') + (
                                    this.get('ms')  - date.get('ms')
                                ) / 100
                            ) / 60
                        ) / 60
                    ) / 24
                ) / (365 / 12);
        case 'hours':
            return (this.getMilliseconds() - date.getMilliseconds()) / (60 * 60 * 1000);
        case 'minutes':
            return (this.getMilliseconds() - date.getMilliseconds()) / (60 * 1000);
        case 'seconds':
            return (this.getMilliseconds() - date.getMilliseconds()) / 1000;
        case 'ms':
            return this.getMilliseconds() - date.getMilliseconds();
        case 'days':
            return (this.getMilliseconds() - date.getMilliseconds()) / (60 * 60 * 24 * 1000);
        }
    },

    /**
     * Get days count at month
     * @param [month] {Integer} 1-12. default this.get('month')
     * @return {Integer}
     */
    getDaysInMonth: function (month) {

        month = (!isNaN(month)) ? month : this.get('month');

        // создадим дату следующего месяца и отнимем от нее 1 день (0)
        return new Date(this.get('year'), month, 0).getDate();
    },

    /**
     * Shifts iDate for months, days..
     * @param counts {Object|Float} {years, months, days, hours, minutes, seconds, ms} || days
     * @return {iDate}
     */
    getShifted: function (counts) {

        var shifted = new iDate();

        if (typeof counts === 'number') {
            counts = {
                days: counts
            };
        }

        shifted._setDate(
            new Date(this.get('year') + (counts.years || 0),
                this.get('month') + (counts.months || 0) - 1,
                this.get('date') + (counts.days || 0),
                this.get('hours') + (counts.hours || 0),
                this.get('minutes') + (counts.minutes || 0),
                this.get('seconds') + (counts.seconds || 0),
                this.get('ms') + (counts.ms || 0))
        );

        return shifted;
    },

    /**
     * Get day of the week (1..7)
     * @return {Integer}
     */
    getDayOfWeek: function () {
        return new Date(this.get('year'), this.get('month') - 1, this.get('date')).getDay();
    },

    /**
     * Check data by mask
     * @param format {null|String} null || some kind of 'dd.mm.yyyy HH:MM'
     * @return {Boolean}
     */
    validate: function (format) {

        if (format == null) {
            format = this.fullFormat;
        }

        var splitted = this._splitFormat(format);

        while (splitted.length) {

            var str = splitted.shift();
            var i;
            var j;

            // elem is a date mask
            // try to find mask at attributes masks
            if (this.formatReg.test(str)) {
                for (i in this.attributes) {
                    if (this.attributes.hasOwnProperty(i) && this.attributes[i].masks) {
                        for (j in this.attributes[i].masks) {
                            if (j == str && (!this.attributes[i].val && this.attributes[i].val != 0)) {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        return true;
    },

    /**
     * Date is equal to
     * @param date {iDate|*} iDate || iDate parameters
     * @param format {null|String} null || some kind of 'dd.mm.yyyy HH:MM'
     * @return {Boolean}
     */
    is: function (date, format) {
        var result = true;
        format = format || this.dateFormat;

        date = new iDate(date);

        var isValid = format ? date.validate(format) : date.validate();

        if (isValid) {
            if (format) {
                result = (this.toString(format) == date.toString(format));
            }
        } else {
            result = false;
        }

        return result;
    },

    _clone: function (obj) {
        if (obj == null || (typeof obj !== 'object')) {
            return obj;
        }
        var temp = new obj.constructor();
        var key;

        for (key in obj) {
            temp[key] = this._clone(obj[key]);
        }

        return temp;
    }
};

/**
 * Change iDates prototype
 * @param attributes {iDate.constructor}
 */
iDate.extend = function (attributes) {

    var ret = iDate;
    ret.prototype = _.extend({}, this.prototype, attributes || {});
    ret.extend = this.extend;

    return ret;
};
