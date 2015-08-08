/**
 * @file 扩展 esui/3.1.0-beta.3/src/validator/MinByteLengthRule.js 排除必填的限制
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {
    var Rule = require('esui/validator/Rule');
    var ValidityState = require('esui/validator/ValidityState');

    /**
     * 验证最小字节长度的规则
     *
     * 该规则将除标准ASCII码外的其它字符视为2个字节
     *
     * @extends validator.Rule
     * @class validator.ExMinByteLengthRule
     * @constructor
     */
    function ExMinByteLengthRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"minByteLength"`
     *
     * @type {string}
     * @override
     */
    ExMinByteLengthRule.prototype.type = 'exMinByteLength';

    /**
     * 错误提示信息
     *
     * @type {string}
     * @override
     */
    ExMinByteLengthRule.prototype.errorMessage =
        '${title}不能小于${exMinByteLength}个字符';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    ExMinByteLengthRule.prototype.check = function (value, control) {
        var byteLength = value.replace(/[^\x00-\xff]/g, 'xx').length;
        var ret = (byteLength === 0) ? true : byteLength >= this.getLimitCondition(control);

        return new ValidityState(
            ret,
            this.getErrorMessage(control)
        );
    };

    require('esui/lib').inherits(ExMinByteLengthRule, Rule);
    require('esui/main').registerRule(ExMinByteLengthRule, 100);
    return ExMinByteLengthRule;
});
