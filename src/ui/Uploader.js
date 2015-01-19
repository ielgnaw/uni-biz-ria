/**
 * @file 图片上传组件
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {
    var lib = require('esui/lib');
    var helper = require('esui/controlHelper');
    var Validity = require('esui/validator/Validity');
    var ValidityState = require('esui/validator/ValidityState');
    var InputControl = require('esui/InputControl');
    var u = require('underscore');

    var LANG_PKG = require('../lang').getLangPkg();

    require('./Image');

    var FILE_TYPES = ['auto', 'image', 'flash'];

    /**
     * Uploader控件
     *
     * @param {Object=} options 初始化参数
     * @extends InputControl
     * @constructor
     * @public
     */
    function Uploader(options) {
        InputControl.apply(this, arguments);
    }

    Uploader.prototype.type = 'Uploader';

    /**
     * 默认属性
     *
     * @type {Object}
     * @public
     */
    Uploader.defaultProperties = {
        width: 80,
        height: 25,
        fileType: 'image',
        method: 'POST',
        text: LANG_PKG.DJSC,
        overrideText: LANG_PKG.CXSC,
        busyText: LANG_PKG.ZZSC,
        completeText: LANG_PKG.SCWC,
        unloadText: LANG_PKG.WXZWJ,
        preview: true,
        autoUpload: true
    };

    /**
     * 创建主元素
     *
     * @return {HTMLElement}
     * @override
     * @protected
     */
    Uploader.prototype.createMain = function () {
        return document.createElement('div');
    };

    /**
     * 初始化参数
     *
     * @param {Object=} options 构造函数传入的参数
     * @override
     * @protected
     */
    Uploader.prototype.initOptions = function (options) {
        var properties = {
            action: ''
        };
        lib.extend(properties, Uploader.defaultProperties, options);

        if (lib.isInput(this.main)) {
            if (!options.accept) {
                properties.accept = lib.getAttribute(this.main, 'accept');
            }
            if (!options.name) {
                properties.name = this.main.name;
            }
        }
        else if (this.main.nodeName.toLowerCase() === 'form') {
            if (!options.action) {
                properties.action = this.main.action;
            }
            if (!options.method && lib.hasAttribute(this.main, 'method')) {
                properties.method = this.main.method;
            }
        }

        if (typeof properties.accept === 'string') {
            properties.accept = properties.accept.split(',');
        }

        if (properties.autoUpload === 'false') {
            properties.autoUpload = false;
        }

        // 会存在一些额外的参数配置
        properties.extraArgs = [];
        function buildExtraArgs(key, value) {
            // 如果有也是直接覆盖，args的优先级最高
            properties[key] = value;
            properties.extraArgs.push({
                name: key,
                value: value
            });
        }
        // 现在开始解析args
        var keyAndValues = [];
        if (properties.args) {
            if (typeof properties.args == 'string') {
                keyAndValues = properties.args.split('&');
                u.each(keyAndValues, function (keyAndValue) {
                    keyAndValue = keyAndValue.split('=');
                    if (keyAndValue.length === 2) {
                        buildExtraArgs(keyAndValue[0], keyAndValue[1]);
                    }
                });
            }
            else if (typeof properties.args == 'object') {
                for (var key in properties.args) {
                    buildExtraArgs(key, properties.args[key]);
                }
            }
        }

        if (!properties.hasOwnProperty('title') && this.main.title) {
            properties.title = this.main.title;
        }

        this.setProperties(properties);
    };

    /**
     * 初始化DOM结构
     *
     * @override
     * @protected
     */
    Uploader.prototype.initStructure = function () {
        if (this.main.nodeName.toLowerCase() !== 'form') {
            helper.replaceMain(this);
        }

        this.callbackName = helper.getGUID('');

        // 往全局下加个函数，用于上传成功后回调
        // if (window.esuiShowUploadResult) {
        //     delete window.esuiShowUploadResult;
        // }

        // window.esuiShowUploadResult = lib.bind(this.showUploadResult, this);

        if (!window.esuiShowUploadResult) {
            window.esuiShowUploadResult = {};
        }
        window.esuiShowUploadResult[this.callbackName] = lib.bind(this.showUploadResult, this);

        var inputContainerClasses =
            helper.getStateClasses(this, 'input-container').join(' ');
        var indicatorClasses =
            helper.getStateClasses(this, 'indicator').join(' ');
        var buttonClasses =
            helper.getStateClasses(this, 'button').join(' ');
        var labelClasses =
            helper.getStateClasses(this, 'label').join(' ');
        var iframeId = helper.getId(this, 'iframe');

        var html = [
            '<div id="' + helper.getId(this, 'input-container') + '" ',
                    'class="' + inputContainerClasses + '">',
                // 按钮
                '<span id="' + helper.getId(this, 'button') + '" ',
                    'class="' + buttonClasses + '">',
                '</span>',
                // 回调函数名
                '<input type="hidden" name="callback" ',
                    // 'value="' + 'esuiShowUploadResult" ',
                    'value="' + 'esuiShowUploadResult[\'' + this.callbackName + '\']" ',
                '/>',
                // sessionToken
                '<input type="hidden" name="sessionToken" ',
                    'value="' + this.getSessionToken() + '" ',
                '/>',
                // 文件上传框
                '<input type="file" ',
                    'id="' + helper.getId(this, 'input') + '" ',
                    'size="1" ',
                    (this.name ? 'name="' + this.name + '" ' : ' '),
                '/>',
                // 类型字段
                '<input type="hidden" name="type" ',
                    'value="' + this.typeIndex + '"',
                '/>'
        ];
        //从附加参数里构造
        if (this.extraArgs) {
            u.each(this.extraArgs, function (arg) {
                html.push(
                    '<input type="hidden" name="' + arg.name + '" ',
                        'value="' + arg.value + '"',
                    '/>'
                );
            });
        }
        html.push(
            '</div>',
            // 指示器
            // 虽然`<progress>`更合适，但基本无法写样式，所以改用`<span>`
            '<div id="' + helper.getId(this, 'indicator-wrapper') + '"',
                'class="' + indicatorClasses + '">',
                '<span id="' + helper.getId(this, 'indicator') + '">',
                '</span>',
            '</div>',
            '<div id="' + helper.getId(this, 'label') +
                '"',
                'class="' + labelClasses + '">' + this.unloadText +
            '</div>',
            // 用来偷偷上传的`<iframe>`元素
            '<iframe id="' + iframeId + '" name="' + iframeId + '"',
            ' src="about:blank"></iframe>'
        );


        // IE是不允许在一个`<form>`里有另一个`<form>`，
        // 并且设置内层`<form>`的`innerHTML`的，因此先移出去，设完了再回来
        // var nextSibling = this.main.nextSibling;
        // var parent = this.main.parentNode;
        // parent.removeChild(this.main);
        this.main.innerHTML = html.join('');
        // parent.insertBefore(this.main, nextSibling);

        // 放个表单在远放，有用
        var form = document.createElement('form');
        form.className = this.helper.getPartClassName('form');
        form.id = helper.getId(this, 'form');
        form.setAttribute('enctype', 'multipart/form-data');
        form.target = iframeId;
        document.body.appendChild(form);

        var input = lib.g(helper.getId(this, 'input'));
        helper.addDOMEvent(
            this,
            input,
            'change',
            function () {
                if (input.value !== '') {
                    this.receiveFile();
                }
            }
        );
    };

    /**
     * 转换为上传完成状态
     *
     * @param {Object} info 成功结果
     */
    function setStateToComplete(info) {
        this.removeState('busy');
        this.fire('complete');
        this.addState('complete');

        // 下次再上传的提示文字要变掉
        this.addState('uploaded');
        var button = lib.g(helper.getId(this, 'button'));
        button.innerHTML = lib.encodeHTML(this.overrideText);
        this.setFile(
            this.getFileName(info.previewUrl || info.url)
        );

        // 清掉可能存在的错误信息
        var validity = new Validity();
        this.showValidity(validity);

        this.fire('change');
        if (this.preview) {
            this.showPreview(info);
        }
    }

    /**
     * 渲染自身
     *
     * @override
     * @protected
     */
    Uploader.prototype.repaint = helper.createRepaint(
        InputControl.prototype.repaint,
        {
            name: ['method', 'action'],
            paint: function (uploader, method, action) {
                var form = uploader.helper.getPart('form');
                form.method = method;
                form.action = action;
            }
        },
        {
            name: ['text', 'overrideText'],
            paint: function (uploader, text, overrideText) {
                var button = lib.g(helper.getId(uploader, 'button'));
                var html = uploader.hasState('uploaded')
                    ? lib.encodeHTML(overrideText)
                    : lib.encodeHTML(text);
                button.innerHTML = html;
            }
        },
        {
            name: ['busyText', 'completeText'],
            paint: function (uploader, busyText, completeText) {
                var indicator = lib.g(helper.getId(uploader, 'indicator'));
                var html = uploader.hasState('busy')
                    ? lib.encodeHTML(busyText)
                    : lib.encodeHTML(completeText);
                indicator.innerHTML = html;
            }
        },
        {
            name: 'accept',
            paint: function (uploader, accept) {
                var input = lib.g(helper.getId(uploader, 'input'));
                if (accept) {
                    lib.setAttribute(input, 'accept', accept.join(','));
                }
                else {
                    lib.removeAttribute(input, 'accept');
                }
            }
        },
        {
            name: ['disabled', 'readOnly'],
            paint: function (uploader, disabled, readOnly) {
                var input = lib.g(helper.getId(uploader, 'input'));
                input.disabled = disabled;
                input.readOnly = readOnly;
            }
        },
        {
            name: ['width', 'height'],
            paint: function (uploader, width, height) {
                var widthWithUnit = width + 'px';
                var heightWithUnit = height + 'px';

                uploader.main.style.height = heightWithUnit;

                var container = lib.g(helper.getId(uploader, 'input-container'));
                container.style.width = widthWithUnit;
                container.style.height = heightWithUnit;

                var button = lib.g(helper.getId(uploader, 'button'));
                button.style.lineHeight = heightWithUnit;

                var indicatorWrapper = lib.g(helper.getId(uploader, 'indicator-wrapper'));
                indicatorWrapper.style.width = widthWithUnit;

                var indicator = lib.g(helper.getId(uploader, 'indicator'));
                indicator.style.lineHeight = heightWithUnit;

                var label = lib.g(helper.getId(uploader, 'label'));
                label.style.lineHeight = heightWithUnit;

                var fileInput = lib.g(helper.getId(uploader, 'input'));
                fileInput.style.width = widthWithUnit;
            }
        },
        {
            name: 'rawValue',
            paint: function (uploader, rawValue) {
                if (!rawValue) {
                    return;
                }

                if (!rawValue.hasOwnProperty('type')) {
                    rawValue.type = uploader.fileType;
                }
                else if (typeof rawValue.type === 'number') {
                    rawValue.type = FILE_TYPES[rawValue.type];
                }

                uploader.fileInfo = rawValue;

                setStateToComplete.call(uploader, rawValue);
                // 不需要停留在完成提示
                uploader.removeState('complete');
            }
        }
    );

    var mimeTypes = {
        image: {
            '.jpg': true, '.jpeg': true, '.gif': true,
            '.bmp': true, '.tif': true, '.tiff': true, '.png': true
        },

        flash: {
            '.flv': true, '.swf': true
        }
    };

    /**
     * 检查文件格式是否正确，不正确时直接提示
     *
     * @param {string} filename 上传的文件的文件名
     * @return {boolean}
     * @protected
     */
    Uploader.prototype.checkFileFormat = function (filename) {
        if (this.accept) {
            // 这里就是个内置的`Rule`，走的完全是标准的验证流程，
            // 主要问题是上传控件不能通过`getValue()`获得验证用的内容，
            // 因此把逻辑写在控件内部了
            var extension = filename.split('.');
            extension = '.' + extension[extension.length - 1].toLowerCase();

            var isValid = false;
            for (var i = 0; i < this.accept.length; i++) {
                var acceptPattern = this.accept[i].toLowerCase();
                if (acceptPattern === extension) {
                    isValid = true;
                    break;
                }

                var matchStr = acceptPattern.slice(-1)[0];
                if (!matchStr) {
                    matchStr = acceptPattern.slice(-1);
                }

                // image/*之类的，表示一个大类
                if (matchStr === '*') {
                    var mimeType = acceptPattern.split('/')[0];
                    var targetExtensions = mimeTypes[mimeType];
                    if (targetExtensions
                        && targetExtensions.hasOwnProperty(extension)
                    ) {
                        isValid = true;
                        break;
                    }
                }
            }

            if (!isValid) {
                var message = this.acceptErrorMessage
                    || LANG_PKG.JJSYXWJGS1 + this.accept.join(',');
                this.notifyFail(message);
            }

            return isValid;
        }
        else {
            return true;
        }
    };

    /**
     * 提交文件上传
     */
    Uploader.prototype.submit = function () {
        // IE有个BUG，如果在一个`<form>`中有另一个`<form>`，
        // 那么就不能修改内层`<form>`的`innerHTML`值，
        // 因此我们把内层`<form>`单独写在某个地方，
        // 当需要提交时，把所有的`<input>`丢到这个`<form>`下，
        // 提交完毕后再拿回来
        this.showUploading();
        var inputs = this.helper.getPart('input-container');
        var form = this.helper.getPart('form');
        form.appendChild(inputs);
        form.submit();
        this.main.insertBefore(inputs, this.main.firstChild);
    };

    /**
     * 上传文件
     *
     * @protected
     */
    Uploader.prototype.receiveFile = function () {
        var input = lib.g(helper.getId(this, 'input'));
        var filename = input.value;
        if (this.checkFileFormat(filename)) {
            this.fire('receive');
            if (this.autoUpload) {
                this.submit();
            }
        }
    };

    /**
     * 提示用户正在上传
     *
     * @protected
     */
    Uploader.prototype.showUploading = function () {
        this.removeState('complete');
        this.addState('busy');

        var indicator = lib.g(helper.getId(this, 'indicator'));
        indicator.innerHTML = lib.encodeHTML(this.busyText);
    };

    /**
     * 显示上传结果
     *
     * @param {Object} options 上传结果
     * @protected
     */
    Uploader.prototype.showUploadResult = function (options) {
        if (+options.status !== 0) {
            this.notifyFail(options.statusInfo || LANG_PKG.SCSB);
        }
        else if (options){
            if (!options.hasOwnProperty('type')) {
                options.type = this.fileType;
            }
            else if (typeof options.type === 'number') {
                options.type = FILE_TYPES[options.type];
            }

            // this.fileInfo = options;

            // wuzhiquan 接口处 这块仅需要url，
            // 前面调用处由于是动态的，所以在这里改动
            this.fileInfo = decodeURIComponent(options.url);
            var urlSmall = decodeURIComponent(options.urlSmall);
            if (urlSmall) {
                var cascadeNode = this.viewContext.get(this.cascadeId);
                if (cascadeNode) {
                    cascadeNode.setValue(urlSmall);
                }
            }

            this.notifyComplete(options);
        }
    };

    /**
     * 通知上传失败
     *
     * @param {string} message 失败消息
     * @protected
     */
    Uploader.prototype.notifyFail = function (message) {
        this.fire('fail', message);
        message = decodeURI(message) || LANG_PKG.SCSB;
        var validity = new Validity();
        var state = new ValidityState(false, message);
        validity.addState('upload', state);
        this.showValidity(validity);
        this.removeState('busy');
        this.reset();
    };

    /**
     * 通知上传完成
     *
     * @param {Object} info 成功结果
     * @protected
     */
    // TODO: fileInfo 需要整理，如果后端只需要 url ，那么这里的 fileInfo 就不需要设置对象了
    Uploader.prototype.notifyComplete = function (info) {
        setStateToComplete.call(this, info);

        // 提示已经完成
        var indicator = lib.g(helper.getId(this, 'indicator'));
        indicator.innerHTML = lib.encodeHTML(this.completeText);
        // 一定时间后回到可上传状态
        this.timer = setTimeout(
            lib.bind(this.removeState, this, 'complete'),
            1000
        );
    };

    /**
     * 显示预览
     *
     * @param {Object} info 预览信息
     * @protected
     */
    Uploader.prototype.showPreview = function (info) {
        var me = this;
        if (!info) {
            info = me.fileInfo;
        }

        if (me.previewContainer) {
            var container = me.viewContext.get(me.previewContainer);
            if (!container) {
                return;
            }
            var properties = {
                imageType: info ? info.type : (me.fileType || 'auto'),
                // url: me.getPreviewUrl(),
                url: info.url
                        ? decodeURIComponent(info.url)
                        : decodeURIComponent(info.previewUrl),
                width: info.width ? info.width : 50,
                height: info.height ? info.height : 50,
                delCallback: function () {
                    me.reset();
                    me.fileInfo = null;
                    lib.g(helper.getId(me, 'button')).innerHTML = lib.encodeHTML(me.text);
                    lib.g(helper.getId(me, 'label')).innerHTML = lib.encodeHTML(me.unloadText);
                }
            };
            container.setProperties(properties);
        }
    };

    Uploader.prototype.setRawValue = function (rawValue) {
        if (!rawValue) {
            return;
        }

        if (!rawValue.hasOwnProperty('type')) {
            rawValue.type = this.fileType;
        }
        else if (typeof rawValue.type === 'number') {
            rawValue.type = FILE_TYPES[rawValue.type];
        }

        this.fileInfo = rawValue.previewUrl || rawValue.url;

        setStateToComplete.call(this, rawValue);
        // 不需要停留在完成提示
        this.removeState('complete');
    };

    Uploader.prototype.getRawValue = function () {
        return this.fileInfo || null;
    };

    Uploader.prototype.getRawValueProperty = Uploader.prototype.getRawValue;

    /**
     * 获取用户选择的文件名
     *
     * @return {string}
     */
    Uploader.prototype.getFileName = function (url) {
        var input = lib.g(helper.getId(this, 'input'));
        var value;
        if (url) {
            value = url;
        }
        else {
            value = input.value;
        }
        return value.split('\\').pop() || '';
    };

    /**
     * 获取上传的文件的宽度，只有成功上传后才能获取
     *
     * @return {number}
     * @protected
     */
    Uploader.prototype.getFileWidth = function () {
        return this.fileInfo ? this.fileInfo.width : -1;
    };

    /**
     * 获取上传的文件的高度，只有成功上传后才能获取
     *
     * @return {number}
     * @protected
     */
    Uploader.prototype.getFileHeight = function () {
        return this.fileInfo ? this.fileInfo.height : -1;
    };

    /**
     * 获取上传的文件的预览URL，只有成功上传后才能获取
     *
     * @return {string}
     * @protected
     */
    Uploader.prototype.getPreviewUrl = function () {
        return this.fileInfo ? (this.fileInfo.url || this.fileInfo.previewUrl) : '';
    };

    /**
     * 获取反CSRF的Token
     *
     * @return {string}
     * @protected
     */
    Uploader.prototype.getSessionToken = function () {
        return '';
    };

    /**
     * 上传成功时
     *      展示已上传文件名
     * 初始化时
     *      设置默认文件名，其实input里边没有文件（囧）
     *      需要配置rawValue.name
     */
    Uploader.prototype.setFile = function (fileName) {
        var label = lib.g(helper.getId(this, 'label'));
        if (fileName) {
            label.innerHTML = lib.encodeHTML(fileName);
        }
    };

    /**
     * 清空input文件内容
     */
    Uploader.prototype.reset = function () {
        var input = lib.g(helper.getId(this, 'input'));
        input.value = '';

        var label = lib.g(helper.getId(this, 'label'));
        this.removeState('uploaded');
        label.innerHTML = '';

        return;
    };

    /**
     * 销毁控件
     *
     * @override
     */
    Uploader.prototype.dispose = function () {
        var form = this.helper.getPart('form');
        lib.removeNode(form);
        // delete window.esuiShowUploadResult;
        delete window.esuiShowUploadResult[this.callbackName];

        InputControl.prototype.dispose.apply(this, arguments);
    };

    lib.inherits(Uploader, InputControl);
    require('esui').register(Uploader);
    return Uploader;
});
