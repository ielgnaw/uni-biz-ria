/**
 * @file 动态 form Model
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var _ = require('underscore');
    var UIModel = require('ef/UIModel');
    var util = require('er/util');
    var uniUtil = require('../util');

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

        // curNest 是在子 Model 类的 prepare 赋值的
        var curNest = me.curNest;
        if (!curNest) {
            return;
        }

        var formItemConfigs = uniUtil.parseJson(curNest.nestForm) || [];

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

            for (var i = 0, len = formItemConfigs.length; i < len; i++) {
                var formItem = formItemConfigs[i];

                if (auditStatusFlag) {
                    formItem.properties
                            && (formItem.properties.disabled = 1);
                }

                var key = formItem.id;
                var value = formData[key];

                me.set(key, value);

                if (value) {
                    // 标识控件是否选中
                    // BoxGroup 时用 checked 标识
                    // Select 时用 selected 标识
                    var sc = '';
                    if (formItem.type === 'BoxGroup') {
                        sc = 'checked';
                    }
                    else if (formItem.type === 'Select') {
                        sc = 'selected';
                    }

                    // 这里判断是为了让非 BoxGroup ， Select 的控件不走下面循环的逻辑
                    if (sc) {
                        for (var j = 0, jLen = formItem.list.length; j < jLen; j++) {
                            if (value.indexOf(formItem.list[j].value) >= 0) {
                                formItem.list[j][sc] = 1;
                            }
                            else {
                                delete formItem.list[j][sc];
                            }
                        }
                    }
                }
            }
        }

        UIModel.prototype.prepare.apply(me, arguments);
    };

    util.inherits(DynamicFormModel, UIModel);

    return DynamicFormModel;
});
