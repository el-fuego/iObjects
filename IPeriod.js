(function (root) {
    "use strict";

    /**
     * need: IDate, jQuery
     * @args:
     *  [IPeriod]
     *  [startDate, days]
     *  ["12.01.2012 - today"]
     *  [startDate, endDate]
     *  [startDate]
     *  [days]
     **/
    var IPeriod = function () {

        this.attributes = {
            start: new IDate('today'),
            end: new IDate('today')
        };

        var args = arguments;

        /**
         * Если не указаны аргументы, то содаем период по-умолчанию
         */
        if (args.length == 0 || (args.length == 1 && !args[0])) {
            return this;
        }

        /**
         *
         */
        if (args[0] instanceof IPeriod) {

            this.attributes.start = new IDate(args[0].attributes.start);
            this.attributes.end = new IDate(args[0].attributes.end);

        } else if (args.length == 2 && typeof args[1] === 'number') {

            // установим начальную дату из первого аргумента
            this.attributes.start = new IDate(args[0]);

            // конечная = начальная + указанное кол-во дней
            this.attributes.end = this.attributes.start.getShifted({days: args[1]});
        } else {

            /**
             * ["12.01.2012 - 24.02.2012"]
             * ["12.01.2012 - today"]
             * ["12.01.2012"]
             */
            if (args.length == 1 && typeof args[0] === 'string' && args[0].replace(/[^0-9a-z]/ig, '').length > 0) {

                var periodArr = args[0].replace(/\s*/g, '').split(this.separator);

                this.attributes.start = new IDate(periodArr[0]);
                this.attributes.end = new IDate(periodArr[1] || 'today');

            } else {
                if (typeof args[0] === 'string' || (typeof args[0] === 'object' && !(args[0] instanceof Array))) {

                    this.attributes.start = new IDate(args[0]);
                    this.attributes.end = new IDate(args[1] || 'today');

                } else if (args.length == 1 && typeof args[0] === 'number') {

                    this.attributes.start = new IDate('today');

                    this.attributes.end = this.attributes.start.getShifted({
                        days: args[0]
                    });
                }
            }
        }

        // начальная больше конечной - перевернем
        if (this.getUnitDifference('days') < 0) {
            this.reverse();
        }

        return this;
    };

    IPeriod.prototype = {
        separator: '-',
        dateFormat: 'dd.mm.yyyy',

        /**
         * Меняет местами дату начала и конца периода
         * @private
         */
        reverse: function () {
            var tmp = this.attributes.end;
            this.attributes.end = this.attributes.start;
            this.attributes.start = tmp;

            return this;
        },

        /**
         * @description Возвращает разницу дат в периоде, end - start,
         *  {years, months, days, hours, minutes, seconds, ms}
         * @returns {*}
         */
        getDifference: function () {
            return this.attributes.end.getDifference(this.attributes.start);
        },

        /**
         * Возвращает разницу дат в периоде в указанных едтиницах
         * @param units
         * @returns {*}
         */
        getUnitDifference: function (units) {
            if (units == null) {
                units = 'days';
            }

            return this.attributes.end.getUnitDifference(this.attributes.start, units);
        },

        /**
         * @description проверка на валидность периода. Если указать количество дней, то выполнится проверка на количество дней в периоде
         * @param days
         * @returns {boolean}
         */
        validate: function (days) {
            if (!this.attributes.start.validate(this.dateFormat) || !this.attributes.end.validate(this.dateFormat)) {
                return false;
            }

            if (typeof days === 'number') {
                if (this.attributes.start.getUnitDifference(this.attributes.end, 'days') != days) {
                    return false;
                }
            }

            return true;
        },

        /**
         *
         * @param dateFormat
         * @param separator
         * @returns {string}
         */
        toString: function (dateFormat, separator) {

            if (typeof dateFormat !== "string") {
                dateFormat = this.dateFormat;
            }

            if (typeof separator !== "string") {
                separator = this.separator;
            }

            return this.attributes.start.toString(dateFormat) + separator + this.attributes.end.toString(dateFormat);
        },

        /**
         *
         * @returns {string}
         */
        toHtml: function () {
            return "<span>" + this.toString.apply(this, arguments) + "</span>";
        },

        /**
         * @description возвращает период в 1 месяц.
         * @param type null || "start" - месяц начальной даты, "end" - месяц конечной даты
         * @returns {IPeriod}
         */
        getMonthPeriod: function (type) {

            var period = new IPeriod(this);

            if (typeof type !== "string" || type.toLowerCase() == "start") {

                period.attributes.start.set('date', 1);
                period.attributes.end = period.attributes.start.getShifted({days: period.attributes.start.getDaysInMonth() - 1});
            } else {

                period.attributes.start.set('date', 1);
                period.attributes.end = period.attributes.end.getShifted({days: period.attributes.end.getDaysInMonth() - 1});
            }

            return period;
        },

        /**
         * @description Добавляет к периоду указанное кол-во дней/месяцев.. = this + counts,
         *  counts =  {years, months, days, hours, minutes, seconds, ms} || date(int)
         * @param counts
         * @returns {IPeriod}
         */
        getShifted: function (counts) {

            var period = new IPeriod(this);

            period.attributes.start = period.attributes.start.getShifted(counts);
            period.attributes.end = period.attributes.end.getShifted(counts);

            return period;
        },

        /**
         *
         * @param period
         * @returns {boolean|*|Boolean}
         */
        is: function (period) {
            var _period = new IPeriod(period);

            return (
                this.validate() && _period.validate()
            ) && (
                this.attributes.end.is(_period.attributes.end, 'dd.mm.yyyy')
                    && this.attributes.start.is(_period.attributes.start, 'dd.mm.yyyy')
            );
        },

        /**
         *
         * @param attribute
         * @returns {*}
         */
        get: function (attribute) {
            return this.attributes[attribute];
        },

        /**
         *
         * @param attribute
         * @param value
         */
        set: function (attribute, value) {
            this.attributes[attribute] = value;
        },

        /**
         * @description Количество дней в периоде
         * @param options
         *  - isRounded - возвращать округлённое кол-во дней или нет
         * @return {Number}
         */
        getDaysCount: function (options) {
            options = options || {};

            return Math[options.isRounded ? 'round' : 'ceil'](
                (
                    this.attributes.end.getMilliseconds() - this.attributes.start.getMilliseconds()
                ) / (1000 * 60 * 60 * 24)
            );
        }
    };

    root.IPeriod = IPeriod;
}(this));