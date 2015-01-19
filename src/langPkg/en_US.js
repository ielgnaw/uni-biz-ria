/**
 * @file uni-biz-ria 里的英文语言包
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var enUS = {
        // 操作失败
        'CZSB': 'Operation failed',
        // 尚未登录，请登录
        'SWDL': 'You are not logged in. Please log in',
        // 正在读取数据，请稍候
        'ZZDQ': 'Loading, Please wait',
        // 管理标识
        'GLBS': 'Admin ID',
        // 管理标识：
        'GLBS1': 'Admin ID: ',
        // 最多30个字符
        'ZD30GZF': '30 characters at most',
        // 必填
        'BT': 'Required',
        // 保存
        'BC': 'Save',
        // 取消
        'QX': 'Cancel',
        // 点击上传
        'DJSC': 'Click to upload',
        // 重新上传
        'CXSC': 'Re-upload',
        // 正在上传
        'ZZSC': 'Uploading',
        // 上传完成
        'SCWC': 'Upload complete',
        // 未选择文件
        'WXZWJ': 'No file selected',
        // 仅接受以下文件格式：
        'JJSYXWJGS1': 'Only the following file formats are supported: ',
        // 上传失败
        'SCSB': 'Failed to upload',
        // 该标识只做系统管理使用，与展现无关
        'YZXWG': 'This ID is only used for system management. It will not be displayed in the ad.',
        // 确认添加创意？
        'QRTJCY': 'Confirm creative addition?',
        // 确认修改创意？
        'RQXGCY': 'Confirm creative modification?',
        // 确认
        'QR': 'OK',
        // 返回
        'FH': 'Back',
        // 已经审核通过的创意不能修改
        'YJSHBNXG': 'You cannot modify a creative that has passed review',
        // ${title}不能超过${exMaxLength}个字符，每个中文及中文符号计为两个字符
        'BNCGGZF': '${title}can not exceed ${exMaxLength} characters.',
        // ${title}不能为空
        'BTBNWK': '${title} cannot be blank',
        // 请选择多选框
        'QXZDXK': 'Please select checkboxes',
        // 选择的个数超过最大个数
        'GSCG': 'The number of selections exceeds the maximum',
        // 请选择
        'QXZ': 'Please select ',
        // 请填写
        'QTX': 'Please enter ',
        // 机构地址
        'JGDZ': 'Institution Address',
        // 最多选择
        'ZDXZ': ' select up to ',
        // 个
        'Ge': ' ',
        // 机构简称与机构URL将使用您在“婚纱摄影机构信息”中填写的信息
        'JGJCXX': ''
            + 'As to the acronym and url of agency, '
            + 'we will use what you have entered in the "information of wedding photography agency"',




        // form 动态配置中的语言包，这里使用中文为 key
        // 是因为这样可以在拿到 form 配置时最快速的替换对应的语言
        // 中文可以不用配置，默认是中文
        /**
         * 5201
         */
        '图片链接URL': 'Image link URL',
        '请填写图片链接URL': 'Please fill out the image link URL',
        '这是个tip': 'This is a tip',
        '网址格式错误': 'URL format error',
        '创意图片': 'Creative image',
        '选择创意图片': 'Select the creative picture',
        '图片上传也能出 tip': 'Upload pictures will be able to produce tip',
        '请选择创意图片': 'Please choose a creative picture',
        '图册风格': 'Atlas style',

        /**
         * 1101
         */
        '哈哈': 'HaHa',
        '选择yato': 'Select yato',
        'yato 的 tip': 'yato\'s tip',
        '请选择yato': 'Please select yato',
        // 5201 中已经写过，这里标识下
        // '创意图片': 'Creative image',
        // '选择创意图片': 'Select the creative picture',
        // '图片上传也能出 tip': 'Upload pictures will be able to produce tip',
        // '请选择创意图片': 'Please choose a creative picture',
        '平台': 'Platform',
        '图册1风格': 'Atlas1 style',
        '浪漫': 'Romantic',
        '大气': 'Smart',
        '其他': 'Others',

        /**
         * 5102
         */
        '描述': 'description',
        '最少32个字符，最多160个字符': 'minimum 32 characters, a maximum of 160 characters',
        '创意url': 'Creative URL',
        // 5201 中已经写过，这里标识下
        // '网址格式错误': 'URL format error'

        /**
         * 5103
         */
        '图册主题': 'Atlas theme',
        '最多12个字符': 'A maximum of 12 characters',
        '图册封面图片': 'Album cover images',
        '图片尺寸320*240': 'Image size 320*240',
        '请选择图册封面图片': 'Please select the album cover images',
        '图册url': 'Atlas URL',
        '请填写图册url': 'Please fill in the atlas URL',
        // 5201 中写过
        // '网址格式错误': '',
        '图册图片数量': 'Atlas of the number of images',
        '请填写正整数': 'Please fill in the positive integer',
        '数字最大为20': 'Figure 20 maximum',
        '张': 's',
        '图册数量不能超过20张': 'Atlas of the number of not more than 20',
        '最多选三个风格': 'Select up to three style',
        // 5201 中写过
        // '图册风格': '',
        // 1101 中写过
        // '浪漫': '',
        '韩式': 'Korean',
        '小清新': 'Small fresh',
        '复古': 'Retro',
        '欧洲': 'Europe',
        '中式': 'Chinese style',
        '海景': 'Seascape',
        '水下': 'Under water',
        '花海': 'Flower Sea',
        '时尚': 'Fashion',
        '图册场景': 'Atlas of the scene',
        '内景': 'Interior',
        '独家基地': 'Exclusive base',
        '本地': 'Local',
        '外省': 'Other provinces',
        '境外': 'Abroad',
        '图册类型': 'Atlas type',
        '客片': 'Guest piece',
        '样片': 'Sample',
        '图片Url': 'Picture Url',

        /**
         * 5104
         */
        '套系1图片(封面)': 'Series 1 pictures (cover)',
        '图片尺寸420*315': 'Image size 420*315',
        '请选择套系1图片': 'Please select series 1 pictures',
        '套系2图片': 'Series 2 pictures',
        '请选择套系2图片': 'Please select series 2 pictures',
        '套系3图片': 'Series 3 pictures',
        '请选择套系3图片': 'Please select series 3 pictures',
        '套系url': 'Series URL',
        '套系特色': 'Series characteristic',
        '最多32个字符': 'A maximum of 32 characters',
        '服装套数': 'Clothing sets',
        '请选择服装套数': 'Please select clothing sets',
        '不限': 'Unlimited',
        '咨询客服': 'The Advisory Service',
        '造型套数': 'Modeling of ploidy',
        '请选择造型套数': 'Please select modeling of ploidy',
        '拍摄张数': 'The number of shots',
        '数字最大为1000': 'Figure 1000 maximum',
        '拍摄张数不能超过1000张': 'The number of shots can not be more than 1000',
        '精修张数': 'Finishing a number',
        '精修张数不能超过1000张': 'Finishing the number of sheets can not be more than 1000',
        '底片全部赠送': 'The film all gifts',
        '底片是否赠送': 'The film whether giving',
        '是': 'Yes',
        '拍摄场景1': 'Scene 1',
        '最多24个字符': 'A maximum of 24 characters',
        '拍摄场景2': 'Scene 2',
        '拍摄场景3': 'Scene 3',
        '到店即赠1赠品': 'To the shop that give 1 gifts',
        '赠品1价格': '1 the price of gifts',
        '数字最大为9999': 'Figure 9999 maximum',
        '请填写数字': 'Please fill in the numbers',
        '赠品价格最高9999元': 'Gifts of the highest price 9999 reais',
        '到店即赠2赠品': 'To the shop that give 2 gifts',
        '赠品2价格': '2 the price of gifts',
        '原价': 'The original price',
        '元': 'reais',
        '现价': 'Present price',

        /**
         * 6101
         */
        '产品名称': 'Product name',
        '开发商名称': 'Company name',
        '请填写开发商名称': 'Please fill in the company name',
        '产品简介': 'Product Brief',
        '请填写产品简介': 'Please fill in the product introduction',
        '下载链接': 'Download link',
        '请填写下载链接': 'Please fill in the download link',
        '详情链接': 'Details link',
        '请填写详情链接': 'Please fill in the details',
        '安卓必填': 'Android is required',
        '应用版本信息': 'Application version information',
        '请填写应用版本信息': 'Please fill out the application version information',
        '应用大小（MB）': 'Application of size (MB)',
        '请填写应用大小': 'Please fill out the application size',
        '产品LOGO': 'Product LOGO',
        '图片尺寸75*75': 'Image size 75*75',
        '请选择产品LOGO': 'Please select a product LOGO',

        /**
         * 6102
         */
        '图片大小640*240': 'Image size 640*240',

        /**
         * 550001
         */
        '标题': 'title',
        '显示url': 'Display url',
        '跳转url': 'Destination url',
        '摘要': 'Description'
    };

    return enUS;
});
