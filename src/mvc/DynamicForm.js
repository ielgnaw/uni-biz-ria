/**
 * @file 动态 form Action
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var Action = require('er/Action');
    var util = require('er/util');
    var Dialog = require('esui/Dialog');
    var ejson = require('../io/ejson');
    var uniUtil = require('../util');
    var dynamicUtil = require('./dynamicUtil');

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

        var formType = model.get('formType');

        var confirmMsg;

        if (formType === 'create') {
            confirmMsg = '确认添加创意？';
        }
        else {
            confirmMsg = '确认修改创意？';
        }

        var successFunc =
            typeof view.successFunc === 'function'
                ? view.successFunc
                : function () {};

        var errorFunc =
            typeof view.errorFunc === 'function'
                ? view.errorFunc
                : function () {};

        view.on(
            'submit',
            function (params) {
                dynamicUtil.validAjax(view).then(
                    function (ret) {
                        var isValid = true;
                        for (var i = 0, len = ret.length; i < len; i++) {
                            if (ret[i].data.status !== 0) {
                                var esuiDom = ret[i].esuiDom;
                                var validityLabel = esuiDom.getValidityLabel();
                                validityLabel.display(false, ret[i].data.statusInfo);
                                validityLabel.show();
                                isValid = false;
                            }
                        }

                        if (isValid) {
                            if (!dynamicUtil.validCheckbox()
                                || !dynamicUtil.validSelect(view)
                                || !dynamicUtil.validTextBox(view)
                            ) {
                                return;
                            }

                            Dialog.confirm({
                                title: '确认',
                                content: confirmMsg,
                                width: 400,
                                skin: 'exconfirm'
                            }).on(
                                'ok',
                                function () {
                                    // form 实例
                                    var form = params.form;
                                    var formData = form.getData();
                                    var ideaName = formData.ideaName;
                                    delete formData.ideaName;

                                    var componentData = params.componentData;
                                    if (componentData) {
                                        var componentCallback = params.componentCallback;
                                        componentCallback
                                            && typeof componentCallback === 'function'
                                            && (componentData = componentCallback.call());
                                        formData[componentData.submitName] = componentData.dataList;
                                    }

                                    var ajaxArgs = {
                                        ideaName: ideaName,
                                        ideaInfoS: decodeURIComponent(
                                            uniUtil.stringify(formData)
                                        )
                                    };

                                    if (params.ideaInfo) {
                                        ajaxArgs.ideaId = params.ideaInfo.ideaId;
                                    }

                                    ejson.post(
                                        model.get('submitUrl'),
                                        ajaxArgs,
                                        'json'
                                    ).then(successFunc, errorFunc);
                                }
                            );
                        }
                    }
                );
            }
        );
    };

    util.inherits(DynamicForm, Action);

    return DynamicForm;
});
