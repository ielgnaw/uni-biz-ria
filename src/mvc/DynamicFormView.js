/**
 * @file 动态 form View
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    require('er/tpl!./dynamicForm.tpl.html');

    var _ = require('underscore');
    var util = require('er/util');
    var Deferred = require('er/Deferred');
    var FormView = require('./FormView');

    /**
     * 动态 Form View 基类
     *
     * @extends FormView
     * @constructor
     */
    function DynamicFormView() {
        FormView.apply(this, arguments);
    }

    DynamicFormView.prototype.template = 'dynamicForm';

    /**
     * 重置表单
     */
    function reset() {
        this.fire('reset');
    }

    /**
     * 取消编辑
     */
    function cancelEdit() {
        this.fire('cancel');
    }

    /**
     * 提交数据
     */
    function submit() {
        this.fire('submit');
    }

    /**
     * 绑定控件事件
     *
     * @override
     */
    // DynamicFormView.prototype.bindEvents = function () {
    //     var me = this;
    //     var form = me.get('form');
    //     if (form) {
    //         form.on('submit', submit, me);
    //     }

    //     var resetButton = me.get('reset');
    //     if (resetButton) {
    //         resetButton.on('click', reset, me);
    //     }

    //     var cancelButton = me.get('cancel');
    //     if (cancelButton) {
    //         cancelButton.on('click', cancelEdit, me);
    //     }

    //     FormView.prototype.bindEvents.apply(me, arguments);
    // };

    /**
     * 容器渲染完毕后做一些准备工作
     * 例如控制元素可见性及绑定事件等DOM操作
     *
     * @override
     */
    DynamicFormView.prototype.enterDocument = function () {
        var me = this;
        var model = me.model;

        var formItemConfigs = model.get('formItemConfigs');

        buildUIProperties(
            formItemConfigs, model
        ).then(
            function (ret) {
                var properties = ret.properties;
                DynamicFormView.prototype.uiProperties = properties;
                me.uiEvents = _.extend(
                    {},
                    me.uiEvents,
                    {
                        'form:submit': function (e) {
                            this.fire(
                                'submit',
                                {
                                    aaa: 1
                                }
                            );
                        }
                    }
                );
                FormView.prototype.enterDocument.apply(me, arguments);

                // ideaName 不属于动态 form ， 它是一个固定的 formItem
                me.initTip(
                    '该标识只做系统管理使用，与展现无关',
                    me.get('ideaName')
                );

                // 遍历 properties ，初始化 formItem 的 tip
                _.forEach(
                    properties,
                    function (property, key) {
                        if (property.tip) {
                            me.initTip(
                                property.tip,
                                me.get(key)
                            );
                        }
                    }
                );


                console.log(me.uiEvents);

                // me.getFormInstance().fire(
                //     'submit',
                //     {
                //         aaa: 1
                //     }
                // );
                // console.log(me.getFormData());
                // console.log(me.getUIEvents());
                // console.log(me.getViewName());

                // var componentData;

                // Deferred.all(
                //     (function () {
                //         return _.map(
                //             properties.components,
                //             function (component, index) {
                //                 return loadConfig(
                //                     'common/component/' + component.type + '/main',
                //                     component
                //                 );
                //             }
                //         );
                //     })()
                // ).then(
                //     function (d) {
                //         componentData = d.modExport.init(d.component, view);
                //         d.modExport.on(
                //             'formSubmitDataChange',
                //             function (changedData) {
                //                 componentData = changedData.curFormData;
                //             }
                //         );
                //     }
                // );

                // var form = view.get('createIdeaForm');
                // form.on(
                //     'submit',
                //     function (e) {
                //         validAjax(view).then(
                //             function (ret) {
                //                 var isValid = true;
                //                 for (var i = 0, len = ret.length; i < len; i++) {
                //                     if (ret[i].data.status !== 0) {
                //                         var esuiDom = ret[i].esuiDom;
                //                         var validityLabel = esuiDom.getValidityLabel();
                //                         validityLabel.display(false, ret[i].data.statusInfo);
                //                         validityLabel.show();
                //                         isValid = false;
                //                     }
                //                 }
                //                 if (isValid) {
                //                     if (!validCheckbox()) {
                //                         return;
                //                     }
                //                     Dialog.confirm({
                //                         title: '确认',
                //                         content: '确认添加创意？',
                //                         width: 400,
                //                         skin: 'exconfirm'
                //                     }).on(
                //                         'ok',
                //                         function () {
                //                             var data = form.getData();
                //                             var ideaName = data.ideaName;
                //                             delete data.ideaName;
                //                             var componentSubmitNameDom =
                //                                 $('[component-submit-name]', form.main);
                //                             if (componentSubmitNameDom
                //                                 && componentSubmitNameDom.length
                //                             ) {
                //                                 var componentSubmitName =
                //                                     componentSubmitNameDom.attr('component-submit-name');
                //                                 data[componentSubmitName] = componentData;
                //                             }

                //                             require('common/ejson').post(
                //                                 ajaxUrl.ADD_IDEA,
                //                                 {
                //                                     ideaName: ideaName,
                //                                     ideaInfoS: decodeURIComponent(
                //                                         shim.stringify(data)
                //                                     )
                //                                 },
                //                                 'json'
                //                             ).then(
                //                                 function (data) {
                //                                     if (data.status) {
                //                                         Dialog.alert({
                //                                             content: data.statusInfo
                //                                                         || '请求错误'
                //                                         });
                //                                     }
                //                                     else {
                //                                         Dialog.alert({
                //                                             content: '添加创意成功'
                //                                         }).on(
                //                                             'ok',
                //                                             function () {
                //                                                 locator.redirect(
                //                                                     '#/ideaManage'
                //                                                 );
                //                                             }
                //                                         );
                //                                     }
                //                                 }
                //                             );
                //                         }
                //                     );
                //                 }
                //             }
                //         );
                //     }
                // );
            }
        );
    };

    /*function delayed(time, value) {
        console.warn(time);
        var loading = new Deferred();
        setTimeout(
            function() {
                console.log('已获取值 ' + value);
                loading.resolve(value);
                // loading.reject(value);
            },
            time
        );
        return loading.promise;
    }
    var list = [3,4,5];
    Deferred.all(
        (function () {
            return _.map(
                list,
                function (c) {
                    return delayed(c * 1000, c * 100);
                }
            );
        })()
        // delayed(3000, 300),
        // delayed(4000, 400),
        // delayed(5000, 500)
    ).then(
        function () {
            console.log('resolve');
        },
        function () {
            console.log('reject');
        }
    );*/

    /**
     * 根据 formItemConfigs 配置获取 properties ，便于之后渲染 esui 控件
     *
     * @param {Array.<Object>} formItemConfigs formItem 配置
     * @param {Model} model 当前的 Model 对象
     *
     * @return {Promise}
     */
    function buildUIProperties(formItemConfigs, model) {
        var defer = new Deferred();
        var len = formItemConfigs.length;
        var properties = {};
        properties.components = [];
        _.forEach(
            formItemConfigs,
            function (formItemConfig, index) {
                if (formItemConfig.properties) {
                    properties[formItemConfig.id] = formItemConfig.properties;
                }

                if (formItemConfig.components) {
                    properties.components.push(formItemConfig.components);
                }

                // 把要动态添加的元素设置到 model 中，便于在 action 中获取
                if (formItemConfig.type === 'createFormItemsBtn') {
                    model.set('addElems', formItemConfig.elems);
                }

                if (index === len - 1) {
                    defer.resolve({
                        properties: properties
                    });
                }
            }
        );
        return defer.promise;
    }

    util.inherits(DynamicFormView, FormView);

    return DynamicFormView;
});
