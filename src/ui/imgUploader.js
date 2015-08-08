/**
 * @file 图片上传组件
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {
    var lib = require('esui/lib');
    var helper = require('esui/controlHelper');
    // var Validity = require('esui/validator/Validity');
    // var ValidityState = require('esui/validator/ValidityState');
    var InputControl = require('esui/InputControl');

    var imgUploadDialog = require('uni-biz-ria/ui/imgUploadDialog');

    require('./Image');

    /**
     * imgUploader控件
     *
     * @param {Object=} options 初始化参数
     * @extends InputControl
     * @constructor
     * @public
     */
    function imgUploader(options) {
        InputControl.apply(this, arguments);
    }

    imgUploader.prototype.type = 'imgUploader';

    /**
     * 默认属性
     *
     * @type {Object}
     * @public
     */
    imgUploader.defaultProperties = {
        buttonWidth: 180,
        imgWidth: 200,
        imgHeight: 150
    };

    /**
     * 创建主元素
     *
     * @return {HTMLElement}
     * @override
     * @protected
     */
    imgUploader.prototype.createMain = function () {
        return document.createElement('div');
    };

    /**
     * 初始化参数
     *
     * @param {Object=} options 构造函数传入的参数
     * @override
     * @protected
     */
    imgUploader.prototype.initOptions = function (options) {
        var properties = {};
        lib.extend(properties, imgUploader.defaultProperties, options);

        // 后端传过来可能是字符串
        properties.imgWidth = parseInt(properties.imgWidth, 10);
        properties.imgHeight = parseInt(properties.imgHeight, 10);

        this.setProperties(properties);
    };

    /**
     * 初始化DOM结构
     *
     * @override
     * @protected
     */
    imgUploader.prototype.initStructure = function () {
        var me = this;

        var html = [
                // 按钮
                '<button id="${id}"',
                    'class="${buttonClasses} ui-button" style="width: ${buttonWidth}px" >',
                    '${text}',
                '</button>'
        ];

        this.main.innerHTML = lib.format(
            html.join(''),
            {
                id: helper.getId(this, 'button'),
                text: me.text,
                buttonClasses: helper.getStateClasses(this, 'button').join(' '),
                buttonWidth: me.buttonWidth
            }
        );

        // 等待试图渲染好了，在设置预览
        setTimeout(function () {
            me.setPreview(me.getRawValue());
        }, 0);

        var button = lib.g(helper.getId(this, 'button'));
        helper.addDOMEvent(
            me,
            button,
            'click',
            function () {

                imgUploadDialog.show({
                    url: me.url || '/file/uploadImage',
                    imgWidth: me.imgWidth || 200,
                    imgHeight: me.imgHeight || 150,
                    editAreaWidth: me.editAreaWidth || 400,
                    editAreaHeight: me.editAreaHeight || 350,
                    maxImgSize: me.maxImgSize || 100000,
                    acceptType: me.acceptType || 'jpg,png,gif',
                    fieldName: me.id || '',
                    description: me.description || [], // 字符串将转成数组
                    dialogOption: {
                        title: me.dialogTitle || '上传图片'
                    },
                    org: me.org,
                    uploadSuccess: function (data) {

                        var url = decodeURIComponent(data.url);
                        var urlSmall = decodeURIComponent(data.urlSmall);

                        me.setValue(url);

                        if (urlSmall) {
                            var cascadeNode = me.viewContext.get(me.smallImgId);
                            if (cascadeNode) {
                                cascadeNode.setValue(urlSmall);
                            }
                        }

                        me.setPreview(data.url);
                    }
                });
            }
        );
    };

    /**
     * 渲染自身
     *
     * @param {string} url 预览地址
     * @override
     * @protected
     */
    imgUploader.prototype.setPreview = function (url) {

        if (url) {
            var me = this;
            var button = lib.g(helper.getId(this, 'button'));

            button.innerHTML = '重新上传图片';

            // 预览
            if (me.previewContainer) {
                var container = me.viewContext.get(me.previewContainer);
                if (!container) {
                    return;
                }

                var preWidth = me.imgWidth;
                var preHeight = me.imgHeight;
                if (preWidth > 200) {
                    preWidth = preWidth / 2;
                    preHeight = preHeight / 2;
                }

                var properties = {
                    url: url,
                    imageType: 'image',
                    width: preWidth,
                    height: preHeight,
                    delCallback: function () {
                        me.setValue('');
                        var cascadeNode = me.viewContext.get(me.smallImgId);
                        if (cascadeNode) {
                            cascadeNode.setValue('');
                        }
                        button.innerHTML = lib.encodeHTML(me.text);
                    }
                };
                container.setProperties(properties);
            }
        }
    };

    /**
     * 渲染自身
     *
     * @override
     * @protected
     */
    imgUploader.prototype.repaint = helper.createRepaint(
        InputControl.prototype.repaint,
        {
            name: ['disabled', 'readOnly'],
            paint: function (uploader, disabled, readOnly) {
                var button = lib.g(helper.getId(uploader, 'button'));
                button.disabled = disabled;
                button.readOnly = readOnly;
            }
        }
    );

    /**
     * 销毁控件
     *
     * @override
     */
    imgUploader.prototype.dispose = function () {
        InputControl.prototype.dispose.apply(this, arguments);
    };

    lib.inherits(imgUploader, InputControl);
    require('esui').register(imgUploader);
    return imgUploader;
});
