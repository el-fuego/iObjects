/**
 * @author Knyazevich Denis, Pulyaev Yuriy
 * Accounts Parser|normalizator
 * need:	log.js
 * objects:	iCard
 * use:		a = new iAccount('1234 12 34 12341234')
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
	if (typeof val === 'undefined') {
		_error('iAccount: Account is undefined');

		return;
	} else {
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

	/**
	 * not parsed propertly
	 */
	_error('iAccount: Invalid account "' + val + '"');

};

iAccount.prototype = {

	'val':	null,
	countBeforeSplitter:	4,
	minLength:	12,
	splitter:	'<span>',

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
		var str = str;
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

	formatters:	{

		/**
		 * For example, XXXX XXXX XXXX XXXX
		 * @param intStr
		 * @param splitter
		 * @return {String}
		 */
		full:	function(intStr, splitter) {
		
			return this._addSplitter(intStr, splitter);
		},

		/**
		 * For example, XXXX **** **** XXXX
		 * @param intStr
		 * @param splitter
		 * @return {String}
		 */
		hidden:	function (intStr, splitter) {
		
			var hidden = '';
			var i = intStr.length - this.countBeforeSplitter * 2;
			while (i--) {
				hidden += '*';
			}

			return this._addSplitter(intStr.substring(0, this.countBeforeSplitter) + hidden + intStr.substring(intStr.length - this.countBeforeSplitter, intStr.length), splitter);
		},

		/**
		 * For example, ** XXXX
		 * @param intStr
		 * @param splitter
		 * @return {String}
		 */
		short:	function (intStr, splitter) {
		
			return '**' + intStr.substring(intStr.length - this.countBeforeSplitter, intStr.length);
		}
	},

	/**
	 * Get string like '1234123412341234' a.toString('full' || 'hidden' || 'short')
	 * @return {null|String}
	 */
	toString:	function () {
		return this.val || '';
    },

	/**
	 * Get string like 	'1234 1234 1234 1234'
	 * or (by default)	'<span>1234</span><span class="hidden">1234</span><span class="hidden">1234</span><span>1234</span>'
	 * format =	null || "full" || "hidden" || "short"
	 * splitter =  null || " " || "<span>"
	 * @param format
	 * @param splitter
	 * @return {String}
	 */
	toHtml:	function (format, splitter) {

		/**
		 * default format
		 */
		if (typeof format === 'undefined' || !format) {
			format = 'full';
		}

		/**
		 * check format
		 */
		if (typeof format !== 'string') {
			_error('iAccount: Invalid format: "' + format + '"');
			return '';
		}
		
		if (typeof this.formatters[format] !== 'function') {
			_error('iAccount: Format "' + format + '" is unsupported');
			return '';
		}
		
		return this.formatters[format].call(this, this.val, splitter || this.splitter);
    },

	/**
	 * check digits count and first digit
	 * @return {Boolean}
	 */
	isCard: function() {

		// check digits count
		// check first digit
		return ([13, 14, 16, 19].indexOf(this.val.length) >= 0 &&
		       [3, 4, 5, 6, 7].indexOf(+this.val[0]) >= 0);

	},

    /**
     * check card's type on Visa
     * @return {Boolean}
     */
    isVisa : function() {
        return (this.val && [5, 6].indexOf(+this.val.substr(0, 1)) >= 0);
    },

    /**
     * check card's type on MasterCard
     * @return {Boolean}
     */
    isMasterCard : function() {
        return (this.val && +this.val.substr(0, 1) != 4);
    },

	/**
	 * check digits count
	 * @return {Boolean}
	 */
	isAccount: function() {

		/**
		 * check digits count
		 */
		return ([12, 14, 19].indexOf(this.val.length) >= 0);
	},

	/**
	 * Check account
	 * @return {Boolean}
	 */
	validate: function() {

		if (!this.val){
			return false;
		}

		/**
		 * Check type
		 */
		var isCard;
		if( !(isCard = this.isCard()) && !this.isAccount() )
			return false;

		/**
		 * Visa/MC card validation (Luhn Algorithm)
		 */
		if(isCard){

			var sum = 0;
			for (var i = 0; i < this.val.length; i++) {

				var p = parseInt(this.val[i]);
				if (i % 2 == 0) {
					p *= 2;
					if (p > 9)
						p -= 9;
				};

				sum += p;
			};

			return sum % 10 == 0
		};

        return true;

	},

	/**
	 * Compare accounts. True if equal
	 * @param account
	 * @return {Boolean}
	 */
	is:	function(account) {
        var number = new iAccount(account);
	
		return (number.val && (number.val == this.val));
    }
};

/**
 * Get Integer value
 * @return {Integer}
 */
iAccount.prototype.toInt =
iAccount.prototype.toInteger =
iAccount.prototype.toNubmer =
iAccount.prototype.toFloat = function() {
		
	if (this.val.length > 16){
		_error('iAccount: Value "'+this.val+'" is too long for Integer');
		return 0
	};

	return parseInt(this.val);
};

/**
 * Check account
 * @return {Boolean}
 */
iAccount.prototype.toBoolean = function() {
	return this.validate()
};