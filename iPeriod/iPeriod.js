/**
 * need: iDate, jQuery
 * @arguments:
 *  [iPeriod]
 *  [startDate, days]
 *  ["12.01.2012 - today"]
 *  [startDate, endDate]
 *  [startDate]
 *  [days]
 **/

function iPeriod(){

    this.attributes = {
        start : new iDate('today'),
        end : new iDate('today')
    };


	// ----------------------------------
	// [iPeriod]	
	if(arguments[0] instanceof iPeriod){
	
        this.attributes.start = new iDate(arguments[0].attributes.start);
        this.attributes.end = new iDate(arguments[0].attributes.end);
       
	}
	
	
	// ----------------------------------
	// [startDate, days]
	// = (startDate, startDate+days)
	else if(arguments.length == 2 && typeof arguments[1] === 'number'){

		// установим начальную дату из первого аргумента
		this.attributes.start = new iDate(arguments[0])
		
		// конечная = начальная + указанное кол-во дней
		this.attributes.end	= this.attributes.start.getShifted({days: arguments[1]})
		
	}



	// ----------------------------------
	// ["12.01.2012 - 24.02.2012"]
	// ["12.01.2012 - today"]
	// ["12.01.2012"]
	else if(arguments.length == 1 && typeof arguments[0] === 'string' && arguments[0].replace(/[^0-9a-z]/ig, '').length > 0){
	
		var periodArr = arguments[0].replace(/\s*/g, '').split(this.separator);
		
        this.attributes.start = new iDate(periodArr[0]);
        this.attributes.end = new iDate(periodArr[1] || 'today');

	}



	// ----------------------------------
	// [startDate, endDate]
	// = (startDate, endDate)
	//
	// [startDate]
	// = (startDate, today)
	else if(typeof arguments[0] === 'string' || arguments[0] instanceof iDate){
		
		this.attributes.start	= new iDate(arguments[0]);
		this.attributes.end		= new iDate(arguments[1] || 'today');

	}



	// ----------------------------------
	// [days]
	// = (today, today+days)
    else if(arguments.length == 1 && typeof arguments[0] === 'number'){
	
        this.attributes.start = new iDate('today');
		
        endDate = this.attributes.start.getShifted({days: arguments[0]})
      
    }
	
	
	
	// неподдерживаемый формат
	else
		_error('iPeriod: Check arguments ['+arguments[0]+ (arguments.length <= 1 ? '' : ', '+arguments[1] )+']')
		
		
	// проверим результат
	if(!this.validate())
		_error('iPeriod: period from arguments ['+arguments[0]+ (arguments.length <= 1 ? '' : ', '+arguments[1] )+'] is invalid')
	
	
	// начальная больше конечной - перевернем
	if(this.getUnitDifference('days') < 0 )
		this._reverse()
	
}



iPeriod.prototype = {


	separator:	'-',
	dateFormat:	'dd.mm.yyyy',
	
	

	// Меняет местами дату начала и конца периода
    _reverse : function(){
	
		var tmp = this.attributes.end
		this.attributes.end = this.attributes.start
		this.attributes.start = tmp
    },



	// Возвращает разницу дат в периоде
	// end - start
	// = {years, months, days, hours, minutes, seconds, ms}
    getDifference : function(){
	
        return this.attributes.end.getDifference(this.attributes.start);
    },

	
	
	// Возвращает разницу дат в периоде в указанных едтиницах
	getUnitDifference : function(units){
	
		if(typeof units === 'undefined')
			var units = 'days';
			
		return this.attributes.end.getUnitDifference(this.attributes.start, units);
    },



    // проверка на валидность периода. Если указать количество дней, то выполнится проверка на количество дней в периоде
    validate : function(days){
	
		// проверим отдельные даты
		if (!this.attributes.start.validate(this.dateFormat) || !this.attributes.end.validate(this.dateFormat))
			return false;

        if(typeof days === 'number')
			if (this.attributes.start.getUnitDifference(this.attributes.end, 'days') != days)
                return false;
        
        return true;
    },

	
	
	toString : function(dateFormat, separator){
	
		if(typeof dateFormat !== "string")
			dateFormat = this.dateFormat;
		
		if(typeof separator !== "string")
			separator = this.separator;

		return this.attributes.start.toString(dateFormat)+
			(separator)+
            this.attributes.end.toString(dateFormat);
    },

	
    // возвращает период в 1 месяц.
	// @type = null || "start" - месяц начальной даты
	// @type = "end" - месяц конечной даты
    getMonthPeriod : function(type){

        var period = new iPeriod(this);

		if(typeof type !== "string" || type.toLowerCase() == "start") {

			period.attributes.start.set('date', 1);
			period.attributes.end = period.attributes.start.getShifted({days: period.attributes.start.getDaysInMonth() - 1})
		}
		else{

			period.attributes.start.set('date', 1);
			period.attributes.end = period.attributes.end.getShifted({days: period.attributes.end.getDaysInMonth() - 1})
		}

        return period;
    },

	
	// Добавляет к периоду указанное кол-во дней/месяцев..
	// = this + counts
	// counts =  {years, months, days, hours, minutes, seconds, ms} || date(int)
    getShifted : function(counts){
	
        var period = new iPeriod(this);
		
		period.attributes.start = period.attributes.start.getShifted(counts)
		period.attributes.end = period.attributes.end.getShifted(counts)

        return period;
    },

    is : function(period){
        var _period = new iPeriod(period);

        if(this.validate() && _period.validate()){
            return (this.attributes.end.is(_period.attributes.end, 'dd.mm.yyyy')
                && this.attributes.start.is(_period.attributes.start, 'dd.mm.yyyy'));
        }else{
            return false;
        }
    },

    get : function(attribute){
        return this.attributes[attribute];
    },

    set : function(attribute, value){
        this.attributes[attribute] = value;
    }
};
