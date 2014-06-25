(function (window, document, root) {
    "use strict";

    /**
     * @author Knyazevich  Denis
     * @type {*}
     */
    var iURL = {
        /**
         *
         * @param name
         * @returns {*}
         */
        get: function (name) {
            if (!name || !document.location.search) {
                return null;
            }

            name = name.toLowerCase();

            var _stringWithParams = (document.location.search.toLowerCase().replace(/^\?/, '')),
                _params = _stringWithParams.split('&'),
                result = null,
                i,
                len = _params.length;

            for (i = 0; i < len; i++) {
                if (typeof _params[i] === 'string') {
                    var _data = _params[i].split('=');

                    if (_data[0] == name) {
                        result = _data[1] || null;
                        break;
                    }
                }
            }

            return result;
        },

        /**
         * есть ли get-параметры
         */
        hasParams: function () {
            return !!document.location.search.replace(/^\?/, '');
        },

        /**
         *
         * @returns {{}}
         */
        getSearchParams: function () {
            var data = {},
                searchString,
                searchParamsSection,
                i,
                len,
                searchParamsData;

            if (document.location.search) {
                searchString = document.location.search.replace(/^\?/, '').replace(/\&$/, '');
                searchParamsSection = searchString.split("&");
                len = searchParamsSection.length;

                for (i = 0; i < len; i++) {
                    searchParamsData = searchParamsSection[i].split("=");
                    data[searchParamsData[0]] = searchParamsData[1] ? decodeURIComponent(searchParamsData[1]) : "";
                }
            }

            return data;
        }
    };

    (root || window).iURL = iURL;
}(window, document, this));
