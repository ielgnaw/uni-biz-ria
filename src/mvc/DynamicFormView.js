/**
 * @file 动态 form View
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    require('er/tpl!./dynamicForm.tpl.html');

    var _ = require('underscore');
    var util = require('er/util');
    var Deferred = require('er/Deferred');
    var uniUtil = require('../util');
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
     * form 提交成功后的回调函数
     */
    DynamicFormView.prototype.successFunc = function () {};

    /**
     * form 提交成功后的回调函数
     * 常规的错误处理函数已经在 ejson 中封装，会弹出错误信息
     * 这里的 errorFunc 是为了做一些自定义的错误处理
     */
    DynamicFormView.prototype.errorFunc = function () {};

    // /**
    //  * 重置表单
    //  */
    // function reset() {
    //     this.fire('reset');
    // }

    // /**
    //  * 取消编辑
    //  */
    // function cancelEdit() {
    //     this.fire('cancel');
    // }

    // /**
    //  * 提交数据
    //  */
    // function submit() {
    //     this.fire('submit');
    // }

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

        if (_.isArray(formItemConfigs)) {
            buildUIProperties(
                formItemConfigs, model
            ).then(
                function (ret) {
                    var properties = ret.properties;
                    // DynamicFormView.prototype.uiProperties = properties;
                    me.uiProperties = properties; // 要挂载在 me 上，这样子类才能生效

                    // 设置 uiEvents 要在执行父类的 enterDocument 之前
                    me.uiEvents = _.extend(
                        {},
                        me.uiEvents,
                        {
                            'form:submit': function (e) {
                                me.fire(
                                    'submit',
                                    {
                                        form: me.getFormInstance(),
                                        ideaInfo: model.get('ideaInfo') // 修改才有的
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

                    // 遍历 properties
                    // 初始化 formItem 的 tip
                    // 如果是修改的话，那么设置 Uploader 的值
                    _.forEach(
                        properties,
                        function (property, key) {
                            if (property.tip) {
                                me.initTip(
                                    property.tip,
                                    me.get(key)
                                );
                            }

                            // 说明是 Uploader
                            if (property.uploaderVal) {
                                me.get(key).setRawValue(property.uploaderVal);
                            }
                        }
                    );


                }
            );
        }
    };

    /**
     * 根据 formItemConfigs 配置获取 properties ，便于之后渲染 esui 控件
     *
     * @param {Array.<Object>} formItemConfigs formItem 配置
     * @param {Model} model 当前的 Model 对象
     *
     * @return {Promise}
     */
    function buildUIProperties(formItemConfigs, model) {
        var formType = model.get('formType');
        var defer = new Deferred();
        var len = formItemConfigs.length;
        var ret = {};
        ret.components = [];
        _.forEach(
            formItemConfigs,
            function (formItemConfig, index) {
                var properties = formItemConfig.properties;

                if (properties) {
                    ret[formItemConfig.id] = properties;

                    // 把 Uploader 类型的 formItem 的值直接放入到 properties 中，
                    // 便于不用循环就可以回填 Uploader 的值
                    if (formType === 'edit'
                        && formItemConfig.type === 'Uploader'
                    ) {
                        var uploaderData = model.get(formItemConfig.id);
                        ret[formItemConfig.id].uploaderVal = {
                            width: uploaderData.width || 50,
                            height: uploaderData.height || 50,
                            previewUrl: decodeURIComponent(uploaderData)
                        };
                    }
                }

                // if (formItemConfig.components) {
                //     ret.components.push(formItemConfig.components);
                // }

                // // 把要动态添加的元素设置到 model 中，便于在 action 中获取
                // if (formItemConfig.type === 'createFormItemsBtn') {
                //     model.set('addElems', formItemConfig.elems);
                // }

                if (index === len - 1) {
                    defer.resolve({
                        properties: ret
                    });
                }
            }
        );
        return defer.promise;
    }

    util.inherits(DynamicFormView, FormView);

    return DynamicFormView;
});
