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
    var Deferred = require('er/Deferred');
    var Action = require('er/Action');
    var util = require('er/util');
    var Dialog = require('esui/Dialog');
    var ejson = require('../io/ejson');
    var uniUtil = require('../util');

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
                validAjax(view).then(
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
                            if (!validCheckbox() || !validSelect(view)) {
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

    /**
     * 验证 form 中的 select
     *
     * @param {er.View} view 当前 View
     *
     * @return {boolean}
     */
    function validSelect(view) {
        var ret = true;

        var selectDoms = $('[data-ui-type="Select"]');
        for (var i = 0, len = selectDoms.length; i < len; i++) {
            var curDom = $(selectDoms[i]);
            if (curDom.attr('data-ui-required') == '1') {
                var esuiKey = curDom.attr('data-ui-name');
                var esuiDom = view.get(esuiKey);
                var excludeVal = curDom.attr('data-ui-excludeVal');
                if (esuiDom.getValue() == excludeVal) {
                    Dialog.alert({
                        content: '请选择' + (esuiDom.get('title') || '')
                    });
                    ret = false;
                    break;
                }
            }
        }
        return ret;
    }

    /**
     * 提交表单之前验证 form 中需要额外发送请求验证的元素
     *
     * @param {er.View} view 当前 View
     *
     * @return {Promise}
     */
    function validAjax(view) {
        var ajaxValidDoms = $('[ajax-valid]');
        var len = ajaxValidDoms.length;
        var defer = new Deferred();
        var ret = [];
        if (!len) {
            defer.resolve(ret);
        }
        else {
            _.forEach(
                ajaxValidDoms,
                function (ajaxValidDom, index) {
                    var dom = $(ajaxValidDom);
                    var esuiDom = view.get(dom.attr('name'));
                    var validUrl = dom.attr('ajax-valid');
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: validUrl,
                        data: {
                            check: esuiDom.getValue()
                        }
                    }).done(
                        function (data) {
                            ret.push({
                                data: data,
                                esuiDom: esuiDom
                            });
                            if (index === len - 1) {
                                defer.resolve(ret);
                            }
                        }
                    );
                }
            );
        }
        return defer.promise;
    }

    /**
     * 验证 form 中的多选框
     */
    function validCheckbox() {
        var ret = true;

        // 需要验证多选框是否选中以及选中个数的多选框的外层容器
        var checkboxContainer = $('[boxgroup-required="1"]');
        if (checkboxContainer && checkboxContainer.length) {
            for (var i = 0, len = checkboxContainer.length; i < len; i++) {
                var checkedElems = $(
                    'input[type=checkbox]:checked',
                    checkboxContainer[i]
                );

                var length = checkedElems.length;

                if (!checkedElems || !length) {
                    Dialog.alert({
                        content: checkboxContainer[i].getAttribute(
                            'boxgroup-required-error-message'
                        ) || '请选择多选框'
                    });
                    ret = false;
                    break;
                }
                else {
                    var maxSelectedCount = checkboxContainer[i].getAttribute(
                        'boxgroup-max-selected-count'
                    );

                    // 如果 maxSelectedCount 不存在或者不是数字就不验证了
                    if (maxSelectedCount && !isNaN(maxSelectedCount)) {
                        if (maxSelectedCount < length) {
                            Dialog.alert({
                                content: checkboxContainer[i].getAttribute(
                                    'boxgroup-max-selected-count-error-message'
                                ) || '选择的个数超过最大个数'
                            });
                            ret = false;
                            break;
                        }
                    }
                }
            }
        }

        return ret;
    }

    util.inherits(DynamicForm, Action);

    return DynamicForm;
});
