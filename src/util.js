/**
 * @file 工具模块
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var _ = require('underscore');
    var moment = require('moment');
    var WHITESPACE = /^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g;

    /**
     * 将 json 对象序列化
     * from baidu.json.stringify
     * @param {JSON} value 需要序列化的 json 对象
     *
     * @remark
     * 该方法的实现与 ecma-262 第五版中规定的 JSON.stringify 不同，暂
     * 时只支持传入一个参数。后续会进行功能丰富。
     *
     * @returns {string} 序列化后的字符串
     */
    var stringify = (function () {
        /**
         * 字符串处理时需要转义的字符表
         * @private
         */
        var escapeMap = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };

        /**
         * 字符串序列化
         * @private
         */
        function encodeString(source) {
            if (/["\\\x00-\x1f]/.test(source)) {
                source = source.replace(
                    /["\\\x00-\x1f]/g,
                    function (match) {
                        var c = escapeMap[match];
                        if (c) {
                            return c;
                        }
                        c = match.charCodeAt();
                        return '\\u00'
                            + Math.floor(c / 16).toString(16)
                            + (c % 16).toString(16);
                    }
                );
            }
            return '"' + source + '"';
        }

        /**
         * 数组序列化
         * @private
         */
        function encodeArray(source) {
            var result = ['['];
            var l = source.length;
            var preComma;
            var i;
            var item;

            for (i = 0; i < l; i++) {
                item = source[i];

                switch (typeof item) {
                    case 'undefined':
                    case 'function':
                    case 'unknown':
                        break;
                    default:
                        if (preComma) {
                            result.push(',');
                        }
                        result.push(stringify(item));
                        preComma = 1;
                }
            }
            result.push(']');
            return result.join('');
        }

        /**
         * 处理日期序列化时的补零
         * @private
         */
        function pad(source) {
            return source < 10 ? '0' + source : source;
        }

        /**
         * 日期序列化
         * @private
         */
        function encodeDate(source) {
            return '"'
                + source.getFullYear()
                + '-'
                + pad(source.getMonth() + 1)
                + '-'
                + pad(source.getDate())
                + 'T'
                + pad(source.getHours())
                + ':'
                + pad(source.getMinutes())
                + ':'
                + pad(source.getSeconds())
                + '"';
        }

        return function (value) {
            switch (typeof value) {
                case 'undefined':
                    return 'undefined';

                case 'number':
                    return isFinite(value) ? String(value) : 'null';

                case 'string':
                    return encodeString(value);

                case 'boolean':
                    return String(value);

                default:
                    if (value === null) {
                        return 'null';
                    }
                    else if (value instanceof Array) {
                        return encodeArray(value);
                    }
                    else if (value instanceof Date) {
                        return encodeDate(value);
                    }
                    else {
                        var result = [];
                        result.push('{');

                        var preComma;
                        var curItem;

                        for (var key in value) {
                            if (
                                Object.prototype.hasOwnProperty.call(
                                    value,
                                    key
                                )
                            ) {
                                curItem = value[key];
                                switch (typeof curItem) {
                                    case 'undefined':
                                    case 'unknown':
                                    case 'function':
                                        break;
                                    default:
                                        if (preComma) {
                                            result.push(',');
                                        }
                                        preComma = 1;
                                        result.push(
                                            stringify(key) + ':' + stringify(curItem)
                                        );
                                }
                            }
                        }
                        result.push('}');
                        return result.join('');
                    }
            }
        };
    })();

    /**
     * 工具模块
     *
     * @class util
     * @singleton
     */
    var util = {};

    util.stringify = stringify;

    /**
     * 将目标字符串中可能会影响正则表达式构造的字符串进行转义。
     * 给以下字符前加上 \ 进行转义：.*+?^=!:${}()|[]/\
     * from tangram baidu.string.escapeReg
     *
     * @param  {string} source 目标字符串
     *
     * @return {string}        转义后的字符串
     */
    util.escapeReg = function (source) {
        return String(source)
                .replace(
                    new RegExp('([.*+?^=!:\x24{}()|[\\]\/\\\\])', 'g'),
                    '\\\x241'
                );
    };

    /**
     * 根据参数名从目标 URL 中获取参数值
     * from tangram baidu.url.jsonToQuery
     *
     * @param {string} url 目标 URL
     * @param {string} key 要获取的参数名
     *
     * @return {string|null}  获取的参数值，其中 URI 编码后的字符不会被解码，
     *                         获取不到时返回 null
     */
    util.getQueryValue = function (url, key) {
        var reg = new RegExp(
            '(^|&|\\?|#|~)' + util.escapeReg(key) + '=([^&#]*)(&|\x24|#)',
            ''
        );
        var match = url.match(reg);
        if (match) {
            return match[2];
        }

        return null;
    };

    /**
     * 对字符串进行 %#&+= 以及和 \s 匹配的所有字符进行 url 转义
     * from tangram baidu.url.escapeSymbol
     *
     * @param  {string} source 需要转义的字符串
     */
    util.escapeSymbol = function (source) {
        return String(source).replace(
            /[#%&+=\/\\\ \　\f\r\n\t]/g,
            function (all) {
                return ''
                    + '%'
                    + (0x100 + all.charCodeAt())
                            .toString(16).substring(1).toUpperCase();
            }
        );
    };

    /**
     * 对目标字符串进行 html 编码
     * from baidu.string.encodeHTML
     *
     * @param {string} source 目标字符串
     * @remark
     * 编码字符有5个：&<>"'
     *
     * @returns {string} html 编码后的字符串
     */
    util.encodeHTML = function (source) {
        return String(source)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    /**
     * 将 json 对象解析成 query 字符串
     * from tangram baidu.url.jsonToQuery
     *
     * @param  {Object} json        需要解析的 json 对象
     * @param  {?Function} replacerOpt 对值进行特殊处理的函数，
     *                                     function (value, key)
     */
    util.jsonToQuery = function (json, replacerOpt) {
        var result = [];
        var itemLen;
        var replacer = replacerOpt || function (value) {
            return util.escapeSymbol(value);
        };

        _.forEach(
            json,
            function (item, key) {
                // 这里只考虑 item 为数组、字符串、数字类型，不考虑嵌套的 object
                if (_.isArray(item)) {
                    itemLen = item.length;
                    // value 的值需要 encodeURIComponent 转义吗？
                    // FIXED 优化了 escapeSymbol 函数
                    while (itemLen--) {
                        result.push(key + '=' + replacer(item[itemLen], key));
                    }
                }
                else {
                    result.push(key + '=' + replacer(item, key));
                }
            }
        );

        return result.join('&');
    };

    /**
     * 将 URL 参数转化成 json 对象
     *
     * @param {string} str 待转化的 url 参数字符串
     * @param {boolean} isDecode 是否编码
     *
     * @return {Object} 结果对象
     */
    util.queryToJson = function (str, isDecode) {
        var me = this;
        /**
         * decode 字符
         *
         * @param {string} data 待 decode 的字符串
         *
         * @return {string} decode 后的结果
         */
        function _decodeData(str) {
            if (isDecode) {
                return decodeURIComponent(str);
            }
            else {
                return str;
            }
        }

        var ret = {};
        var segments = me.trim(str).split('&');
        if (segments && segments.length) {
            for (var i = 0, len = segments.length; i < len; i++) {
                if (segments[i]) {
                    var hash = segments[i].split('=');
                    var key = hash[0];
                    var value = hash[1];
                    // 如果只有 key 没有 value , 那么将全部丢入一个 $nullValue 数组中
                    if (hash.length < 2) {
                        value = key;
                        key = '$nullValue';
                    }
                    // 如果缓存堆栈中没有这个数据
                    if (!ret[key]) {
                        ret[key] = _decodeData(value);
                    }
                    // 如果堆栈中已经存在这个数据，则转换成数组存储
                    else {
                        if (!util.isArray(ret[key])) {
                            ret[key] = [ret[key]];
                        }
                        ret[key].push(_decodeData(value));
                    }
                }
            }
        }
        return ret;
    };

    /**
     * 将字符串解析成 json 对象。注：不会自动祛除空格
     * from baidu.json.parse
     *
     * @param {string} data 需要解析的字符串
     *
     * @returns {Object} 解析结果 json 对象
     */
    util.parseJson = function (data) {
        /* jshint evil: true */
        return (new Function('return (' + data + ')'))();
    };

    util.browser = (function () {
        var ua = navigator.userAgent;
        /* jshint maxlen: 600, sub: true */
        return {
            chrome: /chrome\/(\d+\.\d+)/i.test(ua) ? +RegExp.$1 : undefined,
            firefox: /firefox\/(\d+\.\d+)/i.test(ua) ? +RegExp.$1 : undefined,
            ie: /msie (\d+\.\d+)/i.test(ua) ? (document.documentMode || +RegExp.$1) : undefined,
            isGecko: /gecko/i.test(ua) && !/like gecko/i.test(ua),
            isStrict: document.compatMode === 'CSS1Compat',
            isWebkit: /webkit/i.test(ua),
            opera: /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(ua) ?  +(RegExp.$6 || RegExp.$2) : undefined,
            safari: /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? +(RegExp.$1 || RegExp.$2) : undefined
        };
    })();

    /**
     * 构建 # 号后的 URL
     *
     * @param {string} path action url
     * @param {number} id 结点 ID
     * @param {string} level 结点层级
     * @param {Object} options 其他参数
     * @return {string} url
     */
    util.buildUrl = function (path, id, level, options) {
        var erUtil = require('er/util');

        if (path.indexOf('/') !== 0) {
            path = '/' + path;
        }

        options = erUtil.mix(
            {},
            options,
            level
                ? { id: id, level: level }
                : { id: id }

        );
        return '#' + path + '~' + util.jsonToQuery(options);
    };

    /**
     * 获取 moment 对象
     *
     * @param  {Moment|string|Date} date   日期
     * @param  {string} format 格式化信息
     */
    util.getMoment = function (date, format) {
        if (moment.isMoment(date)) {
            return date;
        }

        if (typeof date === 'string') {
            return moment(date, [format]);
        }

        if (date instanceof Date) {
            return moment(date);
        }
    };

    /**
     * 格式化日期
     *
     * @param  {Moment|string|Date} date   日期
     * @param  {string} format 格式化信息
     */
    util.dateFormat = function (date, format) {
        if (!format) {
            format = 'YYYY-MM-DD';
        }
        return util.getMoment(date, format).format(format);
    };

    /**
     * 获取字符串长度，中文字符算两个
     *
     * @param  {string} str 字符串
     *
     * @return {number}     长度
     */
    util.getStringLength = function (str) {
        return str.replace(/[^\x00-\xff]/g, '**').length;
    };

    /**
     * 获取当前光标在文本框或者文本域中的位置
     *
     * @param  {HTML Element} dom input 或者 textarea 元素
     *
     * @return {number}     光标位置
     */
    util.getCursorPos = function (dom) {
        var caretPos = 0;
        var selection = document.selection;
        if (selection) {
            dom.focus();
            var sel = selection.createRange();
            sel.moveStart('character', -dom.value.length);
            caretPos = sel.text.length;
        }
        else if (dom.selectionStart || dom.selectionStart === 0) {
            caretPos = dom.selectionStart;
        }

        return caretPos;
    };

    /**
     * 设置光标位置
     *
     * @param {HTML Element} dom input 或者 textarea 元素
     * @param {number} pos 要设置的位置
     */
    util.setCursorPos = function (dom, pos) {
        if (dom.setSelectionRange) {
            dom.focus();
            dom.setSelectionRange(pos, pos);
        }
        else if (dom.createTextRange) {
            var range = dom.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    /**
     * 删除目标字符串两端的空白字符
     *
     * @param {string} source 目标字符串
     * @return {string} 删除两端空白字符后的字符串
     */
    util.trim = function (source) {
        if (!source) {
            return '';
        }

        return String(source).replace(WHITESPACE, '');
    };

    /**
     * 根据 name 获取 cookie
     *
     * @param {string} name key
     *
     * @return {string} 对应的 cookie 值
     */
    util.getCookie = function (name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split('; ');
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split('=');
            if(arr[0] === name) {
                return arr[1];
            }
        }
        return '';
    };

    /**
     * 设置 cookie
     *
     * @param {string} name cookie 名字
     * @param {string} value cookie 值
     * @param {number} expiresHours 过期时间，小时
     */
    util.addCookie = function (name, value, expiresHours) {
        var cookieStr = name + '=' + escape(value);
        if (expiresHours > 0) {
            var date = new Date();
            date.setTime(date.getTime() + expiresHours * 3600 * 1000);
            cookieStr =
                cookieStr
                + '; expires='
                + date.toGMTString();
        }
        cookieStr = cookieStr + '; domain=.baidu.com; path=/';
        document.cookie = cookieStr;
    };

    /**
     * 空函数
     *
     * @property
     * @type {Function}
     */
    util.noop = function () {};

    return util;

});
