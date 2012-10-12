/**
 * @author Knyazevich Denis, Pulyaev Yuriy
 * logging
 */
var _log = function(){

	if(window.DEBUG && window.console && window.console.info)
		for(var i =0; i<arguments.length; i++)
			window.console.info(arguments[i]);
		
}

/**
 * Функция логирования ошибок.
 *  Если выключен режим отладки, функция ничего не выведет.
 *  Если послетним аргументом указан флаг === true, то логирование будет выполняться даже при
 *  отключенном режиме отладки
 */
var _error = function(){

	if(!window.DEBUG && arguments[arguments.length-1] !== true)
		return;

	if(window.console && window.console.debug)
		for(var i =0; i<arguments.length; i++)
			window.console.debug(arguments[i])
		
	else if(typeof window.Error === 'function')
		for(var i =0; i<arguments.length; i++)
			new Error(arguments[i])
		
}

/**
 * set DEBUG true on test servers or DEBUG in location
 * @type {Boolean}
 */
window.DEBUG = ((/^localhost|10\./).test(document.location.host) || (/DEBUG/).test(document.location.href));