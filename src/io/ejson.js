/**
 * @file 请求发送器，遵循 E-JSON 规范
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var ajax = require('er/ajax');
    var Deferred = require('er/Deferred');
    var Dialog = require('esui/Dialog');

    var DEFAULT_ERROR_MSG = '服务异常，请稍后再试';

    /**
     * 常用的 biz 异常码以及提示内容
     *
     * 1001： 默认显示服务异常，请稍后再试，如果后端传来 statusInfo ，
     *        就弹出 statusInfo ，点击确定后刷新页面。
     *
     * 1002：未登录，直接跳转到后端传来的 statusInfo 里面的地址。
     *
     * 其他的非 0 状态码：默认显示系统异常，请稍后再试。如果后端传来 statusInfo，
     * 就弹出 statusInfo ，点击确定后不刷新页面。
     *
     * @type {Object}
     */
    var BIZ_STATUS_ERROR = {
        1001: DEFAULT_ERROR_MSG,  // 点击确定后刷新页面
        1002: '尚未登录，请登录',    // 未登录，直接跳转到后端传来的 statusInfo 里面的地址
        1100: DEFAULT_ERROR_MSG,  // 返回数据为空
        1101: DEFAULT_ERROR_MSG,  // 返回数据不存在 status 字段
        1102: DEFAULT_ERROR_MSG   // 不能转化为数字的 status 字段
    };

    /**
     * 获取一个 Object 的 E-JSON 状态码
     *
     * 如果 Object 不符合 E-JSON 的规范，会得到相应的错误码
     * 如果 Object 的业务逻辑错误，会得到相应的业务错误码
     *
     * 如果返回值为 0，表示即满足 E-JSON 格式规范并且后端业务处理正常
     *
     * @param {Object} obj
     * @return {number} 状态码
     */
    function getEjsonStatus(obj) {
        var bizErrorCode = 0;

        if (!obj) {
            bizErrorCode = 1100;
        }
        else if (typeof obj.status === 'undefined') {
            bizErrorCode = 1101;
        }
        else if (isNaN(obj.status - 0)) {
            bizErrorCode = 1102;
        }
        else if (obj.status > 0) {
            bizErrorCode = obj.status;
        }

        return bizErrorCode;
    }

    /**
     * 显示一个警告框
     *
     * @param {string|Object} bizStatusInfo 业务逻辑错误提示信息
     * @param {boolean} isRefresh 是否刷新当页
     */
    function showAlert(bizStatusInfo, isRefresh) {
        var options = {
            type: 'warning',
            content: bizStatusInfo,
            contentType: 'html'
        };
        var dialog = Dialog.alert(options);

        if (isRefresh) {
            dialog.on(
                'ok',
                function () {
                    setTimeout(
                        function () {
                            window.location.reload();
                        },
                        20
                    );
                }
            );
        }
    }

    var ejson = {};

    ejson.ajax = ajax;  // 把 er/ajax 对象挂载到 ejson 对象上

    /**
     * 把一些ioc的方法挂在到 ejson.hooks 上
     * 丰富 er/ajax 的 hooks
     *
     * 增加的 hooks ：
     *     afterComplete
     *     afterSuccess
     *     afterFailure
     *
     * @type {Object}
     */
    ejson.hooks = {};

    /**
     * ajax 请求完成处理函数
     *
     * @param {Object} data ajax 返回结果（已转为 json ）
     */
    function completeHandler(data) {
        if (typeof ejson.hooks.afterComplete === 'function') {
            ejson.hooks.afterComplete(data);
        }
        return data;
    }

    /**
     * ajax 失败处理函数
     *
     * @param {Object} data ajax 返回结果（已转为 json ）
     */
    function failureHandler(data) {
        completeHandler(data);
        return successHandler({});
    }

    /**
     * ajax 成功处理函数
     *
     * @param {Object} data ajax 返回结果（已转为 json ）
     */
    function successHandler(data) {
        var bizStatusCode = getEjsonStatus(data);

        if (!bizStatusCode) {
            var result = {};
            var resolveData = data.data;
            if (resolveData) {
                if (resolveData.list) {
                    if (typeof resolveData.list === 'object') {
                        result = resolveData.list;
                    }
                }
                else {
                    if (typeof resolveData === 'object') {
                        result = resolveData;
                    }
                }
            }

            if (typeof ejson.hooks.afterSuccess === 'function') {
                ejson.hooks.afterSuccess(data);
            }
            completeHandler(result);

            return Deferred.resolved(result);
        }

        var bizStatusInfo;

        switch (bizStatusCode) {
            case 1001:
                bizStatusInfo = data.statusInfo
                    ? data.statusInfo
                    : BIZ_STATUS_ERROR[bizStatusCode];
                showAlert(bizStatusInfo, true);
                break;
            case 1002:
                var redirectUrl = data.statusInfo;
                bizStatusInfo = BIZ_STATUS_ERROR[bizStatusCode];
                if (bizStatusInfo) {
                    setTimeout(
                        function () {
                            window.location.href = redirectUrl;
                        },
                        20
                    );
                }
                break;
            default:
                bizStatusInfo = data.statusInfo
                    ? data.statusInfo
                    : (BIZ_STATUS_ERROR[bizStatusCode] || DEFAULT_ERROR_MSG);

                showAlert(bizStatusInfo, false);
                break;
        }

        if (typeof ejson.hooks.afterFailure === 'function') {
            ejson.hooks.afterFailure(bizStatusInfo);
        }

        completeHandler(bizStatusInfo);

        return Deferred.rejected(bizStatusInfo);
    }

    /**
     * 发起 XMLHttpRequest 请求
     *
     * @param {Object} options 相关配置
     * @param {string} options.url 请求的地址
     * @param {string=} options.method 请求的类型
     * @param {Object=} options.data 请求的数据
     *                 可以为 json 或 text ，默认为 responseText
     * @param {number=} options.timeout 超时时间
     * @param {boolean=} options.cache 决定是否允许缓存
     * @return {FakeXHR} 该对象有 Promise 的所有方法，以及一个 abort 方法
     */
    ejson.request = function (options) {
        // ejson 返回值类型一定是 json 格式
        options.dataType = 'json';

        if (typeof ejson.hooks.beforeRequest === 'function') {
            ejson.hooks.beforeRequest(options);
        }

        return ajax.request(options).then(
            successHandler,
            failureHandler
        );
    };

    /**
     * 发起一个 GET 请求并获取 json 数据
     *
     * @param {string} url 请求的地址
     * @param {Object=} data 请求的数据
     * @param {boolean=} cache 决定是否允许缓存
     */
    ejson.get = function(url, data, cache) {
        var me = this;

        var options = {
            method: 'GET',
            url: url,
            data: data,
            cache: cache || me.ajax.config.cache
        };

        return me.request(options);
    };

    /**
     * 发起一个 POST 请求
     *
     * @param {string} url 请求的地址
     * @param {Object=} data 请求的数据
     */
    ejson.post = function(url, data) {
        var me = this;

        var options = {
            method: 'POST',
            url: url,
            data: data
        };

        return me.request(options);
    };

    return ejson;

});
