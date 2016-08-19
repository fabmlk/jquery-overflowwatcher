/**
 * Simple plugin to detect when an element overflows to trigger a 'fab.overflow' event on the element.
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

    /**
     * Keep tracks of all sensors added.
     * @type {Array}
     */
    var sensorsList = [],

        /**
         * The function that detects overflow based on ResizeSensor change size detection.
         *
         * @param {Array} slackness
         */
        triggerIfOverflow = function (slackness) {

            if (this.scrollWidth + slackness[0] > this.clientWidth || this.scrollHeight + slackness[1] > this.clientHeight) {
                $(this).trigger("fab.overflow");
            }
        }

    /**
     * Options:
     *  - slackness property:
     *          An array of 2 integers that tells how many pixels we can spare when detecting the overflow.
     *          A positive integer tells we can spare some overflown extra pixels.
     *          A negative integer tells we must detect the overflow early.
     *          The first element is the width overflow, the 2nd the height overflow.
     *          When used, both integers must be present.
     *
     *  - string "detach":
     *          Use it to detach the plugin and overflow detection
     *
     * @param options
     */
    $.fn.overflowWatcher = function (options) {
        if (options === "detach") {
            // find the jquery element, detach its sensor, and remove it from the list of sensors
            var index = sensorsList.indexOf(this.resizeSensor);
            if (index !== -1) {
                sensorsList[index].detach();
                sensorsList.splice(index, 1);
            }
            return this;
        }

        var slackness = (options || {}).slackness || [0, 0];

        // save instance on the jquery element and let ResizeSensor do its job to call our triggerIfOverflow callback on resize.
        this.resizeSensor = new ResizeSensor(this[0], triggerIfOverflow.bind(this[0], slackness));

        // save the sensor in our list
        sensorsList.push(this);

	return this;
    };
}));
