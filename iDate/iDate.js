/**
 * @author Knyazevich Denis, Pulyaev Yuriy
 * Currency Parser|normalizator
 * need:	log.js
 * use:		a = new iDate('1.01.2012 12:38')
 * a.toString('dd.mm.yyyy HH:MM:ss.l')
 * @param val
 * @return {*}
 */

iDate = function (val) {

    // copy attributes
	this.attributes = {};
	_this.attributes = this._extendParams(_this.attributes, this.defaults);


	/**
	 * param is undefined
	 */
	if (typeof val === 'undefined') {
		this._setDate(new Date());
	} else if (typeof val === 'object' && val instanceof iDate) {
		/**
		 * 	param is iDate
		 */
		this.attributes = this._extendParams({}, val.attributes);
		return this;
	}else if(typeof val === 'number' || val === 'today' || val === 'tomorrow' || val === 'yesterday'
        || val === 'now') {
	
		var newDate;
        var today = new Date();

        if(val === 'tomorrow'){
            newDate = new Date(today.getFullYear(), today.getMonth(),
                today.getDate()+1, 0,0,0,0);
        }else if(val === 'yesterday'){
            newDate = new Date(today.getFullYear(), today.getMonth(),
                today.getDate()-1, 0,0,0,0);
        }else if(val === 'today'){
            newDate = new Date(today.getFullYear(), today.getMonth(),
                    today.getDate(), 0,0,0,0);
        }else if(val === 'now'){
            newDate = new Date()
        }else if(typeof val === 'number'){
            newDate = new Date(+(new Date()) + val*60*60*24*1000);
            newDate.setHours(0);
            newDate.setMinutes(0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
        }

		this._setDate(newDate);
	} else if(val instanceof Date){
        this._setDate(val);
    } else if(typeof val === 'string' ) {
	
		var parsedDate = false;
		var parsedTime = false;

		/**
		 * parse date
		 */
		for (var i = 0, len = this.parsers.date.length; i < len && !parsedDate && this.parsers.date[i]; i++) {
			parsedDate = this.parsers.date[i].call(this, val);
		}

		/**
		 * parse time
		 */
		for (var i = 0, len = this.parsers.time.length; i < len && !parsedTime; i++) {
			parsedTime = this.parsers.time[i].call(this, val);
		}

		/**
		 * check date, f.e. 31.02.1991
		 * @type {Date}
		 */
		var someDate =
			new Date(this.attributes.year.val, (this.attributes.month.val || 1) - 1, this.attributes.date.val || 1);
		
		if (someDate.getDate() != (this.attributes.date.val || 1)
			|| someDate.getMonth()+1 != (this.attributes.month.val || 1)
            || someDate.getFullYear() != this.attributes.year.val) {
			
			_error('iDate: Date "'+val+'" is invalid');

            for (var attr in this.attributes) {
                if (typeof this.attributes[attr].val !== 'undefined') {
                    this.attributes[attr].val = null;
				}
            }
        }
		
		if(!parsedDate && !parsedTime) {
			_error('iDate: Check date "'+val+'"');
		}
	}
}

iDate.prototype = {

	/**
	 * default string formats
 	 */
	dateFormat:		'dd.mm.yyyy',
	timeFormat:		'HH:MM',
	fullFormat:		'dd.mm.yyyy HH:MM',
	timestampFormat:	"yyyy-mm-dd'T'HH:MM:ssZ",
	formatSplitterReg:	/^dd|mm|yyyy|yy|HH|MM|ss|l|'[^']+'|"[^"]+"|./,
	formatReg:			/^dd|mm|yyyy|yy|HH|MM|ss|l$/,
	parsers:	{
		
		date:	[
			/**
			 * yyyymm
			 * @param dateStr
			 * @return {Boolean}
			 */
			function(dateStr){
				
				var reg = (/((19|20)[0-9]{2})(0[1-9]|1[0-2]|[1-9])/);
				
				
				if(reg.test(dateStr)){
					var arr = reg.exec(dateStr);
					
					this.set('month', (+arr[3]));
					this.set('year', (+arr[1]));
					
					return true;
				}
					
				return false;
			},

			/**
			 * yyyy-mm-dd
			 * @param dateStr
			 * @return {Boolean}
			 */
			function(dateStr){
				
				// do not use 0? for month or date at first position
				var reg = (/((19|20)[0-9]{2})[\.\-]?(0[1-9]|1[0-2]|[1-9])[\.\-]?(0[1-9]|[12][1-9]|3[01]|[1-9])/);
				
				
				if(reg.test(dateStr)){
					var arr = reg.exec(dateStr);
					
					this.set('date', (+arr[4]));
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
			function(dateStr){
				
				var reg =
					(/(^|\s)(0[1-9]|[12][0-9]|3[01]|[1-9])[\.\-](0[1-9]|1[0-2])([\.\-]?((19|20)[0-9]{2}|[0-9]{2}))?($|\s)/);
				
				if(reg.test(dateStr)){
					var arr = reg.exec(dateStr)
					
					this.set('date', (+arr[2]));
					this.set('month', (+arr[3]));
					
					if(arr[5]){
						this.set('year', (+arr[5]));
					}

					return true;
				}
					
				return false;
			},

			/**
			 * 28 окт 2010,Чт 17:56:30
			 * @param dateStr
			 * @return {Boolean}
			 */
            function(dateStr){

                var reg = (/^(\d+)(?:\s+)([А-Яа-яA-Za-z]+)(?:\s+)(\d+)\,([А-Яа-яA-Za-z]+)(?:\s+)([0-9\:]+)/i);

                if(reg.test(dateStr)){
                    var arr = reg.exec(dateStr);

                    var monthIndex =  this._getMonthIndexByName(arr[2]);
                    if(monthIndex !== null)
                        this.set('month', monthIndex);

                    this.set('date', (+arr[1]));
                    this.set('year', (+arr[3]));

                    var time = arr[5].split(':');
                    if(time.length){
                        this.set('hours', (+time[0]));
                        this.set('minutes', (+time[1]));
                        this.set('seconds', (+time[2]));
                    }

                    return true;
                }

                return false;
            }
		],
		
		time:	[
			
			// HH:MM:ss.l
			function(dateStr){
				
				var reg =
					(/(0[0-9]|1[0-9]|2[0-3]|[0-9]):(0[0-9]|[1-5][0-9]|[0-9])(:(0[0-9]|[1-5][0-9]|[0-9]))?(\.([0-9][0-9][0-9]|[0-9][0-9]|[0-9]))?/);

				if(reg.test(dateStr)){
					var arr = reg.exec(dateStr);
					
					this.set('hours', (+arr[1]));
					this.set('minutes', (+arr[2]));
					
					if(arr[4])
						this.set('seconds', (+arr[4]));
					
					if(arr[6])
						this.set('ms', (+arr[6]));
					
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
	defaults:	{
		date:		{
			isDefault: true, 
			masks: {dd: function(val){return this._addZeros(val || 1, 2)}}},
		month:		{
			isDefault: true, 
			masks: {mm: function(val){return this._addZeros(val || 1, 2)}}
			},
		year:		{
			isDefault: true, 
			masks: {
				yy: function(val){
				
					if(!val && val != 0)
						var val = (new Date()).getFullYear()
					
					return this._addZeros(val.toString().substring(val.toString().length - 2), 2)
					
					},
				yyyy: function(val){
				
					if(!val && val != 0)
						var val = (new Date()).getFullYear()
					
					return this._addZeros(val, 4)
					
					}
				}
			},
		hours:		{
			isDefault: true, 
			masks: {HH: function(val){return this._addZeros(val || 0, 2)}}
			},
		minutes:	{
			isDefault: true, 
			masks: {MM: function(val){return this._addZeros(val || 0, 2)}}
			},
		seconds:	{
			isDefault: true, 
			masks: {ss: function(val){return this._addZeros(val || 0, 2)}}
			},
		ms:			{
			isDefault: true, 
			masks: {l:  function(val){return this._addZeros(val || 0, 3)}}
			}
	},

	/**
	 * Получаем номер месяца (от 1 до 12) в зависимости от имени
	 * @param monthName
	 * @return {null}
	 * @private
	 */
    _getMonthIndexByName : function(monthName){
        var monthMasks = {
            '1'  : [/янв/gi, /jan/gi],
            '2'  : [/фев/gi, /feb/gi],
            '3'  : [/мар/gi, /mar/gi],
            '4'  : [/апр/gi, /apr/gi],
            '5'  : [/май/gi, /may/gi],
            '6'  : [/июн/gi, /jun/gi],
            '7'  : [/июл/gi, /jul/gi],
            '8'  : [/авг/gi, /aug/gi],
            '9'  : [/сен/gi, /sep/gi],
            '10' : [/окт/gi, /oct/gi],
            '11' : [/ноя/gi, /nov/gi],
            '12' : [/дек/gi, /dec/gi]
        };

        var monthIndex = null;

        loop : for(var index in monthMasks){
            var len = monthMasks[index].length;
            if(len){
                for(var i = 0; i < len; i++){
                    if(monthMasks[index][i].test(monthName)){
                        monthIndex = +index;
                        break loop;
                    }
                }
            }else{
                if(monthMasks[index][len].test(monthName)){
                    monthIndex = +index;
                    break loop;
                }
            }
        };

        return monthIndex;
    },


	/**
	 * Array of masks and splitters
	 * @param format = some kind of 'dd.mm.yyyy HH:MM'
	 * @return {Array}
	 * @private
	 */
	_splitFormat:	function(format) {
	
		var f = format
		var splittedArr = []
		
		while( this.formatSplitterReg.test(f) ){
			
			splittedArr.push(this.formatSplitterReg.exec(f)[0])
			
			f = f.replace(this.formatSplitterReg, '')
		}
		
		if(f.length)
			_error('iDate: Check date format "'+format+'"')
		
		if(!splittedArr.length)
			_error('iDate: Format "'+format+'" is not supported or returns empty date')
			
		return splittedArr;
        
    },

	/**
	 * String like '00023'
	 * @param num : Float || Int
	 * @param length : of string vs zeros
	 * @return {String}
	 * @private
	 */
	_addZeros:	function(num, length) {
	
		var ret = num.toString();
		
		while(ret.length < length)
			ret = '0' + ret;
			
		return ret;
        
    },

	/**
	 * Set date to attributes
	 * @param date
	 * @private
	 */
	_setDate: function(date) {
		
		this.set('date', date.getDate())
		this.set('month', date.getMonth() + 1)
		this.set('year', date.getFullYear())
		this.set('hours', date.getHours())
		this.set('minutes', date.getMinutes())
		this.set('seconds', date.getSeconds())
		this.set('ms', date.getMilliseconds())
	},

	/**
	 * set attribute
	 * @param key : '' || {key: val}
	 * @param val
	 * @return {Boolean}
	 */
	set: 	function(key, val) {

		/**
		 * key is object?
		 */
		if( typeof key === 'object' && typeof val === 'undefined' ){
			for(var i in key)
				this.set(i, key[i]);
			
			return false;
		}

		/**
		 * inserting '12' year (mean '2012')
		 */
		if(key == 'year' && val.toString().length <= 2)
			val = ( (+val) < 70 ) ?
				2000 + val : 
				1900 + val

        if(key == 'month' && val < 1){
            val = 12;
            this.attributes.year.val = this.attributes.year.val - 1;
        }
		
		this.attributes[key].val = parseFloat(val);
        this.attributes[key].isDefault = false;

		return true;
    },

	/**
	 * get attribute
	 * @param key
	 * @return {String|null}
	 */
	get: 	function(key) {
        if(key.toLowerCase() == 'getdayofweek')
            return this.getDayOfWeek();
        else
		    return this.attributes[key].val || null;
    },

	/**
	 * Get full date string
	 * @param format : null || some kind of 'dd.mm.yyyy HH:MM'
	 * @return {String}
	 */
	toString:	function(format) {
	
		if(typeof format === 'undefined')
			var format = this.fullFormat;
			
			
		var splitted = this._splitFormat(format);
		var ret = '';
		
		while(splitted.length){
			
			var str = splitted.shift();
			var val = str;

			/**
			 * elem is a date mask
			 * try to find mask at attributes masks
			 */
			if(this.formatReg.test(str))
				for(var i in this.attributes)
					if(this.attributes[i].masks)
						for(var j in this.attributes[i].masks)
							if(j === str) 
								val = this.attributes[i].masks[j].call(this, this.attributes[i].val);
			
			
			ret += val.replace(/^'([^']+)'|"([^"]+)"$/, "$1$2");
		}
		
		return ret;
    },

	/**
	 * Get date only string
	 * @param format : null || some kind of 'dd.mm.yyyy'
	 * @return {String}
	 */
	date:	function(format) {
	
		if(typeof format === 'undefined')
			format = this.dateFormat;
			
		return this.toString(format);
    },

	/**
	 * Get time only string
	 * @param format null || some kind of 'HH:MM:ss.l'
	 * @return {String}
	 */
	time:	function(format) {
	
		format = format || this.timeFormat;
			
		return this.toString(format)
    },

	/**
	 * Get unix timestamp string
	 * @return {String}
	 */
	timestamp:	function() {
		return this.toString(this.timestampFormat)
    },

	/**
	 * Get date in milliseconds, since 1 january 1970
	 * @return {Date}
	 */
    getMilliseconds : function(){
		
		var arr = this.toString('yyyy mm dd HH MM ss l').split(' ');
		arr[1]--;
		return Date.parse(new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7] ));
    },

	/**
	 * returns the difference between dates
	 * @param date : {years, months, days, hours, minutes, seconds, ms}
	 * @return {*}
	 */
    getDifference : function(date){
	
		if (!date)
			return null;

        if(!(date instanceof iDate))
			var date = new iDate(date);

        return {
			years:	this.get('year') - date.get('year'), 
			months:	this.get('month') - date.get('month'), 
			days:	this.get('date') - date.get('date'), 
			hours:	this.get('hours') - date.get('hours'), 
			minutes:	this.get('minutes') - date.get('minutes'),  
			seconds:	this.get('seconds') - date.get('seconds'),  
			ms:		this.get('ms') - date.get('ms')
		} ;
    },

	/**
	 * returns the difference between dates at specified units
	 * @units default is "days"
	 * @param date
	 * @param units : "years" || "months" || "days" || "hours" || "minutes" || "seconds" || "ms"
	 * @return {*}
	 */
	getUnitDifference : function(date, units){
		
		if (!date)
			return null;
	
		if(typeof units === 'undefined')
			var units = 'days';

        if(!(date instanceof iDate))
			var date = new iDate(date);
        
		switch(units.toLowerCase()){
			case 'years':
				return this.get('year') - date.get('year');
			case 'months':
				return this.get('month') - date.get('month') + (this.get('year') - date.get('year')) * 12;
			case 'hours':
				return (this.getMilliseconds() - date.getMilliseconds() ) / (60*60*1000);
			case 'minutes':
				return (this.getMilliseconds() - date.getMilliseconds() ) / (60*1000);
			case 'seconds':
				return (this.getMilliseconds() - date.getMilliseconds() ) / 1000;
			case 'ms':
				return this.getMilliseconds() - date.getMilliseconds();
			case 'days':
			default:
				return (this.getMilliseconds() - date.getMilliseconds() ) / (60*60*24*1000);
		}
    },

    /**
     * возвращает количество дней в месяце
     * @params - month : 1-12. Если не указан, то берется текущий месяц
     */
    getDaysInMonth : function(month){
	
        month = (!isNaN(month)) ? month : this.get('month');

		// создадим дату следующего месяца и отнимем от нее 1 день (0)
        return new Date(this.get('year'), month, 0).getDate();
    },

    /**
     * возвращает iDate + указанное кол-во дней, месяцев..
     * @counts = {years, months, days, hours, minutes, seconds, ms} || date(int)
     */
    getShifted : function(counts){
	
		var shifted = new iDate();
	
		if( typeof counts === 'number')
			var counts = {
				day: counts
			};
			
		shifted._setDate( new Date(this.get('year') + (counts.years || 0), 
			this.get('month') + (counts.months || 0) - 1, 
			this.get('date') + (counts.days || 0), 
			this.get('hours') + (counts.hours || 0), 
			this.get('minutes') + (counts.minutes || 0), 
			this.get('seconds') + (counts.seconds || 0), 
			this.get('ms') + (counts.ms || 0)) )

		return shifted;
    },

	/**
	 *
	 * @return {Number}
	 */
    getDayOfWeek : function(){
        return new Date(this.get('year'), this.get('month')-1, this.get('date')).getDay();
    },

	/**
	 * Check data by mask
	 * @format = null || some kind of 'dd.mm.yyyy HH:MM'
	 * @param format
	 * @return {Boolean}
	 */
	validate:	function(format) {
	
		if(typeof format === 'undefined')
			format = this.fullFormat;
			
		var splitted = this._splitFormat(format);
		
		while(splitted.length){
			
			var str = splitted.shift();
			
			// elem is a date mask
			// try to find mask at attributes masks
			if(this.formatReg.test(str))
				for(var i in this.attributes)
					if(this.attributes[i].masks)
						for(var j in this.attributes[i].masks)
							if(j == str && (!this.attributes[i].val && this.attributes[i].val != 0) )
								return false;
		}
		
		return true;
    },

	/**
	 * Date is equal
	 * @param date
	 * @param format
	 * @return {Boolean}
	 */
    is : function(date, format){
        var result = true;
        format = format || this.dateFormat;

        date = new iDate(date);

        var isValid = (format) ? date.validate(format) : date.validate();

        if(isValid){
            if(format){
                result = (this.toString(format) == date.toString(format));
            }
        }else{
            result = false;
        }

        return result;
    },

	_objectInherit: function(obj){
		var F = function () {};
		F.prototype = obj;
		return new F();
	},

	/**
	 *
	 * @private
	 */
	_extendParams : function(firstObject, secondObject){
		var newObject = this._objectInherit(firstObject);

		for (var prop in secondObject) {
			if (secondObject.hasOwnProperty(prop)) {
				newObject[prop] = secondObject[prop];
			}
		}

		return newObject;
	}
}