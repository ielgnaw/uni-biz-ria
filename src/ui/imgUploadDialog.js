/**
 * @file imgUploadDialog 上传图片对话框
 * @author wukaifang(wukaifang@baidu.com)
 */

define(function (require) {

    var Dialog = require('esui/Dialog');
    var esui = require('esui');

    var uniUtil = require('uni-biz-ria/util');
    var $ = require('jquery');
    var loading = require('uni-biz-ria/ui/Loading');
    var sys = require('sys');
    var webInfo = sys.getWebInfo();
    var ImageCrop = require('imageCrop');
    var lib = require('esui/lib');

    var dialogId = 'img-upload-dialog';
    var dialogTpl = '<div id="' + dialogId + '"></div>';

    var contentTpl = [
        '<div class="img-upload-container">',
            '<div class="img-upload-tip">',
                '<label>请选择图片进行修剪，最终效果如右图所示</label>',
                '<ul>${liText}</ul>',
            '</div>',
            '<div class="img-upload-area" >',
                '<div class="img-updload-edit" id="img-updload-edit">',
                '</div>',
                '<div class="img-upload-preview"></div>',
            '</div>',
        '</div>'
    ].join('');

    /**
     * Dialog 对象dialog
     *
     * @type {Object}
     */
    var dialog;

    /**
     * 图片上传控件实例
     *
     * @type {Object}
     */
    var imageCrop;

    /**
     * 新建一个对话框
     *
     * @param  {Object} args 参数
     * @return {Dialog}
     */
    function createDialog(args) {

        // 准备对话框内容
        $(document.body).append(dialogTpl);

        // 实例化一个对话框
        var dialog = esui.create('Dialog',
            {
                main: $('#' + dialogId).get(0),
                needFoot: false
            }
        );

        dialog.render();

        // 处理对话框的参数，以便显示
        if (typeof args.description === 'string') {
            args.description = [args.description];
        }

        var sizeText = args.imgWidth + ' x ' + args.imgHeight;
        args.description.push('尺寸：' + sizeText);

        var liText = '';
        for (var i = 0; i < args.description.length; i++) {
            liText += '<li>' + (i + 1) + '. ' + args.description[i] + '</li>';
        }

        // 设置对话框的内容
        dialog.setContent(
            lib.format(
                contentTpl,
                {
                    sizeText: sizeText,
                    liText: liText
                }
            )
        );

        // 设置对话框的参数
        dialog.setProperties(args.dialogOption);

        // 之所以设置这个高度，是因为，如果不设置该高度，此时flash还在加载中，无法计算其高度，导致对话框显示位置偏下。
        $('.img-upload-area').css('height', args.flashHeight);

        dialog.show();

        return dialog;
    }

    var exports = {};

    /**
     * 显示可编辑的对话框表单
     *
     * @param {Object} args 对话框参数
     *
     * @return {string} 一个唯一的ID
     */
    exports.show = function (args) {

        // 默认参数
        var defaultArgs = {
            url: '/file/uploadImage',
            imgWidth: 200,
            imgHeight: 150,
            maxImgSize: 100000,
            editAreaWidth: 400,
            editAreaHeight: 350,
            acceptType: 'jpg,png,gif',
            fieldName: '',
            description: [], // 字符串将转成数组
            dialogOption: {
                width: 660,
                height: '',
                title: '上传图片',
                draggable: true
            },
            uploadSuccess: function (data) {

            },
            uploadFail: function (data) {

            }
        };

        // 合并参数
        args = $.extend({}, true, defaultArgs, args);

        // 调整某些参数
        args.editAreaWidth = Math.max(args.imgWidth, args.editAreaWidth) + 5;
        args.editAreaHeight = Math.max(args.imgHeight, args.editAreaHeight) + 5;
        args.flashWidth = args.editAreaWidth + 20 + args.imgWidth + 2;
        args.dialogOption.width = args.flashWidth + 36;
        args.flashHeight = Math.max(args.editAreaHeight + 40, args.imgHeight + 40);

        // 使用参数初始化对话框
        dialog = createDialog(args);

        // 当点击关闭按钮时，释放内存
        dialog.on('hide', exports.hide);

        // 开始处理flash逻辑

        // 处理上传URL的参数,通过该图片上传的字段名获取表单配置
        var curNest = webInfo.curNest || {};
        var formItemConfigs = uniUtil.parseJson(curNest.nestForm) || [];
        var imgConf = {};
        for (var i = 0; i < formItemConfigs.length; i++) {
            if (formItemConfigs[i].id === args.fieldName) {
                imgConf = formItemConfigs[i];
            }
        }

        var actionParams = {
            isAjax: 1,
            userId: webInfo.userId,
            nestId: webInfo.nestId,
            picName: args.fieldName
        };

        if (args.org) {
            actionParams.org = 1;
        }

        if (imgConf.properties && imgConf.properties.args) {
            if (imgConf.properties.args.compress) {
                actionParams.compress = imgConf.properties.args.compress;
            }
            if (imgConf.properties.args.engine) {
                actionParams.engine = imgConf.properties.args.engine;
            }
        }

        // 准备相关图片参数和文本去实例化上传控件
        var w = args.imgWidth;
        var h = args.imgHeight;
        var sizeText =  w + ' x ' + h;

        // 实例化上传控件
        imageCrop = new ImageCrop({
            element: $('#img-updload-edit'),
            // flashUrl: './src/imageCrop.swf',
            width: args.flashWidth,
            height: args.flashHeight,
            adaptive: true,

            action: args.url + '?' + $.param(actionParams),
            accept: args.acceptType,

            // minSize: 1,
            maxSize: args.maxImgSize,
            minWidth: w,
            minHeight: h,

            button: {
                select: {
                    x: 0,
                    y: 0,
                    width: 70,
                    height: 25,
                    text: '选择图片'
                },
                upload: {
                    x: 80,
                    y: 0,
                    width: 70,
                    height: 25,
                    text: '保存'
                },
                download: {
                    x: 160,
                    y: 0,
                    width: 70,
                    height: 25,
                    text: '另存为'
                },
                leftRotate: {
                    x: 240,
                    y: 0,
                    width: 80,
                    height: 25,
                    text: '逆时针旋转'
                },
                rightRotate: {
                    x: 330,
                    y: 0,
                    width: 80,
                    height: 25,
                    text: '顺时针旋转'
                }
            },

            src: {
                x: 0,
                y: 40,
                width: args.editAreaWidth,
                height: args.editAreaHeight
            },

            dest: [
                {
                    x: args.editAreaWidth + 20,
                    y: 40,
                    width: w,
                    height: h,
                    text: sizeText
                }
            ],

            // 图片验证失败触发
            onValidateError: function (e) {
                if (e.type === 'dimension') {
                    Dialog.alert({
                        content: '图片尺寸不能小于 ' + sizeText + '，请重新选择'
                    });
                }
            },

            onUploadStart: function (e) {
                loading.show('保存图片中...');
            },

            onUploadProgress: function (e) {
            },

            onUploadError: function (e) {
                loading.hide();
                Dialog.alert({
                    content: '保存失败，请重新操作'
                });
                args.uploadFail.call(null, e);
            },
            onUploadComplete: function (e) {
                loading.hide();

                var data = uniUtil.parseJson(e.data);
                if (data.status) {
                    Dialog.alert({
                        content: data.statusInfo || '发生错误，请重新上传'
                    });
                    return;
                }

                Dialog.alert({
                    type: 'success',
                    content: '保存成功'
                }).on(
                    'ok',
                    function () {
                        setTimeout(function () {
                            args.uploadSuccess.call(null, data.data);
                            exports.hide();
                        }, 0);
                    }
                );
            }
        });

        return dialog;
    };

    /**
     * 销毁控件
     */
    exports.hide = function () {
        if (dialog) {
            imageCrop && imageCrop.dispose();
            dialog.un('hide', exports.hide);
            dialog.dispose();
            dialog = null;
            imageCrop = null;
        }
    };

    return exports;
});
