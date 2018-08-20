/*
 * @Author: guotq
 * @Date: 2018-08-17 14:21:23
 * @Last Modified by: guotq
 * @Last Modified time: 2018-08-20 11:21:49
 * @Description: 一些通用功能
 */

(function(win) {
    'use strict';

    win.Util = {
        os: {
            ie: function() {
                if ((window.ActiveXObject) || ("ActiveXObject" in window)) {
                    console.log(1);
                    return true;
                }

                return false;
            },

            chrome: function() {
                var nu = navigator.userAgent;

                if (nu.indexOf('Chrome')) {
                    return true;
                }
            }
        },

        extend: function() {
            var args = [].slice.call(arguments),
                result = args[0];

            for (var i = 1, len = args.length; i < len; i++) {
                var item = args[i];

                for (var k in item) {
                    if (result[k] == undefined) {
                        result[k] = item[k];
                    }
                }
            }

            return result;
        }
    };

}(this));
