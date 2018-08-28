/*
 * @Author: guotq
 * @Date: 2018-08-17 14:21:23
 * @Last Modified by: guotq
 * @Last Modified time: 2018-08-28 14:52:09
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
        },

        getDate: function(millisecond) {
            var date = new Date(millisecond);
            var appendZero = this.appendZero;

            return date.getFullYear() + '-' + appendZero(date.getMonth() + 1) + '-' + appendZero(date.getDate()) + ' ' + appendZero(date.getHours()) + ':' + appendZero(date.getMinutes()) + ':' + appendZero(date.getSeconds());
        },

        appendZero: function(sum) {
            if (sum < 10) {
                return '0' + sum;
            }
            
            return sum;
        },

        base64ToBlob: function(b64) {    
            // 解码 b64 并且转换成 btype
            // 注意，这边 atob 必须解码的是没有 url 部分的 base64 值，如果带有 url 部分，解码会报错！
            var btypes = window.atob(b64);
            
            // 处理异常，将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(btypes.length);
            // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
            var ia = new Uint8Array(ab);
            
            for (var i = 0, len = btypes.length; i < len; i++) {
                ia[i] = btypes.charCodeAt(i);
            }
            
            return new Blob([ab], {
                type: 'application/x-x509-ca-cert'
            });
        }
    };

}(this));
