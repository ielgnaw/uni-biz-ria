/**
 * ESUI (Enterprise UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file 字段最大长度验证规则，对中文字符算2个字符
 * @author otakustay, virola
 */
define(function (require) {
    var Rule = require('esui/validator/Rule');
    var ValidityState = require('esui/validator/ValidityState');

    var LANG_PKG = require('../lang').getLangPkg();

    /**
     * ExMaxLengthRule 类声明
     *
     * @constructor
     */
    function ExMaxLengthRule() {
        Rule.apply(this, arguments);
    }

    /**
     * 规则类型
     *
     * @type {string}
     */
    ExMaxLengthRule.prototype.type = 'exMaxLength';

    /**
     * 错误提示信息
     *
     * @type {string}
     */
    ExMaxLengthRule.prototype.errorMessage = LANG_PKG.BNCGGZF;

    /**
     * 验证控件的验证状态
     *
     * @param {string} value 校验值
     * @param {Control} control 待校验控件
     *
     * @return {validator/ValidityState}
     */
    ExMaxLengthRule.prototype.check = function (value, control) {
        var length = getStringLength(value);

        return new ValidityState(
            length <= this.getLimitCondition(control),
            this.getErrorMessage(control)
        );
    };

    ExMaxLengthRule.prototype.getErrorMessage = function (control) {
        var lib = require('esui/lib');
        var errorMessage =
            control.get(this.type + 'ErrorMessage') || this.errorMessage;

        var maxLength = this.getLimitCondition(control);
        var data = {
            title: control.get('title'),
            exMaxLength: maxLength,
            length: maxLength
        };
        return lib.format(errorMessage, data);
    };

    /**
     * 获取字符串的长度，中文全角按2个字符来算
     *
     * @param {string} str 字符串
     * @return {number} 字符长度
     */
    function getStringLength(str) {
        return str.replace(/[^\x00-\xff]/g,'**').length;
    }

    require('esui/lib').inherits(ExMaxLengthRule, Rule);
    require('esui/main').registerRule(ExMaxLengthRule, 100);

    return ExMaxLengthRule;
});
