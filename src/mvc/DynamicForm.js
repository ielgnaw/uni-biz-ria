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
                    }
                );

                return;
                // console.log();

                console.log(model);
                console.log(params);
                console.log(view);
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
        );
    };

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

    util.inherits(DynamicForm, Action);

    return DynamicForm;
});
