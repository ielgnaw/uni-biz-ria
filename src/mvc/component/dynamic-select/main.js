/**
 * @file dynamic-select 组件入口
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var tpl = require('er/tpl!./main.tpl.html');

    var _ = require('underscore');
    var $ = require('jquery');
    var etpl = require('etpl');
    var esui = require('esui');
    var lib = require('esui/lib');
    var Dialog = require('esui/Dialog');

    /**
     * 当前组件在提交 form 的时候的值
     *
     * @property {string} submieName 提交时的 key ，在 json 中配置的
     * @property {Array} dataList 提交的数据
     *
     * @type {Object}
     */
    var formSubmitData = {
        submitName: '',
        dataList: []
    };

    /**
     * 渲染 esui.Select 组件并绑定 change 事件
     *
     * @param {Object} componentsConf 组件的配置，就是 json 中的配置
     * @param {er.View} view 当前 View 实例
     */
    function renderElem(componentsConf, view) {
        var submitName = componentsConf.submitName;

        if (!submitName) {
            return;
        }

        formSubmitData.submitName = submitName;

        var containerId = componentsConf.containerId;
        var containerDom = $('#' + containerId);

        var dynamicData = view.model.dynamicData;
        var selectData = dynamicData[submitName];

        var etplRenderOpts = {
            renderList: []
        };

        var componentsList = componentsConf.list;
        var count = componentsList.length;

        if (count === 1) {
            etplRenderOpts.renderList.push({
                selectData: selectData,
                id: submitName,
                title: componentsConf.title,
                properties: componentsConf.properties,
                excludeVal: componentsConf.excludeVal,
                required: componentsList[0].rules.required
            });
        }
        else {
            for (var i = 0; i < count; i++) {
                var curItem = componentsList[i];
                etplRenderOpts.renderList.push({
                    selectData: selectData,
                    id: submitName + (i + 1),
                    title: componentsConf.title + (i + 1),
                    properties: componentsConf.properties,
                    excludeVal: componentsConf.excludeVal + (i + 1),
                    required: curItem.rules.required
                });
            }
        }

        var etplEngine = new etpl.Engine();
        etplEngine.compile(tpl);

        containerDom.html(
            etplEngine.render('dynamicSelect', etplRenderOpts)
        );

        esui.init(
            containerDom[0],
            {
                viewContext: view.viewContext
            }
        );

        // data 只有在修改表单的时候才会有
        var editData = componentsConf.data;

        for (var i = 0, len = etplRenderOpts.renderList.length; i < len; i++) {
            var renderData = etplRenderOpts.renderList[i];
            var curNode = view.get(renderData.id);
            curNode.setValue(
                (editData && editData[i]) ? editData[i] : 0
            );
            formSubmitData.dataList.push(curNode.getValue());
            curNode.on(
                'change',
                lib.bind(
                    changeFunc,
                    {
                        view: view,
                        curNode: curNode,
                        index: i,
                        formSubmitData: formSubmitData
                    }
                )
            );
        }

        // 初始化的时候也需要 fire
        // 因为可能编辑 form 的时候，不改动这个组件的值
        exports.fire(
            formSubmitData.submitName + 'formSubmitDataChange',
            {
                curFormData: formSubmitData,
                componentCallback: submitDataFilter
            }
        );

        return formSubmitData;
    }

    /**
     * 判断值在数组中是否重复
     *
     * @param {Array} list 数组
     * @param {string} val 值
     *
     * @return {boolean} 是否重复
     */
    function checkDuplicate(list, val) {
        // debugger
        var count = 1;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i] == val) {
                count++;
            }
        }
        return count > 2 ? true : false;
    }

    /**
     * 下拉框 change 回调
     *
     * @param {Object} e 事件参数
     */
    function changeFunc(e) {
        var me = this;
        var curNode = me.curNode;
        var curFormSubmitData = me.formSubmitData;
        var curSubmitName = curFormSubmitData.submitName;

        curFormSubmitData.dataList[me.index] = curNode.getValue();

        if (checkDuplicate(curFormSubmitData.dataList, curNode.getValue())) {
            Dialog.alert({
                content: '不要重复选择创意'
            });
            curNode.setValue(0);
            return;
        }

        var view = me.view;
        var dynamicData = view.model.dynamicData;
        var curSelectList = dynamicData[curSubmitName];

        // 当前下拉框选择的选项在 dynamicData 中的对应数组
        var curSelectData = _.find(curSelectList, function (item) {
            return item.ideaId == curNode.getValue();
        });

        var curValidityLabel = $(curNode.main).siblings('.component-validity-label');

        if (curSelectData) {
            var auditStatus = curSelectData.auditStatus;
            // auditStatus 0审核通过，2审核中，4审核拒绝
            if (auditStatus == '0') {
                curValidityLabel.removeClass('wait').removeClass('reject')
                    .addClass('pass').html('通过').show();
            }
            else if (auditStatus == '2') {
                curValidityLabel.removeClass('pass').removeClass('reject')
                    .addClass('wait').html('审核中').show();
            }
            else if (auditStatus == '4') {
                curValidityLabel.removeClass('wait').removeClass('pass')
                    .addClass('reject').html('拒绝').show();
            }
        }
        else {
            curValidityLabel.hide();
        }

        exports.fire(
            curSubmitName + 'formSubmitDataChange',
            {
                curFormData: curFormSubmitData,
                componentCallback: submitDataFilter
            }
        );
    }

    /**
     * 把 formSubmitData.dataList 中类似如下的值去掉
     * '请选择机构信息创意'
     * 即去掉默认的值，避免默认的值被提交
     */
    function submitDataFilter(curFormData) {
        var ret = {
            submitName: curFormData.submitName,
            dataList: []
        };
        for (var i = 0, len = curFormData.dataList.length; i < len; i++) {
            var d = curFormData.dataList[i];
            if (d.indexOf('请选择') !== 0) {
                ret.dataList.push(d);
            }
        }
        return ret;
    }

    var exports = {};

    /**
     * 初始化
     *
     * @param {Object} componentsConf 组件的配置，就是 json 中的配置
     * @param {er.View} view 当前 View 实例
     */
    exports.init = function (componentsConf, view) {
        // debugger
        formSubmitData = {
            submitName: '',
            dataList: []
        };
        renderElem(componentsConf, view);
    };

    require('er/Observable').enable(exports);

    return exports;

});
