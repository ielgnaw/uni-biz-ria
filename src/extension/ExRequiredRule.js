/**
 * @file 必填项验证规则，扩展 esui/3.1.0-beta.3/src/validator/ExRequiredRule.js，排除空格
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var Rule = require('esui/validator/Rule');
    var ValidityState = require('esui/validator/ValidityState');
    var lib = require('esui/lib');

    var LANG_PKG = require('../lang').getLangPkg();

    /**
     * 非空验证规则
     *
     * @extends validator.Rule
     * @class validator.ExRequiredRule
     * @constructor
     */
    function ExRequiredRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"exRequired"`
     *
     * @type {string}
     * @override
     */
    ExRequiredRule.prototype.type = 'exRequired';


    /**
     * 错误提示信息
     *
     * @type {string}
     */
    ExRequiredRule.prototype.errorMessage = LANG_PKG.BTBNWK;

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    ExRequiredRule.prototype.check = function (value, control) {
        return new ValidityState(!!lib.trim(value), this.getErrorMessage(control));
    };

    require('esui/lib').inherits(ExRequiredRule, Rule);
    require('esui/main').registerRule(ExRequiredRule, 0);
    return ExRequiredRule;
});
