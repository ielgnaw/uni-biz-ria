/**
 * @file ExCascadeCompare 规则校验，当前控件的值与另一个控件的值之间的比较，仅支持数字比较
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {
    var Rule = require('esui/validator/Rule');
    var ValidityState = require('esui/validator/ValidityState');

    /**
     * 验证当前控件的值与另一个控件的值之间的比较结果
     *
     * @extends validator.Rule
     * @class validator.ExCascadeCompareRule
     * @constructor
     */
    function ExCascadeCompareRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型，始终为`"minByteLength"`
     *
     * @type {string}
     * @override
     */
    ExCascadeCompareRule.prototype.type = 'exCascadeCompare';

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     * @return {validator.ValidityState}
     * @override
     */
    ExCascadeCompareRule.prototype.check = function (value, control) {
        var compareRule = control.get('exCascadeCompare');
        var segments = compareRule.split(',');
        var op = segments[0];
        var targetNodeId = segments[1];
        var targetNodeValue = control.viewContext.get(targetNodeId).getValue();

        var ret = true;

        targetNodeValue = parseInt(targetNodeValue, 10);
        value = parseInt(value, 10);

        if (!isNaN(targetNodeValue) && !isNaN(value)) {
            switch (op) {
                case '<':
                    ret = (value < targetNodeValue);
                    break;
                case '<=':
                    ret = (value <= targetNodeValue);
                    break;
                case '>':
                    ret = (value > targetNodeValue);
                    break;
                case '>=':
                    ret = (value >= targetNodeValue);
                    break;
                case '==':
                    ret = (value == targetNodeValue);
                    break;
                case '===':
                    ret = (value === targetNodeValue);
                    break;
                default:
                    ret = true;
            }
        }
        return new ValidityState(
            ret,
            this.getErrorMessage(control)
        );
    };

    require('esui/lib').inherits(ExCascadeCompareRule, Rule);
    require('esui/main').registerRule(ExCascadeCompareRule, 100);
    return ExCascadeCompareRule;
});
