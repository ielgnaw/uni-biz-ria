/**
 * @file 动态 form Action
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var _ = require('underscore');

    var etpl = require('etpl');
    var lib = require('esui/lib');
    var esui = require('esui');
    var Action = require('er/Action');
    var util = require('er/util');

    /**
     * 动态 Form Action 基类
     *
     * @extends Action
     * @constructor
     */
    function DynamicForm() {
        Action.apply(this, arguments);
    }

    DynamicForm.prototype.modelType = require('./DynamicFormModel');
    DynamicForm.prototype.viewType = require('./DynamicFormView');

    /**
     * 初始化 Action 并给 view 绑定事件
     *
     * @override
     * @return
     */
    DynamicForm.prototype.initBehavior = function () {
        var me = this;
        var model = me.model;
        var view = me.view;
        Action.prototype.initBehavior.apply(me, arguments);

        view.on(
            'submit',
            function (params) {
                console.log(params);
            }
        )

    };

    util.inherits(DynamicForm, Action);

    return DynamicForm;
});
