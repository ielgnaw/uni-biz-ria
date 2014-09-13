/**
 * @file FormView
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    // var _ = require('underscore');
    var esui = require('esui');
    var UIView = require('ef/UIView');
    var util = require('er/util');

    /**
     * 提交表单的额外数据
     *
     * @type {Object}
     */
    // var extraData = {};

    /**
     * FormView 基类
     *
     * @extends ef.UIView
     * @constructor
     */
    function FormView() {
        UIView.apply(this, arguments);
    }

    /**
     * 这里设置通用的 uiProperties
     * 子类如果有需要，可以覆盖此属性
     *     $.extend(
     *         true,
     *         {},
     *         FormView.prototype.uiProperties,
     *         ChildView.prototype.uiProperties
     *     );
     */
    FormView.prototype.uiProperties = {
    };

    /**
     * 这里设置通用的 uiEvents
     * 子类如果有需要，可以覆盖此属性
     *     $.extend(
     *         true,
     *         {},
     *         FormView.prototype.uiEvents,
     *         ChildView.prototype.uiEvents
     *     );
     */
    FormView.prototype.uiEvents = {
    };

    /**
     * 容器渲染完毕后做一些准备工作
     * 例如控制元素可见性及绑定事件等 DOM 操作
     *
     * @override
     */
    FormView.prototype.enterDocument = function () {
        UIView.prototype.enterDocument.apply(this, arguments);
    };

    /**
     * 获取当前的 form 实例
     *
     * @return {esui.Form}
     */
    FormView.prototype.getFormInstance = function () {
        return this.get('form');
    }

    /**
     * 从表单中获取数据
     *
     * @return {Object}
     */
    FormView.prototype.getFormData = function () {
        var me = this;
        var form = me.get('form');
        return form ? form.getData() : {};
    };

    // /**
    //  * 设置表单额外数据
    //  * @param {Object} key: value 形式的数据 key 和 input 的 name 一一对应
    //  */
    // FormView.prototype.setExtraData = function (extraData) {
    //     return;
    // };

    // /**
    //  * 获取当前表单需要提交的额外数据
    //  *
    //  * @return {Object} 表单数据
    //  */
    // FormView.prototype.getExtraFormData = function () {
    //     return {};
    // };

    /**
     * 显示 Tip 信息
     *
     * @param {string} content 显示的内容
     * @param {esui.Element} target 目标元素
     */
    FormView.prototype.initTip = function (content, target) {
        var main = document.createElement('div');
        document.body.appendChild(main);

        var tipLayer = esui.create(
            'TipLayer',
            {
                main: main,
                content: content
            }
        );
        tipLayer.render();
        tipLayer.attachTo({
            targetControl: target,
            showMode: 'over',
            delayTime: 200,
            positionOpt: {
                top: 'top',
                right: 'right'
            }
        });
    };

    util.inherits(FormView, UIView);

    return FormView;
});
