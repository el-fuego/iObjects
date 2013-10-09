/**
 * @author Knyazevich Denis
 */
(function (window, document, root) {
    "use strict";

    var iSelection = {
        /**
         *
         * @param input {HTMLInputElement|HTMLTextAreaElement}
         * @param position {Number}
         * @returns {HTMLInputElement|HTMLTextAreaElement}
         */
        moveSelectionTo: function (input, position) {
            var end = isNaN(position) ? input.value.length : position;

            if (input.setSelectionRange && input.selectionStart === null) {
                input.focus();
                input.setSelectionRange(end, end);
            } else if (input.createTextRange) {
                input.range = input.createTextRange();
                input.range.moveStart('character', -end);
                input.range.moveStart('character', end);
                input.range.moveEnd('character', 0);
                input.range.collapse(true);
                input.range.select();
            }

            return input;
        },

        /**
         *
         * @param inputObject {HTMLInputElement|HTMLTextAreaElement}
         * @returns {*}
         */
        getSelection: function (inputObject) {
            if (inputObject == null) {
                return null;
            }

            if (inputObject.selectionStart != null) {
                return {
                    start: inputObject.selectionStart,
                    end:   inputObject.selectionEnd
                };
            }

            if (document.selection) {

                var start = 0,
                    end = 0,
                    normalizedValue = '',
                    textInputRange = null,
                    endRange = null,
                    range = document.selection.createRange();

                if (range && range.parentElement() == inputObject) {
                    var len = inputObject.value.length;
                    normalizedValue = inputObject.value.replace(/\r\n/g, "\n");

                    textInputRange = inputObject.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());

                    endRange = inputObject.createTextRange();
                    endRange.collapse(false);

                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        start = len;
                        end = len;
                    } else {
                        start = -textInputRange.moveStart("character", -len);
                        start += normalizedValue.slice(0, start).split("\n").length - 1;

                        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            end = len;
                        } else {
                            end = -textInputRange.moveEnd("character", -len);
                            end += normalizedValue.slice(0, end).split("\n").length - 1;
                        }
                    }

                    return {
                        start: start,
                        end:   end
                    };
                }

                return null;
            }

            return null;
        },

        /**
         *
         * @param input {HTMLInputElement|HTMLTextAreaElement}
         * @param start
         * @param end
         * @returns {HTMLInputElement|HTMLTextAreaElement}
         */
        setSelection: function (input, start, end) {
            var length = input.value.length;
            start = isNaN(start) ? length : start;
            end = isNaN(end) ? length : end;

            if (input.selectionStart != null) {

                input.focus();

                input.setSelectionRange(start, end);

            } else if (input.createTextRange) {

                input.range = input.createTextRange();
                input.range.moveStart('character', -start);
                input.range.moveStart('character', start);
                input.range.moveEnd('character', end);
                input.range.collapse(true);
                input.range.select();

            }

            return input;
        }
    };

    (root || window).iSelection = iSelection;
}(window, document, this));