(function (root, undefined) {
    var ArrayPrototype = Array.prototype,
        clone = function (obj) {
            return deepMerge({}, obj);
        },
        deepMerge = function (obj) {
            var prop,
                i,
                dataObj,
                data = ArrayPrototype.slice.call(arguments, 1),
                len = data.length;

            obj = obj || {};

            for (i = 0; i < len; i++) {
                for (prop in data[i]) {
                    if (data[i].hasOwnProperty(prop)) {
                        dataObj = data[i][prop];

                        if (dataObj instanceof Array) {
                            obj[prop] = dataObj.slice(0);
                        } else if (dataObj != null && typeof dataObj === 'object') {
                            obj[prop] = deepMerge({}, obj[prop], dataObj);
                        } else {
                            obj[prop] = dataObj;
                        }
                    }
                }
            }

            return obj;
        },

        /**
         * @author Knyazevich Denis, Pulyaev Yuriy
         * Currency Parser|normalizator
         * use:        a = new IDate('1.01.2012 12:38')
         * a.toString('dd.mm.yyyy HH:MM:ss.l')
         * @param value
         * @constructor
         * @return {*}
         */

        /**
         *
         * @param value
         * @constructor
         */
        IDate = function (value) {
            if (this._init) {
                this._init.apply(this, arguments);
            }

            return this;
        };

    IDate.prototype = {

        /**
         * default string formats
         */
        dateFormat: 'dd.mm.yyyy',
        timeFormat: 'HH:MM',
        fullFormat: 'dd.mm.yyyy HH:MM',
        timestampFormat: "yyyy-mm-dd'T'HH:MM:ssZ",
        formatSplitterReg: /^HH|MM|ss|mmm|dd|D|l|mm|F|f|yyyy|yy|'[^']+'|"[^"]+"|./,
        formatReg: /^HH|MM|ss|mmm|dd|D|l|mm|F|f|yyyy|yy$/,
        parsers: {
            date: [

                /**
                 * May 31, 2013
                 * @param dateStr
                 * @return {boolean}
                 */
                function (dateStr) {
                    // do not use 0? for month or date at first position
                    var reg = (/(\D+)\s+(\d+),\s+(\d+)/);

                    if (reg.test(dateStr)) {
                        var arr = reg.exec(dateStr);

                        this.set('date', +arr[2]);
                        this.set('month', this._getMonthIndexByName(arr[1]));
                        this.set('year', +arr[3]);

                        return true;
                    }

                    return false;
                },

                /**
                 * yyyy-mm-dd || yyyymmdd || yyyymm
                 * @param dateStr
                 * @return {boolean}
                 */
                function (dateStr) {

                    // do not use 0? for month or date at first position
                    var reg = (/((19|20)[0-9]{2})[\.\-]?(0[1-9]|1[0-2]|[1-9])[\.\-]?(0[1-9]|[12][0-9]|3[01]|[1-9])?/),
                        arr;

                    if (reg.test(dateStr)) {
                        arr = reg.exec(dateStr);

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
                 * @return {boolean}
                 */
                function (dateStr) {

                    var arr,
                        reg = (/(^|\s)(0[1-9]|[12][0-9]|3[01]|[1-9])[\.\-](0[1-9]|1[0-2]|[1-9])([\.\-]?((19|20)[0-9]{2}|[0-9]{2}))?($|\s)/);

                    if (reg.test(dateStr)) {
                        arr = reg.exec(dateStr);

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
                 * @return {boolean}
                 */
                function (dateStr) {

                    var monthIndex,
                        arr,
                        reg = (/(?:^|\s)(0[1-9]|[12][0-9]|3[01]|[1-9])(?:\s+)([А-Яа-яA-Za-zїЇіІєЄёЁ]+)(?:[\s.]+)((19|20)[0-9]{2}|[0-9]{2})/);

                    if (reg.test(dateStr)) {
                        arr = reg.exec(dateStr);
                        monthIndex = this._getMonthIndexByName(arr[2]);

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

                    var arr,
                        reg = (/(0[0-9]|1[0-9]|2[0-3]|[0-9]):(0[0-9]|[1-5][0-9]|[0-9])(:(0[0-9]|[1-5][0-9]|[0-9]))?(\.([0-9][0-9][0-9]|[0-9][0-9]|[0-9]))?/);

                    if (reg.test(dateStr)) {
                        arr = reg.exec(dateStr);

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
            date: {
                isDefault: true,
                masks: {
                    // номер дня месяца (01)
                    dd: function (value) {
                        return this._addZeros(value || 1, 2);
                    },
                    // название дня недели сокращенно (пн)
                    D: function () {
                        return this._dateOfWeekShortNames[this.getDayOfWeek() - 1];
                    },
                    // название дня недели полностью (понедельник)
                    l: function () {
                        return this._dateOfWeekNames[this.getDayOfWeek() - 1];
                    }
                }
            },
            month: {
                isDefault: true,
                masks: {
                    // номер месяца (01)
                    mm: function (value) {
                        return this._addZeros(value || 1, 2);
                    },
                    // название месяца (январь)
                    f: function (value) {
                        return this._monthNames[(value || 1) - 1];
                    },
                    // название месяца в родительском падеже (января)
                    F: function (value) {
                        return this._monthNamesWithDate[(value || 1) - 1];
                    }
                }
            },
            year: {
                isDefault: true,
                masks: {
                    // номер года сокращенно (13)
                    yy: function (value) {

                        if (!value && value != 0) {
                            value = (new Date()).getFullYear();
                        }

                        return this._addZeros(value.toString().substring(value.toString().length - 2), 2);

                    },
                    // номер года полностью (2013)
                    yyyy: function (value) {

                        if (!value && value != 0) {
                            value = (new Date()).getFullYear();
                        }

                        return this._addZeros(value, 4);
                    }
                }
            },
            hours: {
                isDefault: true,
                masks: {
                    // часы (01)
                    HH: function (value) {
                        return this._addZeros(value || 0, 2);
                    }
                }
            },
            minutes: {
                isDefault: true,
                masks: {
                    // минуты (01)
                    MM: function (value) {
                        return this._addZeros(value || 0, 2);
                    }
                }
            },
            seconds: {
                isDefault: true,
                masks: {
                    // секунды (01)
                    ss: function (value) {
                        return this._addZeros(value || 0, 2);
                    }
                }
            },
            ms: {
                isDefault: true,
                masks: {
                    // милисекунды (01)
                    mmm: function (value) {
                        return this._addZeros(value || 0, 3);
                    }
                }
            },
            timezone: {
                isDefault: true,
                masks: {
                    // временная зона (01)
                    Z: function (value) {
                        return value;
                    }
                }
            }
        },

        _monthIndexMasks: {
            /**
             * i - украинская и английская
             */
            '1': /янв[а-я]*|с[іi]ч[а-я]*|jan[a-z]*/i,
            '2': /фев[а-я]*|лют[а-я]*|feb[a-z]*/i,
            '3': /мар[а-я]*|бер[а-я]*|mar[a-z]*/i,
            /**
             * i - украинская и английская
             */
            '4': /апр[а-я]*|кв[іi][а-я]*|apr[a-z]*/i,
            '5': /ма[йя]|тра[а-я]*|may[a-z]*/i,
            '6': /июн[а-я]*|чер[а-я]*|jun[a-z]*/i,
            '7': /июл[а-я]*|лип[а-я]*|jul[a-z]*/i,
            '8': /авг[а-я]*|сер[а-я]*|aug[a-z]*/i,
            '9': /сен[а-я]*|вер[а-я]*|sep[a-z]*/i,
            '10': /окт[а-я]*|жов[а-я]*|oct[a-z]*/i,
            '11': /ноя[а-я]*|лис[а-я]*|nov[a-z]*/i,
            '12': /дек[а-я]*|гру[а-я]*|dec[a-z]*/i
        },

        _init: function (value) {
            /**
             * parse date and time
             */
            var parsedDate = false,
                parsedTime = false,
                i,
                attr,
                l,
                someDate,
                date = new Date(),
                today = new Date(),
                dateType;

            this.attributes = clone(this.defaults);

            /**
             * null or undefined
             */
            if (value == undefined) {
                this._setDate(date);
            } else if (typeof value === 'object' && value instanceof IDate) {
                /**
                 * IDate
                 */
                this.attributes = clone(value.attributes);
            } else if (value instanceof Date) {
                this._setDate(value);
            } else if (typeof value === 'object' && value !== null) {
                /**
                 * shift parameters
                 */
                dateType = value.hours || value.minutes || value.seconds || value.ms ? 'now' : 'today';

                this.attributes = clone((new IDate(dateType)).getShifted(value).attributes);
            } else if (typeof value === 'number') {
                // milliseconds
                if (value > 60 * 60 * 24 * 1000) {
                    date = new Date(value);
                } else {
                    // days
                    date = new Date(+(new Date()) + value * 60 * 60 * 24 * 1000);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setMilliseconds(0);
                }
                this._setDate(date);

            } else if (value === 'today' || value === 'tomorrow' || value === 'yesterday' || value === 'now') {
                /**
                 * string
                 */
                today = new Date();

                if (value === 'tomorrow') {
                    date = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate() + 1,
                        0,
                        0,
                        0,
                        0
                    );
                } else if (value === 'yesterday') {
                    date = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate() - 1,
                        0,
                        0,
                        0,
                        0
                    );
                } else if (value === 'today') {
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
            } else if (typeof value === 'string') {
                for (i = 0, l = this.parsers.date.length; i < l && !parsedDate && this.parsers.date[i]; i++) {
                    parsedDate = this.parsers.date[i].call(this, value);
                }

                for (i = 0, l = this.parsers.time.length; i < l && !parsedTime; i++) {
                    parsedTime = this.parsers.time[i].call(this, value);
                }

                /**
                 * check date, f.e. 31.02.1991
                 * @type {Date}
                 */
                someDate = new Date(
                    this.attributes.year.value,
                    (this.attributes.month.value || 1) - 1,
                    this.attributes.date.value || 1
                );

                if (
                    (
                        someDate.getDate() != (this.attributes.date.value || 1)
                    ) || (
                        someDate.getMonth() + 1 != (this.attributes.month.value || 1)
                    ) || (
                        someDate.getFullYear() != this.attributes.year.value
                    )
                ) {
                    for (attr in this.attributes) {
                        if (this.attributes.hasOwnProperty(attr) && this.attributes[attr].value != null) {
                            this.attributes[attr].value = null;
                        }
                    }
                }
            }
            return this;
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

        _dateOfWeekNames: [
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
            'Воскресенье'
        ],
        _dateOfWeekShortNames: [
            'пн',
            'вт',
            'ср',
            'чт',
            'пт',
            'сб',
            'вс'
        ],
        _monthNamesWithDate: [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        ],

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

            var f = format,
                splittedArr = [];

            while (this.formatSplitterReg.test(f)) {

                splittedArr.push(this.formatSplitterReg.exec(f)[0]);

                f = f.replace(this.formatSplitterReg, '');
            }

            return splittedArr;
        },

        /**
         * String like '00023'
         * @param num {Number}
         * @param length {Number} length of string vs zeros
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
         * @param key {String|Object} '' || {key: value}
         * @param [value] {*}
         * @return {*}
         */
        set: function (key, value) {
            var i,
                prop;

            /**
             * key is object?
             */
            if (typeof key === 'object' && value == null) {
                for (i in key) {
                    if (key.hasOwnProperty(i)) {
                        prop = i;

                        if ((/^hour|minute|second$/).test(prop)) {
                            prop += "s";
                        } else if (prop == "day") {
                            prop = "date";
                        }

                        this.set(prop, key[i]);
                    }
                }

                return this;
            }

            if (this.attributes[key] == null) {
                return this;
            }

            /**
             * inserting '12' year (mean '2012')
             */
            if (key == 'year' && value.toString().length <= 2) {
                value = (+value < 70) ? 2000 + value : 1900 + value;
            }

            if (key == 'month' && value < 1) {
                value = 12;
                this.attributes.year.value = this.attributes.year.value - 1;
            }

            this.attributes[key].value = parseFloat(value);
            this.attributes[key].isDefault = false;

            return this;
        },

        /**
         * Get attribute
         * @param key {String}
         * @return {String|null}
         */
        get: function (key) {
            return (key.toLowerCase() == 'getdayofweek') ? this.getDayOfWeek() : (this.attributes[key].value || null);
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

            var splitted = this._splitFormat(format),
                ret = '',
                str,
                value,
                i,
                j;

            while (splitted.length) {

                str = splitted.shift();
                value = str;

                /**
                 * elem is a date mask
                 * try to find mask at attributes masks
                 */
                if (this.formatReg.test(str)) {
                    for (i in this.attributes) {
                        if (this.attributes.hasOwnProperty(i) && this.attributes[i].masks) {
                            for (j in this.attributes[i].masks) {
                                if (j === str) {
                                    value = this.attributes[i].masks[j].call(this, this.attributes[i].value);
                                }
                            }
                        }
                    }
                }

                ret += value.replace(/^'([^']+)'|"([^"]+)"$/, "$1$2");
            }

            return ret;
        },

        /**
         *
         * @param format
         * @returns {string}
         */
        toHtml: function (format) {
            return "<span>" + this.toString.apply(this, arguments) + "</span>";
        },

        /**
         * Get Date object
         * @return {Date}
         */
        toDate: function () {
            var arr = this.toString('yyyy mm dd HH MM ss mmm').split(' ');
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
         * @param format {String|null} null || some kind of 'HH:MM:ss.mmm'
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
         * @return {Number}
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
         * @param date {IDate|*} IDate || IDate parameters
         * @return {Object} {years, months, days, hours, minutes, seconds, ms}
         */
        getDifference: function (date) {

            if (!date) {
                return null;
            }

            if (!(date instanceof IDate)) {
                date = new IDate(date);
            }

            return {
                years: this.get('year') - date.get('year'),
                months: this.get('month') - date.get('month'),
                days: this.get('date') - date.get('date'),
                hours: this.get('hours') - date.get('hours'),
                minutes: this.get('minutes') - date.get('minutes'),
                seconds: this.get('seconds') - date.get('seconds'),
                ms: this.get('ms') - date.get('ms')
            };
        },

        /**
         * returns the difference between dates at specified units
         * @units default is "days"
         * @param date {IDate|*} IDate || IDate parameters
         * @param units {String} "years" || "months" || "days" || "hours" || "minutes" || "seconds" || "ms". Default "days"
         * @return {*}
         */
        getUnitDifference: function (date, units) {

            if (!date) {
                return null;
            }

            units = units || 'days';

            if (!(date instanceof IDate)) {
                date = new IDate(date);
            }

            switch (units.toLowerCase()) {
            case 'years':
                return this.get('year') - date.get('year') + (
                    this.get('month') - date.get('month') + (
                        this.get('date') - date.get('date') + (
                            this.get('hours') - date.get('hours') + (
                                this.get('minutes') - date.get('minutes') + (
                                    this.get('seconds') - date.get('seconds') + (
                                        this.get('ms') - date.get('ms')
                                    ) / 100
                                ) / 60
                            ) / 60
                        ) / 24
                    ) / (365 / 12)
                ) / 12;
            case 'months':
                return (this.get('year') - date.get('year')) * 12 +
                    this.get('month') - date.get('month') + (
                        this.get('date') - date.get('date') + (
                            this.get('hours') - date.get('hours') + (
                                this.get('minutes') - date.get('minutes') + (
                                    this.get('seconds') - date.get('seconds') + (
                                        this.get('ms') - date.get('ms')
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

            return null;
        },

        /**
         * Get days count at month
         * @param [month] {Number} 1-12. default this.get('month')
         * @return {Number}
         */
        getDaysInMonth: function (month) {

            month = (!isNaN(month)) ? month : this.get('month');

            // создадим дату следующего месяца и отнимем от нее 1 день (0)
            return new Date(this.get('year'), month, 0).getDate();
        },

        /**
         * Shifts IDate for months, days..
         * @param counts {Object|Float} {years, months, days, hours, minutes, seconds, ms} || days
         * @return {IDate}
         */
        getShifted: function (counts) {

            var shifted = new IDate();

            if (typeof counts === 'number') {
                counts = {
                    days: counts
                };
            }

            shifted._setDate(
                new Date(this.get('year') + (counts.years || counts.year || 0),
                    this.get('month') + (counts.months || counts.month || 0) - 1,
                    this.get('date') + (counts.days || counts.day || 0),
                    this.get('hours') + (counts.hours || counts.hour || 0),
                    this.get('minutes') + (counts.minutes || counts.minute || 0),
                    this.get('seconds') + (counts.seconds || counts.second || 0),
                    this.get('ms') + (counts.ms || 0))
            );

            return shifted;
        },

        /**
         * Get day of the week (1..7)
         * @return {Number}
         */
        getDayOfWeek: function () {
            var day = new Date(this.get('year'), this.get('month') - 1, this.get('date')).getDay();

            // фиск американской системы
            if (day === 0) {
                return 7;
            }
            return day;
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

            var splitted = this._splitFormat(format),
                str,
                i,
                j;

            while (splitted.length) {

                str = splitted.shift();

                // elem is a date mask
                // try to find mask at attributes masks
                if (this.formatReg.test(str)) {
                    for (i in this.attributes) {
                        if (this.attributes.hasOwnProperty(i) && this.attributes[i].masks) {
                            for (j in this.attributes[i].masks) {
                                if (j == str && (!this.attributes[i].value && this.attributes[i].value != 0)) {
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
         * @param date {IDate|*} IDate || IDate parameters
         * @param format {null|String} null || some kind of 'dd.mm.yyyy HH:MM'
         * @return {Boolean}
         */
        is: function (date, format) {
            var result = true;
            format = format || this.dateFormat;

            date = new IDate(date);

            var isValid = format ? date.validate(format) : date.validate();

            if (isValid) {
                if (format) {
                    result = (this.toString(format) == date.toString(format));
                }
            } else {
                result = false;
            }

            return result;
        }
    };

    /**
     * Change IDate prototype
     * @param attributes {*}
     */
    IDate.extend = function (attributes) {
        var Child = function () {
            if (this._init) {
                this._init.apply(this, arguments);
            }

            return this;
        },
            F = function () {};

        F.prototype = this.prototype;
        Child.prototype = deepMerge(new F(), clone(attributes));
        Child.prototype.constructor = Child;

        Child.extend = IDate.extend;

        return Child;
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = IDate;
    } else {
        root.IDate = IDate;
    }
}(this));