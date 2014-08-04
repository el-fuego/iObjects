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
        },

        replaceSearchParams: function (url, params) {
            var i,
                name,
                otherParams = [],
                paramsAsSearchString = '',
                searchQuerySplitter = '?',
                searchParamsSplitter = "&",
                searchDataSplitter = "=",
                searchString = '',
                urlData = url.split(searchQuerySplitter),
                searchData = (urlData[1] || "").split(searchParamsSplitter),
                len = searchData.length;

            for (i in params) {
                if (params.hasOwnProperty(i)) {
                    paramsAsSearchString += i + searchDataSplitter + params[i] + "&";
                }
            }

            paramsAsSearchString = paramsAsSearchString.replace(/\&$/, '');

            if (len < 2) {
                searchString = paramsAsSearchString;
            } else {
                for (i = len - 1; i >= 0; i--) {
                    name = searchData[i].split(searchDataSplitter)[0];

                    if (params[name] === undefined) {
                        otherParams.push(searchData[i]);
                    }
                }

                otherParams.push(paramsAsSearchString);

                searchString = otherParams.join(searchParamsSplitter);
            }

            return urlData[0] + searchQuerySplitter + searchString;
        }
    };

    (root || window).iURL = iURL;
}(window, document, this));
