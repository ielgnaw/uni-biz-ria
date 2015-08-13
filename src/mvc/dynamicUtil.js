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
    var ejson = require('../io/ejson');

    var LANG_PKG = require('../lang').getLangPkg();

    var BYTE_PATTERN = /[^\x00-\xff]/g;

    function sendCheckReq(u, index) {
        var loading = new Deferred();
        ejson.post(
            u.url,
            {
                check: u.esuiDom.getValue()
            }
        ).then(function (data) {
            loading.resolve({
                esuiDom: u.esuiDom,
                data: data
            });
        }, function (statusInfo) {
            loading.resolve({
                esuiDom: u.esuiDom,
                data: statusInfo
            });
        });
        return loading.promise;
    }

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
        var model = view.model;
        var validStatus = 1;
        // var checkDomainUrl = model.get('checkDomainUrl');
        if (!len) {
            defer.resolve(validStatus);
        }
        else {
            var urls = [];
            for (var index = 0; index < len; index++) {
                var dom = $(ajaxValidDoms[index]);
                var checkDomainUrl = dom.attr('ajax-valid') || model.get('checkDomainUrl');
                if (checkDomainUrl) {
                    checkDomainUrl += ''
                        + '?isAjax=1&userId='
                        + model.userId
                        + '&nestId='
                        + model.nestId;
                    var esuiDom = view.get(dom.attr('name'));
                    urls.push({
                        url: checkDomainUrl,
                        esuiDom: esuiDom,
                        data: {
                            check: esuiDom.getValue()
                        }
                    });
                }
            }

            Deferred.all(
                (function () {
                    return _.map(
                        urls,
                        function (url, index) {
                            return sendCheckReq(url, index);
                        }
                    );
                })()
            ).then(
                function () {
                    var allData = Array.prototype.slice.call(arguments, 0);
                    for (var i = 0, l = allData.length; i < l; i++) {
                        if (uniUtil.isString(allData[i].data)) {
                            validStatus = -1;
                            var validityLabel = allData[i].esuiDom.getValidityLabel();
                            validityLabel.display(false, allData[i].data);
                            validityLabel.show();
                        }
                    }
                    defer.resolve(validStatus);
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

            var emptyTip = curDom.attr('data-ui-emptyTip');
            if (emptyTip) {
                if (selectItemText == emptyTip || esuiDom.getValue() == emptyTip) {
                    Dialog.alert({
                        content: emptyTip
                    });
                    ret = false;
                    break;
                }
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

        outerloop:
        for (var i = 0, len = componentContainers.length; i < len; i++) {
            var componentContainer = $(componentContainers[i]);
            var textBoxs = $('[data-ui-type="TextBox"]', componentContainer);

            for (var j = 0, jLen = textBoxs.length; j < jLen; j++) {
                var curTextBox = $(textBoxs[j]);
                if (curTextBox.attr('data-ui-required') == '1'
                    || curTextBox.attr('data-ui-exRequired') == '1'
                ) {
                    var esuiKey = curTextBox.attr('data-ui-name')
                        || curTextBox.attr('data-ui-id');
                    var esuiDom = view.get(esuiKey);
                    if (!esuiDom.getValue()) {
                        Dialog.alert({
                            content: LANG_PKG.QTX + (esuiDom.get('title') || LANG_PKG.JGDZ)
                        });
                        ret = false;
                        break outerloop;
                    }
                }
            }
        }

        return ret;
    };

    /**
     * 验证 form 中必填的 TextBox 的 max-byte-length 和 min-byte-length
     * 正常来说，会通过 esui.Form 的 valid 来验证
     * 但是这样验证必须把 formItem 作为一个表单项即要设置 data-ui-name 属性才生效，设置了
     * data-ui-name 属性后，就会把这个 formItem 项提交给后端，所以这里单独验证下
     *
     * @param {er.View} view 当前 View
     *
     * @return {boolean}
     */
    dynamicUtil.validTextBoxByteLength = function (view) {
        var ret = true;

        var componentContainers = $('.component-container');

        for (var i = 0, len = componentContainers.length; i < len; i++) {
            var componentContainer = $(componentContainers[i]);
            var textBoxs = $('input[data-ui-type="TextBox"]', componentContainer);

            for (var j = 0, jLen = textBoxs.length; j < jLen; j++) {
                var curTextBox = $(textBoxs[j]);
                var val = curTextBox.val();
                if (val) {
                    var esuiKey = curTextBox.attr('data-ui-name')
                        || curTextBox.attr('data-ui-id');
                    var esuiDom = view.get(esuiKey);

                    var maxByteLength = parseInt(curTextBox.attr('data-max-byte-length') || 0, 10);
                    var minByteLength = parseInt(curTextBox.attr('data-min-byte-length') || 0, 10);
                    var byteLength = val.replace(BYTE_PATTERN, 'xx').length;
                    if ((maxByteLength !== 0 && byteLength > maxByteLength)
                        || (minByteLength !== 0 && byteLength < minByteLength)
                    ) {
                        Dialog.alert({
                            content: ''
                                + (esuiDom.get('title') || '机构地址')
                                + '最少'
                                + minByteLength
                                + '个字符（'
                                + minByteLength / 2
                                + '个汉字），'
                                + '最多'
                                + maxByteLength
                                + '个字符（'
                                + maxByteLength / 2
                                + '个汉字）'
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
