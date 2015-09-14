/**
 * @file 动态 form View
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var dynamicAddFormTpl = require('er/tpl!./dynamicForm.tpl.html');

    var $ = require('jquery');
    var _ = require('underscore');
    var util = require('er/util');
    var etpl = require('etpl');
    var esui = require('esui');
    var Deferred = require('er/Deferred');
    var FormView = require('./FormView');
    var dynamicUtil = require('./dynamicUtil');

    var LANG_PKG = require('../lang').getLangPkg();

    var etplEngine = new etpl.Engine();
    etplEngine.compile(dynamicAddFormTpl);

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
                    // 触发 submit 事件的参数
                    var submitEvtArgs = {
                        componentData: {}
                    };

                    var properties = ret.properties;
                    // DynamicFormView.prototype.uiProperties = properties;
                    me.uiProperties = properties; // 要挂载在 me 上，这样子类才能生效

                    // 设置 uiEvents 要在执行父类的 enterDocument 之前
                    me.uiEvents = _.extend(
                        {},
                        me.uiEvents,
                        {
                            'form:submit': function (e) {
                                submitEvtArgs = _.extend(
                                    submitEvtArgs,
                                    {
                                        form: me.getFormInstance(),
                                        ideaInfo: model.get('ideaInfo') // 修改才有的
                                    }
                                );
                                me.fire('submit', submitEvtArgs);
                            }
                        }
                    );

                    FormView.prototype.enterDocument.apply(me, arguments);

                    initTip(me, properties);

                    // 对 components 做处理
                    var components = properties.components;
                    if (components.length) {
                        dealComponents(components, submitEvtArgs, me);
                    }

                    var dynamicItems = properties.dynamicItems;
                    if (dynamicItems) {
                        dealDynamicItems(dynamicItems, me);
                    }
                }
            );
        }
    };

    /**
     * 动态添加表单项的处理
     *
     * @param {Object} dynamicItems 要添加的表单项的配置
     * @param {View} view 当前的 View 对象
     */
    function dealDynamicItems(dynamicItems, view) {
        $('.add-items').each(
            function (i, v) {
                v = $(v);
                var refIdentify = v.data('refIdentify');
                var maxCount = dynamicItems[refIdentify].maxCount;
                var candidateAddItemsConfig = dynamicItems[refIdentify].list;

                var alreadyAddItemsConfig = dynamicItems[refIdentify].alreadyAddItemsConfig;
                var len;
                if (alreadyAddItemsConfig && (len = alreadyAddItemsConfig.length)) {
                    v.attr('data-already-addcount', len);

                    for (var j = 0, l = alreadyAddItemsConfig.length; j < l; j++) {

                        var addItemContainer = $('<div class="add-items-container"></div>');
                        var html = '';
                        html += etplEngine.render('dynamicForm', {
                            formItemConfigs: alreadyAddItemsConfig[j],
                            i18n: {
                                'QXZ': LANG_PKG.QXZ,
                                'ZDXZ': LANG_PKG.ZDXZ,
                                'Ge': LANG_PKG.Ge,
                                'BT': LANG_PKG.BT
                            }
                        });

                        addItemContainer.attr('data-index', alreadyAddItemsConfig[j].index).html(html);

                        v.parents('.form-row').append(addItemContainer);

                        esui.init(
                            addItemContainer[0],
                            {
                                viewContext: view.viewContext
                            }
                        );
                    }
                }

                var alreadyAddcount = v.attr('data-already-addcount') || 0;
                alreadyAddcount = parseInt(alreadyAddcount, 10);
                if (alreadyAddcount >= maxCount) {
                    v.attr('disabled', 'disabled');
                }
                var maxCountArr = [];
                for (var q = 1; q <= maxCount; q++) {
                    maxCountArr.push(q);
                }
                v.on(
                    'click',
                    {
                        view: view,
                        itemsConfig: candidateAddItemsConfig,
                        maxCount: maxCount,
                        maxCountArr: maxCountArr,
                        alreadyAddItemsConfig: alreadyAddItemsConfig,
                        dynamicItems: dynamicItems,
                        refIdentify: refIdentify
                    },
                    addItemFunc
                );
                // if (alreadyAddcount < maxCount) {
                //     var maxCountArr = [];
                //     for (var q = 1; q <= maxCount; q++) {
                //         maxCountArr.push(q);
                //     }
                //     v.on(
                //         'click',
                //         {
                //             view: view,
                //             itemsConfig: candidateAddItemsConfig,
                //             maxCount: maxCount,
                //             maxCountArr: maxCountArr,
                //             alreadyAddItemsConfig: alreadyAddItemsConfig,
                //             dynamicItems: dynamicItems,
                //             refIdentify: refIdentify
                //         },
                //         addItemFunc
                //     );
                // }
                // else {
                //     v.attr('disabled', 'disabled');
                // }

                $('.form-data-body').delegate(
                    '.del-items',
                    'click',
                    {
                        addNode: v,
                        view: view,
                        maxCount: maxCount,
                        refIdentify: refIdentify
                    },
                    delItemFunc
                );
            }
        );
    }

    /**
     * 删除之前动态添加的 formItem
     *
     * @param {jQuery.Element} e jQuery 事件对象
     */
    function delItemFunc(e) {
        e.stopPropagation();
        e.preventDefault();

        var target = $(e.currentTarget);

        var data = e.data;
        var refIdentify = data.refIdentify;

        if (refIdentify == target.attr('data-ref-identify')) {
            $(target.parents('.add-items-container')).remove();
            e.data.view.get(target.attr('data-del-identify')).dispose();
            // 这个删除按钮对应的添加按钮
            var addNode = data.addNode;
            var alreadyAddcount = +addNode.attr('data-already-addcount');

            alreadyAddcount--;
            addNode.attr('data-already-addcount', alreadyAddcount);

            if (alreadyAddcount >= e.data.maxCount) {
                addNode.attr('disabled', 'disabled');
            }
            else {
                addNode.removeAttr('disabled');
            }
        }
    }

    /**
     * 动态添加 formItem
     *
     * @param {jQuery.Element} e jQuery 事件对象
     */
    function addItemFunc(e) {
        e.stopPropagation();
        e.preventDefault();

        var target = $(e.currentTarget);

        // 当前添加按钮所在的这一行的 form-row 节点
        var curFormRowNode = target.parents('.form-row');

        var alreadyAddNode = curFormRowNode.find('.add-items-container');
        var alreadyIndexArr = [];
        alreadyAddNode.each(
            function (i, v) {
                v = $(v);
                alreadyIndexArr.push(+v.attr('data-index'));
            }
        );

        var maxCountArr = e.data.maxCountArr;
        var differenceArr = _.difference(maxCountArr, alreadyIndexArr).sort();

        var alreadyAddcount = +target.attr('data-already-addcount') || 0;
        alreadyAddcount++;

        var flag = 0;
        if (!_.contains(differenceArr, alreadyAddcount)) {
            flag = alreadyAddcount;
            alreadyAddcount = differenceArr[0];
        }

        // 要添加的表单项的配置
        var itemsConfig = $.extend(true, [], e.data.itemsConfig);
        for (var i = 0, l = itemsConfig.length; i < l; i++) {
            itemsConfig[i].id += alreadyAddcount;
            itemsConfig[i].title += alreadyAddcount;
            itemsConfig[i].properties.value = '';
        }

        // 设置删除按钮，只需要在添加出来的一组元素的第一个设置
        // 如果添加的多行元素，在每一行添加的元素后面加上删除按钮是不合理的
        itemsConfig[0].properties.delItems = e.data.refIdentify;

        itemsConfig[0].properties.delIdentify = itemsConfig[0].id;

        var addItemContainer = $('<div class="add-items-container"></div>');
        var html = '';
        html += etplEngine.render('dynamicForm', {
            formItemConfigs: itemsConfig,
            i18n: {
                'QXZ': LANG_PKG.QXZ,
                'ZDXZ': LANG_PKG.ZDXZ,
                'Ge': LANG_PKG.Ge,
                'BT': LANG_PKG.BT
            }
        });

        addItemContainer.attr('data-index', alreadyAddcount).html(html);

        curFormRowNode.append(addItemContainer);

        esui.init(
            addItemContainer[0],
            {
                viewContext: e.data.view.viewContext
            }
        );
        // debugger
        target.attr('data-already-addcount', flag ? flag : alreadyAddcount);

        var maxCount = e.data.maxCount;

        if (+target.attr('data-already-addcount') >= maxCount) {
            target.attr('disabled', 'disabled');
        }
    }

    /**
     * 对 components 的处理
     *
     * @param {Array} components component 集合
     * @param {Object} submitEvtArgs form 提交时的参数，需要在 component 的值改变后修改参数中的值
     * @param {View} view 当前 View 对象
     */
    function dealComponents(components, submitEvtArgs, view) {
        Deferred.all(
            (function () {
                return _.map(
                    components,
                    function (component, index) {
                        return dynamicUtil.loadConfig(
                            './component/' + component.type + '/main',
                            component
                        );
                    }
                );
            })()
        ).then(
            function (d) {
                var args = Array.prototype.slice.call(arguments);
                var componentDataTmp = {};
                var componentCallbackTmp = {};
                /* jshint loopfunc:true */
                for (var i = 0, len = args.length; i < len; i++) {
                    args[i].modExport.on(
                        args[i].component.submitName + 'formSubmitDataChange',
                        function (changedData) {
                            // debugger
                            componentDataTmp[changedData.curFormData.submitName] =
                                changedData.curFormData;
                            componentCallbackTmp[changedData.curFormData.submitName] =
                                changedData.componentCallback;
                            submitEvtArgs = _.extend(
                                submitEvtArgs,
                                {
                                    componentData: componentDataTmp,
                                    componentCallback: componentCallbackTmp
                                }
                            );
                        }
                    );
                    args[i].modExport.init(args[i].component, view);
                }
            }
        );
    }

    /**
     * 设置 formItem 的 tip
     *
     * @param {View} view 当前的 View 对象
     * @param {Object} properties 每一个 formItem 的配置属性对象
     */
    function initTip(view, properties) {
        // 设置 ideaName 的 tip，ideaName 不属于动态 form，它是一个固定的 formItem
        view.initTip(
            LANG_PKG.YZXWG,
            view.get('ideaName')
        );

        // 遍历 properties
        // 初始化 formItem 的 tip
        // 如果是修改的话，那么设置 Uploader 的值
        _.forEach(
            properties,
            function (property, key) {
                if (property.tip) {
                    view.initTip(
                        property.tip,
                        view.get(key)
                    );
                }

                // 说明是 Uploader
                if (property.uploaderVal) {
                    view.get(key).setRawValue(property.uploaderVal);
                }
            }
        );
    }

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
        ret.dynamicItems = {};
        _.forEach(
            formItemConfigs,
            function (formItemConfig, index) {
                if (formItemConfig.type === 'TextBoxs') {
                    for (var i = 0, itemsLen = formItemConfig.items.length; i < itemsLen; i++) {
                        var fc = formItemConfig.items[i];
                        var p = fc.properties;

                        if (p) {
                            ret[fc.id] = p;

                            // 把 Uploader 类型的 formItem 的值直接放入到 p 中，
                            // 便于不用循环就可以回填 Uploader 的值
                            if (formType === 'edit'
                                && fc.type === 'Uploader'
                            ) {
                                var uploaderData = model.get(fc.id);

                                // 如果 uploaderData 不存在，说明这个 Uploader 组件不是必填项
                                if (uploaderData) {
                                    ret[fc.id].uploaderVal = {
                                        width: uploaderData.width || 50,
                                        height: uploaderData.height || 50,
                                        previewUrl: decodeURIComponent(uploaderData)
                                    };
                                }
                            }

                            var subItems = p.subItems;
                            // 存在 subItems，即当前这个 fc.id 的 formItem 后面有添加按钮
                            // 添加按钮添加的元素配置就是 subItems.list 里的配置
                            // 把 subItems 直接挂在 properties.dynamicItems 上，便于之后操作
                            if (subItems) {
                                ret.dynamicItems[fc.id] = subItems;

                                // console.log(model.get('alreadyAddItemsConfigNew'));
                                // console.log(model.get('alreadyAddItemsConfig'));
                                // console.log(fc.id);

                                // var alreadyAddItemsConfig = model.get('alreadyAddItemsConfig');
                                // if (alreadyAddItemsConfig) {
                                //     ret.dynamicItems[fc.id].alreadyAddItemsConfig = alreadyAddItemsConfig;
                                // }

                                var alreadyAddItemsConfigNew = model.get('alreadyAddItemsConfigNew');
                                if (alreadyAddItemsConfigNew) {
                                    for (var i = 0, l = alreadyAddItemsConfigNew.length; i < l; i++) {
                                        if (fc.id == alreadyAddItemsConfigNew[i].refId) {
                                            var curAlreadyAddItemsConfig = alreadyAddItemsConfigNew[i].alreadyAddItemsConfig;
                                            if (curAlreadyAddItemsConfig && curAlreadyAddItemsConfig.length) {
                                                ret.dynamicItems[fc.id].alreadyAddItemsConfig = curAlreadyAddItemsConfig;
                                            }
                                        }
                                    }
                                    // ret.dynamicItems[fc.id].alreadyAddItemsConfig = alreadyAddItemsConfig;
                                }
                            }
                        }

                        var components = fc.components;

                        if (components) {
                            if (!_.isArray(components)) {
                                ret.components.push(components);
                            }
                            else {
                                Array.prototype.push.apply(ret.components, components);
                            }
                        }
                    }
                }
                else {
                    var properties = formItemConfig.properties;

                    if (properties) {
                        ret[formItemConfig.id] = properties;

                        // 把 Uploader 类型的 formItem 的值直接放入到 properties 中，
                        // 便于不用循环就可以回填 Uploader 的值
                        if (formType === 'edit'
                            && formItemConfig.type === 'Uploader'
                        ) {
                            var uploaderData = model.get(formItemConfig.id);

                            // 如果 uploaderData 不存在，说明这个 Uploader 组件不是必填项
                            if (uploaderData) {
                                ret[formItemConfig.id].uploaderVal = {
                                    width: uploaderData.width || 50,
                                    height: uploaderData.height || 50,
                                    previewUrl: decodeURIComponent(uploaderData)
                                };
                            }
                        }

                        var subItems = properties.subItems;
                        // 存在 subItems，即当前这个 formItemConfig.id 的 formItem 后面有添加按钮
                        // 添加按钮添加的元素配置就是 subItems.list 里的配置
                        // 把 subItems 直接挂在 properties.dynamicItems 上，便于之后操作
                        if (subItems) {
                            ret.dynamicItems[formItemConfig.id] = subItems;

                            // console.log(model.get('alreadyAddItemsConfigNew'));
                            // console.log(model.get('alreadyAddItemsConfig'));
                            // console.log(formItemConfig.id);

                            // var alreadyAddItemsConfig = model.get('alreadyAddItemsConfig');
                            // if (alreadyAddItemsConfig) {
                            //     ret.dynamicItems[formItemConfig.id].alreadyAddItemsConfig = alreadyAddItemsConfig;
                            // }

                            var alreadyAddItemsConfigNew = model.get('alreadyAddItemsConfigNew');
                            if (alreadyAddItemsConfigNew) {
                                for (var i = 0, l = alreadyAddItemsConfigNew.length; i < l; i++) {
                                    if (formItemConfig.id == alreadyAddItemsConfigNew[i].refId) {
                                        var curAlreadyAddItemsConfig = alreadyAddItemsConfigNew[i].alreadyAddItemsConfig;
                                        if (curAlreadyAddItemsConfig && curAlreadyAddItemsConfig.length) {
                                            ret.dynamicItems[formItemConfig.id].alreadyAddItemsConfig = curAlreadyAddItemsConfig;
                                        }
                                    }
                                }
                                // ret.dynamicItems[formItemConfig.id].alreadyAddItemsConfig = alreadyAddItemsConfig;
                            }
                        }
                    }

                    var components = formItemConfig.components;

                    if (components) {
                        if (!_.isArray(components)) {
                            ret.components.push(components);
                        }
                        else {
                            Array.prototype.push.apply(ret.components, components);
                        }
                    }
                }

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
