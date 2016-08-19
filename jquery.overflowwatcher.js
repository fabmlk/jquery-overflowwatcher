/**
 * TODO
 *
 * It's a simple wrapper around ResizeSensor lib used in css-element-queries project: https://github.com/marcj/css-element-queries.
 * The up-to-date ResizeSensor can be found at:
 * https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
 *
 * For now, it doesn't use it as an npm dependency. Instead it is simply included.
 */
(function(root,  factory ) {
    if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define([
            "jquery",
            "./external/ResizeSensor.js"
        ], factory );
    } else if(typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require("jquery"), require("./external/ResizeSensor.js"));
    } else {
        // Browser globals
        factory( jQuery , root.ResizeSensor);
    }
}(this, function($ ,ResizeSensor) {
    // detect simple overflow by default
    var defaults = {
        width: 0,
        height: 0,
        threshold: "down"
    },

        /**
         * TODO
         *
         * @param reference
         * @param thresholdWidth
         * @param thresholdHeight
         * @param thresholdDirection
         */
        checkSpaceAvailable = function (reference, thresholdWidth, thresholdHeight, thresholdDirection) {
            var widthAvailable =  reference.outerWidth() - this.outerWidth(),
                heightAvailable = reference.outerHeight() - this.outerHeight(),
                eventParams = {}
                ;

            if (thresholdWidth) {
                if (thresholdDirection === "up" && widthAvailable > thresholdWidth
                    || thresholdDirection === "down" && widthAvailable < thresholdWidth) {
                    eventParams.widthAvailable = widthAvailable;
                }
            }

            if (thresholdHeight) {
                if (thresholdDirection === "up" && heightAvailable > thresholdHeight
                    || thresholdDirection === "down" && heightAvailable < thresholdHeight) {
                    eventParams.heightAvailable = heightAvailable;
                }
            }

            this.trigger("relativeoverflow", eventParams);
        },

        destroy = function () {
            this.resizeSensor.detach();
            delete this.options;
            delete this.resizeSensor;
        }

    ;

    /**
     * TODO
     *
     * @param options
     * @returns {$.fn}
     */
    $.fn.overflowWatcher = function (options) {
        var element = this;

        if (options === "destroy") {
            destroy.call(element);

            return element;
        }

        options = $.extend({}, defaults, options || {});

        element.options = options;

        element.options.reference = options.reference || element.parent();

        // save instance on the jquery element and let ResizeSensor do its job to call our callbacks on resize.
        element.resizeSensor = new ResizeSensor(element[0], checkSpaceAvailable.bind(element,
            element.options.reference,
            element.options.width,
            element.options.height,
            element.options.threshold));

	    return element;
    };
}));
