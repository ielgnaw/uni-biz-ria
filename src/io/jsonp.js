/**
 * @file jsonp 请求封装
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var Deferred = require('er/Deferred');
    var util = require('er/util');
    var shim = require('./shim');

    function jsonpErrorHanlder(deferred, error) {
        deferred.reject(error);
    }

    function jsonpSuccessHandler(deferred, result) {
        if (!result || result.status !== 200) {
            deferred.reject(result);
            return;
        }
        deferred.resolve(result.data);
    }

    return {

        /**
         * 发送 jsonp 请求
         *
         * @param {string} url 请求地址
         * @param {object} options 配置参数
         * @param {object} options.callback jsonp 接受的回调参数名称
         *                      例如：
         *                      后端需要指定参数 cb=xxx 作为回调入口
         *                      xxx 会由 jsonp 模块自动生成
         *                      那么这里填写 callback: 'cb'
         * @return {promise}
         */
        request: function (options) {
            var deferred = new Deferred();
            var url = options.url;
            var data = options.data;
            var callback = options.callback;
            var name = 'zq_jsonp_' + new Date().getTime().toString(36);

            url += url.indexOf('?') > 0 ? '&' : '?';
            url += shim.jsonToQuery(data);
            url += '&' + callback + '=' + name;

            var script = document.createElement('script');
            script.src = url;

            // jsonp 加载成功回调函数
            window[name] = util.bind(
                jsonpSuccessHandler,
                null,
                deferred
            );

            // jsonp 网络出错回调函数
            script.onerror = util.bind(
                jsonpErrorHanlder,
                null,
                deferred
            );

            document.body.appendChild(script);

            // 清除 jsonp 回调函数
            deferred.ensure(function () {
                delete window[name];
            });

            return deferred.promise;
        }
    };
});
