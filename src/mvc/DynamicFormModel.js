/**
 * @file 动态 form Model
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var _ = require('underscore');

    var UIModel = require('ef/UIModel');
    var util = require('er/util');
    var uniUtil = require('../util');

    var LANG_PKG = require('../lang').getLangPkg();

    /**
     * 默认的 form 类型
     *
     * @type {string}
     */
    var DEFALUT_FORM_TYPE = 'create';

    /**
     * 动态 Form Model 基类
     *
     * @extends UIModel
     * @constructor
     */
    function DynamicFormModel() {
        UIModel.apply(this, arguments);
    }

    /**
     * 动态 form 类型， create 添加， edit 修改
     *
     * @type {string}
     */
    DynamicFormModel.prototype.formType = DEFALUT_FORM_TYPE;

    /**
     * form 提交的 url
     *
     * @type {string}
     */
    DynamicFormModel.prototype.submitUrl = '';

    /**
     * 上传组件的上传地址
     *
     * @type {string}
     */
    DynamicFormModel.prototype.uploadUrl = '';

    /**
     * 主域检查的 url
     *
     * @type {string}
     */
    DynamicFormModel.prototype.checkDomainUrl = '';

    /**
     * 当前的 nest 对象，这个系统是根据 nestId 来做的
     *
     * @type {Object}
     */
    DynamicFormModel.prototype.curNest = {};

    /**
     * dynamicForm 表单项的配置
     *
     * @type {Array.<Object>}
     */
    DynamicFormModel.prototype.formItemConfigs = [];

    /**
     * 数据处理
     *
     * @override
     */
    DynamicFormModel.prototype.prepare = function () {
        var me = this;

        // 这三个 key 是在子 Model 类实例化的时候赋值并在 prepare 中做过处理
        me.set('formType', me.formType);
        me.set('uploadUrl', me.uploadUrl);
        me.set('submitUrl', me.submitUrl);
        me.set('checkDomainUrl', me.checkDomainUrl);

        // curNest 是在子 Model 类的 prepare 赋值的
        var curNest = me.curNest;
        if (!curNest) {
            return;
        }

        var formItemConfigs = uniUtil.parseJson(curNest.nestForm) || [];

        transformFormConfigLang(formItemConfigs);

        for (var i = 0, len = formItemConfigs.length; i < len; i++) {
            var formItem = formItemConfigs[i];
            var components = formItem.components;
            if (components) {
                if (!_.isArray(components)) {
                    formItem.components = [components];
                }
            }
        }

        me.set('curNest', curNest);
        me.set('nestId', curNest.nestId);
        me.set('formItemConfigs', formItemConfigs);

        if (me.showCurNest) {
            try {
                if (window.console && window.console.log) {
                    console.log(curNest);
                    console.log(curNest.nestForm);
                    console.log(curNest.nestId);
                }
            }
            catch (ex) {}
        }

        var ideaInfo = me.get('ideaInfo');

        // 说明是修改，那么要进行 form 的回填
        if (me.get('formType') === 'edit' && ideaInfo) {

            // ideaName 是必须的，不从动态配置里面读取
            me.set('ideaName', ideaInfo.ideaName);

            var auditStatusFlag = false;

            // 审核通过时，所有表单项禁用
            if (ideaInfo.auditStatusS === 0) {
                auditStatusFlag = true;
                me.set('isDisabled', 1);
            }

            var formData = ideaInfo.ideaInfoS
                ? uniUtil.parseJson(ideaInfo.ideaInfoS)
                : '';

            var alreadyAddItemsConfigNew = [];

            for (var i = 0, len = formItemConfigs.length; i < len; i++) {
                var formItemConfig = formItemConfigs[i];

                if (auditStatusFlag) {
                    formItemConfig.properties
                            && (formItemConfig.properties.disabled = 1);
                }

                // 回填自定义组件的值
                var components = formItemConfig.components;
                if (components) {
                    if (!_.isArray(components)) {
                        formItemConfig.components = [components];
                        formItemConfig.components.data =
                            formData[formItemConfig.components.submitName];
                    }
                    else {
                        /* jshint maxdepth: 6 */
                        for (var j = 0, componentsLen = components.length; j < componentsLen; j++) {
                            formItemConfig.components[j].data =
                                formData[formItemConfig.components[j].submitName];
                        }
                    }
                }

                var key = formItemConfig.id;
                var value = formData[key];

                me.set(key, value);

                if (value) {
                    // 标识控件是否选中
                    // BoxGroup 时用 checked 标识
                    // Select 时用 selected 标识
                    var sc = '';
                    if (formItemConfig.type === 'BoxGroup') {
                        sc = 'checked';
                    }
                    else if (formItemConfig.type === 'Select') {
                        sc = 'selected';
                    }

                    // 这里判断是为了让非 BoxGroup ， Select 的控件不走下面循环的逻辑
                    if (sc) {
                        for (var j = 0, jLen = formItemConfig.list.length; j < jLen; j++) {
                            if (value.indexOf(formItemConfig.list[j].value) >= 0) {
                                formItemConfig.list[j][sc] = 1;
                            }
                            else {
                                delete formItemConfig.list[j][sc];
                            }
                        }
                    }
                }

                var properties = formItemConfig.properties;
                if (properties) {
                    var subItems = formItemConfig.properties.subItems;
                    if (subItems) {
                        alreadyAddItemsConfigNew.push({
                            refId: formItemConfig.id,
                            alreadyAddItemsConfig: dealSubItems(formItemConfig.id, subItems, formData, me)
                        })
                    }
                }
            }

            me.set('alreadyAddItemsConfigNew', alreadyAddItemsConfigNew);
        }

        // 这里设置 dynamicForm.tpl.html 中的文案
        var i18n = $.extend(
            true,
            {},
            me.get('i18n'),
            {
                'GLBS': LANG_PKG.GLBS,
                'GLBS1': LANG_PKG.GLBS1,
                'ZD30GZF': LANG_PKG.ZD30GZF,
                'BT': LANG_PKG.BT,
                'QX': LANG_PKG.QX,
                'BC': LANG_PKG.BC,
                'FH': LANG_PKG.FH,
                'YJSHBNXG': LANG_PKG.YJSHBNXG,
                'QXZ': LANG_PKG.QXZ,
                'ZDXZ': LANG_PKG.ZDXZ,
                'Ge': LANG_PKG.Ge,
                'JGJCXX': LANG_PKG.JGJCXX
            }
        );

        me.set('i18n', i18n);

        UIModel.prototype.prepare.apply(me, arguments);
    };

    function dealSubItems(refIdentify, subItemsConfig, data, model) {
        var list = subItemsConfig.list;
        var dataKeys = _.keys(data);
        var ret = [];
        var t = [];
        // debugger
        for (var j = 0, len = dataKeys.length; j < len; j++) {
            for (var i = 0, l = list.length; i < l; i++) {
                var cloneObj = $.extend(true, {}, list[i]);
                if (new RegExp('^' + cloneObj.id + '(\\d*)$').test(dataKeys[j])) {
                    cloneObj.id += RegExp.$1;
                    cloneObj.title += RegExp.$1;

                    var value = data[dataKeys[j]];

                    // 标识控件是否选中
                    // BoxGroup 时用 checked 标识
                    // Select 时用 selected 标识
                    var sc = '';
                    if (cloneObj.type === 'BoxGroup') {
                        sc = 'checked';
                    }
                    else if (cloneObj.type === 'Select') {
                        sc = 'selected';
                    }

                    // 这里判断是为了让非 BoxGroup ， Select 的控件不走下面循环的逻辑
                    if (sc) {
                        for (var m = 0, jLen = cloneObj.list.length; m < jLen; m++) {
                            if (value.indexOf(cloneObj.list[m].value) >= 0) {
                                cloneObj.list[m][sc] = 1;
                            }
                            else {
                                delete cloneObj.list[m][sc];
                            }
                        }
                    }
                    else {
                        cloneObj.properties.value = value;
                    }

                    t.push(cloneObj);
                    if (i === 0) {
                        cloneObj.properties.delItems = refIdentify;
                        cloneObj.properties.delIdentify = cloneObj.id;
                    }
                    if (i === l - 1) {
                        t.index = RegExp.$1;
                        ret.push(t);
                        t = [];
                    }
                }
            }
        }
        model.set('alreadyAddItemsConfig', ret);
        return ret;
    }

    /**
     * 替换 form 配置中的语言包
     * 如果在语言包中没有找到对应的语言，则使用 form 配置中原有的，不进行替换
     *
     * @param {Array|Object|string|number} formConfigs form 配置
     *
     * @return {Array} 替换语言包后的 form 配置
     */
    function transformFormConfigLang(formConfigs) {
        for (var i = 0, len = formConfigs.length; i < len; i++) {
            var formConfig = formConfigs[i];
            if ($.isArray(formConfig)) {
                dealArray(formConfig);
            }
            else if ($.isPlainObject(formConfig)) {
                dealObject(formConfig);
            }
            else {
                formConfig = LANG_PKG[formConfig] || formConfig;
            }
        }
    }

    /**
     * 对 formConfig 中的对象值进行语言替换的处理
     *
     * @param {Object} obj 对象值
     */
    function dealObject(obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if ($.isArray(obj[i])) {
                    dealArray(obj[i]);
                }
                else if ($.isPlainObject(obj[i])) {
                    dealObject(obj[i]);
                }
                else {
                    if (i !== 'value') {
                        obj[i] = LANG_PKG[obj[i]] || obj[i];
                    }
                }
            }
        }
    }

    /**
     * 对 formConfig 中的数组值进行语言替换的处理
     *
     * @param {Object} arr 数组值
     */
    function dealArray(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if ($.isArray(arr[i])) {
                dealArray(arr[i]);
            }
            else if ($.isPlainObject(arr[i])) {
                dealObject(arr[i]);
            }
            else {
                arr[i] = LANG_PKG[arr[i]] || arr[i];
            }
        }
    }

    util.inherits(DynamicFormModel, UIModel);

    return DynamicFormModel;
});
