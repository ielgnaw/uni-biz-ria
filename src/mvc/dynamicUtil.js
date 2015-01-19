/**
 * @file dynamicForm 一些常用方法，例如
 * 1. 对 form　表单项进行额外的验证
 *     a. form 中需要额外发送请求验证的元素
 *     b. checkbox 是否选中、选中个数
 *     c. select 是否选择有效值 等等
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var $  = require('jquery');
    var _ = require('underscore');
    var Deferred = require('er/Deferred');
    var Dialog = require('esui/Dialog');
    var uniUtil = require('../util');

    var LANG_PKG = require('../lang').getLangPkg();

    var dynamicUtil = {};

    /**
     * 提交表单之前验证 form 中需要额外发送请求验证的元素
     *
     * @param {er.View} view 当前 View
     *
     * @return {Promise}
     */
    dynamicUtil.validAjax = function (view) {
        var ajaxValidDoms = $('[ajax-valid]');
        var len = ajaxValidDoms.length;
        var defer = new Deferred();
        var ret = [];
        var model = view.model;
        var checkDomainUrl = model.get('checkDomainUrl');
        if (!len || !checkDomainUrl) {
            defer.resolve(ret);
        }
        else {
            _.forEach(
                ajaxValidDoms,
                function (ajaxValidDom, index) {
                    var dom = $(ajaxValidDom);
                    var esuiDom = view.get(dom.attr('name'));
                    var domValue = esuiDom.getValue();
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: checkDomainUrl,
                        data: {
                            check: domValue
                        }
                    }).done(
                        function (data) {
                            // 当 domValue 不存在时，也需要发这个请求
                            // 是为了让 defer.resolve 只有这一个出口
                            if (!domValue) {
                                ret.push({
                                    data: {
                                        status: 0
                                    },
                                    esuiDom: esuiDom
                                });
                            }
                            else {
                                 ret.push({
                                    data: data,
                                    esuiDom: esuiDom
                                });
                            }
                            if (index === len - 1) {
                                defer.resolve(ret);
                            }
                        }
                    );
                }
            );
        }
        return defer.promise;
    };

    /**
     * 验证 form 中的多选框
     */
    dynamicUtil.validCheckbox = function () {
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
                        ) || LANG_PKG.QXZDXK
                    });
                    ret = false;
                    break;
                }
                else {
                    var maxSelectedCount = checkboxContainer[i].getAttribute(
                        'boxgroup-max-selected-count'
                    );

                    // 如果 maxSelectedCount 不存在或者不是数字就不验证了
                    if (maxSelectedCount
                        && !isNaN(maxSelectedCount)
                        && maxSelectedCount < length
                    ) {
                        Dialog.alert({
                            content: checkboxContainer[i].getAttribute(
                                'boxgroup-max-selected-count-error-message'
                            ) || LANG_PKG.GSCG
                        });
                        ret = false;
                        break;
                    }
                }
            }
        }

        return ret;
    };

    /**
     * 验证 form 中的 select
     *
     * @param {er.View} view 当前 View
     *
     * @return {boolean}
     */
    dynamicUtil.validSelect = function (view) {
        var ret = true;

        var candidateSelectDoms = $('[select-required="1"]');
        for (var i = 0, len = candidateSelectDoms.length; i < len; i++) {
            var curDom = $(candidateSelectDoms[i]);
            var esuiKey = curDom.attr('data-ui-name')
                    || curDom.attr('data-ui-id');
            var esuiDom = view.get(esuiKey);
            var excludeVal = curDom.attr('data-ui-excludeVal');
            var selectItemText = esuiDom.getSelectedItem().name;

            if (selectItemText == excludeVal || esuiDom.getValue() == excludeVal) {
                Dialog.alert({
                    content: LANG_PKG.QXZ + (esuiDom.get('title') || '')
                });
                ret = false;
                break;
            }
        }
        return ret;
    };

    /**
     * 验证 form 中必填的 TextBox 是否填写
     * 正常来说，会通过 esui.Form 的 valid 来验证
     * 但是这样验证必须把 formItem 作为一个表单项即要设置 data-ui-name 属性才生效，设置了
     * data-ui-name 属性后，就会把这个 formItem 项提交给后端，所以这里单独验证下
     *
     * @param {er.View} view 当前 View
     *
     * @return {boolean}
     */
    dynamicUtil.validTextBox = function (view) {
        var ret = true;

        var componentContainers = $('.component-container');

        for (var i = 0, len = componentContainers.length; i < len; i++) {
            var componentContainer = $(componentContainers[i]);
            var textBoxs = $('[data-ui-type="TextBox"]', componentContainer);

            for (var j = 0, jLen = textBoxs.length; j < jLen; j++) {
                var curTextBox = $(textBoxs[j]);
                if (curTextBox.attr('data-ui-required') == '1') {
                    var esuiKey = curTextBox.attr('data-ui-name')
                        || curTextBox.attr('data-ui-id');
                    var esuiDom = view.get(esuiKey);
                    if (!esuiDom.getValue()) {
                        Dialog.alert({
                            content: LANG_PKG.QTX + (esuiDom.get('title') || LANG_PKG.JGDZ)
                        });
                        ret = false;
                        break;
                    }
                }
            }
        }

        return ret;
    };


    /**
     * 验证 form 中配置的 rules.cascadeRequired 是否填写
     * 当前 node 填写后，如果配置了 rules.cascadeRequired ，
     * 那么需要验证 rules.cascadeRequired 里的 node 节点是否填写
     *
     * @param {er.View} view 当前 View
     *
     * @return {boolean}
     */
    dynamicUtil.validCascadeRequired = function (view) {
        var ret = true;

        var candidates = {};

        var cascadeDoms = $('[cascade-required]');
        for (var i = 0, len = cascadeDoms.length; i < len; i++) {
            var curDom = $(cascadeDoms[i]);
            var cascadeVal = curDom.attr('cascade-required');
            var esuiKey = curDom.attr('id') || curDom.attr('name');
            var esuiDom = view.get(esuiKey);
            var val = uniUtil.trim(esuiDom.getValue());
            if (val && cascadeVal) {
                var cascadeArr = cascadeVal.split(',');
                while (cascadeArr.length) {
                    var c = cascadeArr.shift();
                    candidates[c] = 1;
                }
            }
        }

        for (var i in candidates) {
            if (candidates.hasOwnProperty(i)) {
                var candidate = view.get(i);
                if (candidate) {
                    if (!uniUtil.trim(candidate.getValue())) {
                        Dialog.alert({
                            content: LANG_PKG.QTX + (candidate.get('title'))
                        });
                        ret = false;
                        break;
                    }
                }
            }
        }

        return ret;
    };

    /**
     * 加载 form 自定义组件
     *
     * @param {string} loadUrl 组件 url
     * @param {Object} component 组件对象
     *
     * @return {Promise}
     */
    dynamicUtil.loadConfig = function (loadUrl, component) {
        var loading = new Deferred();
        require(
            [loadUrl],
            function (modExport) {
                loading.resolve({
                    modExport: modExport,
                    component: component
                });
            }
        );
        return loading.promise;
    };

    return dynamicUtil;
});
