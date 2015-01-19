/**
 * @file 提供 uni-biz-ria 包里的语言包以及语言包管理功能
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var lang = '';

    var exports = {};

    /**
     * 设置 uni-biz-ria 的语言环境
     *
     * @param {string} lang 语言信息
     */
    exports.setLang = function (lang) {
        lang = lang;
    };

    /**
     * 获取 lang 信息
     *
     * @return {string} lang 信息
     */
    exports.getLang = function () {
        return lang || document.documentElement.getAttribute('lang');
    };

    /**
     * 根据 lang 获取对应的语言包
     *
     * @return {Object} 语言包信息
     */
    exports.getLangPkg = function () {
        var langPkg = require('./langPkg/main');
        var lang = exports.getLang();

        var langPkgInfo = langPkg[lang];
        if (!langPkgInfo) {
            langPkgInfo = langPkg.zh_CN;
        }
        return langPkgInfo;
    };

    return exports;

});
