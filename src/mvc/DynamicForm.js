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

                // Dialog.confirm({
                //     title: '确认',
                //     content: confirmMsg,
                //     width: 400,
                //     skin: 'exconfirm'
                // }).on(
                //     'ok',
                //     function () {
                //         var data = form.getData();
                //         var ideaName = data.ideaName;
                //         delete data.ideaName;
                //         var componentSubmitNameDom =
                //             $('[component-submit-name]', form.main);
                //         if (componentSubmitNameDom
                //             && componentSubmitNameDom.length
                //         ) {
                //             var componentSubmitName =
                //                 componentSubmitNameDom.attr('component-submit-name');
                //             data[componentSubmitName] = componentData;
                //         }

                //         require('common/ejson').post(
                //             ajaxUrl.ADD_IDEA,
                //             {
                //                 ideaName: ideaName,
                //                 ideaInfoS: decodeURIComponent(
                //                     shim.stringify(data)
                //                 )
                //             },
                //             'json'
                //         ).then(
                //             function (data) {
                //                 if (data.status) {
                //                     Dialog.alert({
                //                         content: data.statusInfo
                //                                     || '请求错误'
                //                     });
                //                 }
                //                 else {
                //                     Dialog.alert({
                //                         content: '添加创意成功'
                //                     }).on(
                //                         'ok',
                //                         function () {
                //                             locator.redirect(
                //                                 '#/ideaManage'
                //                             );
                //                         }
                //                     );
                //                 }
                //             }
                //         );
                //     }
                // );
            }
        )

    };

    util.inherits(DynamicForm, Action);

    return DynamicForm;
});
