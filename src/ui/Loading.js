/**
 * @file Loading 组件
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {
    var _ = require('underscore');

    var globalLoading;
    var loadingCount = 0;
    var loadingTimer;

    /**
     * 显示 Loading
     *
     * @param {string} content 内容
     * @param {Object} options 相关配置
     * @param {string} options.content 内容
     */
    function showLoading(content, options) {
        if (!globalLoading) {
            // 此处直接 new 控件出来，
            // 因为这个控件不能属于任何一个业务模块的 ViewContext
            // 不然会随着跳转被销毁，造成下次用不了
            var Toast = require('./Toast');
            var toastOptions = {
                disposeOnHide: false,
                autoShow: false,
                mask: true,
                duration: Infinity,
                skin: 'loading'
            };
            globalLoading = new Toast(toastOptions);
            globalLoading.on(
                'hide',
                _.bind(globalLoading.detach, globalLoading)
            );
            globalLoading.render();
        }

        var properties = {
            content: content || '正在读取数据，请稍候...',
            status: undefined
        };
        properties = _.extend(properties, options);
        globalLoading.setProperties(properties);
        globalLoading.show();
        loadingCount++;
        return globalLoading;
    }

    /**
     * 隐藏 Loading
     */
    function hideLoading() {
        if (globalLoading) {
            loadingCount--;
            if (loadingCount <= 0) {
                loadingCount = 0;
                loadingTimer && clearTimeout(loadingTimer);
                loadingTimer = setTimeout(function () {
                    // 略微等待一段时间再真正隐藏，以免频繁串行请求带来过多闪烁
                    globalLoading.hide();
                }, 500);
            }
        }
    }

    return {
        show: showLoading,
        hide: hideLoading
    };
});
