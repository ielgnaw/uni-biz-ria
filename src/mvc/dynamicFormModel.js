/**
 * @file 动态 form Model
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var UIModel = require('ef/UIModel');
    var util = require('er/util');

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
     * 上传组件的上传地址
     *
     * @type {string}
     */
    DynamicFormModel.prototype.uploadUrl = '';

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
        me.set('formType', me.formType);
        me.set('uploadUrl', me.uploadUrl);
        me.set('formItemConfigs', me.formItemConfigs);
        UIModel.prototype.prepare.apply(me, arguments);
    };

    util.inherits(DynamicFormModel, UIModel);

    return DynamicFormModel;
});
