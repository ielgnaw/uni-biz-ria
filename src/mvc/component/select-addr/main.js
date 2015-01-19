/**
 * @file select-addr 组件入口
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var $ = require('jquery');
    var etpl = require('etpl');
    var esui = require('esui');
    var lib = require('esui/lib');

    var povince = require('./provinceData');
    var city = require('./cityData');

    var tpl = require('er/tpl!./main.tpl.html');

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

        formSubmitData.submitName = componentsConf.submitName || '';

        var containerId = componentsConf.containerId;
        var containerDom = $('#' + containerId);

        var etplEngine = new etpl.Engine();
        etplEngine.compile(tpl);

        var componentList = componentsConf.list;
        var etplRenderOpts = {
            componentList: componentList
        };

        containerDom.html(
            etplEngine.render('selectAddr', etplRenderOpts)
        );

        esui.init(
            containerDom[0],
            {
                viewContext: view.viewContext
            }
        );

        // data 只有在修改表单的时候才会有
        var editData = componentsConf.data;

        for (var i = 0, len = componentList.length; i < len; i++) {
            var component = componentList[i];
            view.get('prov' + component.index).updateDatasource(povince.getAll());
            // 默认选中北京，如果是修改，那么回填之前的值
            view.get('prov' + component.index).setValue(
                (editData && editData[i]) ? editData[i].prov : 0
            );
            view.get('prov' + component.index).on(
                'change',
                lib.bind(
                    changeProv,
                    {
                        view: view,
                        index: component.index,
                        formSubmitData: formSubmitData
                    }
                )
            );

            view.get('city' + component.index).updateDatasource(
                city.getCityByProvince(view.get('prov' + component.index).getValue())
            );
            view.get('city' + component.index).setValue(
                (editData && editData[i]) ? editData[i].city : 0
            );
            view.get('city' + component.index).on(
                'change',
                lib.bind(
                    changeCity,
                    {
                        view: view,
                        index: component.index,
                        formSubmitData: formSubmitData
                    }
                )
            );

            view.get('addr' + component.index).setValue(
                (editData && editData[i]) ? editData[i].addr : ''
            );
            view.get('addr' + component.index).on(
                'change',
                lib.bind(
                    changeAddr,
                    {
                        view: view,
                        index: component.index,
                        formSubmitData: formSubmitData
                    }
                )
            );

            formSubmitData.dataList.push({
                prov: view.get('prov' + component.index).getValue(),
                city: view.get('city' + component.index).getValue(),
                addr: view.get('addr' + component.index).getValue() || ''
            });
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
     * 省份下拉框 change 回调
     *
     * @param {Object} e 事件参数
     */
    function changeProv(e) {
        var me = this;
        var provVal = e.target.getValue();
        var cityList = city.getCityByProvince(provVal);
        me.view.get('city' + me.index).updateDatasource(cityList);

        me.formSubmitData.dataList[me.index - 1].prov = provVal;
        me.formSubmitData.dataList[me.index - 1].city = me.view.get('city' + me.index).getValue();

        // submitDataFilter(formSubmitData);

        exports.fire(
            me.formSubmitData.submitName + 'formSubmitDataChange',
            {
                curFormData: formSubmitData,
                componentCallback: submitDataFilter
            }
        );
    }

    /**
     * 城市下拉框 change 回调
     *
     * @param {Object} e 事件参数
     */
    function changeCity(e) {
        var me = this;
        var cityVal = e.target.getValue();
        me.formSubmitData.dataList[me.index - 1].city = cityVal;
        exports.fire(
            me.formSubmitData.submitName + 'formSubmitDataChange',
            {
                curFormData: formSubmitData,
                componentCallback: submitDataFilter
            }
        );
    }

    /**
     * 地址文本框 change 回调
     *
     * @param {Object} e 事件参数
     */
    function changeAddr(e) {
        var me = this;
        var cityVal = e.target.getValue();
        me.formSubmitData.dataList[me.index - 1].addr = cityVal;
        exports.fire(
            me.formSubmitData.submitName + 'formSubmitDataChange',
            {
                curFormData: formSubmitData,
                componentCallback: submitDataFilter
            }
        );
    }

    /**
     * 把 formSubmitData.dataList 中类似如下的值去掉
     * {
     *     addr: '',
     *     prov: '请选择省份',
     *     city: '请选择城市'
     * }
     * 即去掉默认的值，避免默认的值被提交
     */
    function submitDataFilter(curFormData) {
        var ret = {
            submitName: curFormData.submitName,
            dataList: []
        };
        for (var i = 0, len = curFormData.dataList.length; i < len; i++) {
            var d = curFormData.dataList[i];
            if (d.addr || d.city !== '请选择城市' || d.prov !== '请选择省份') {
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
        formSubmitData = {
            submitName: '',
            dataList: []
        };
        renderElem(componentsConf, view);
    };

    require('er/Observable').enable(exports);

    return exports;

});
