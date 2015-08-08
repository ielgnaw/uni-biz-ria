/**
 * @file uni-biz-ria 里面出现的字面的语言包
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var langInfo = {
        'zh_CN': require('./zh_CN'),
        'en_US': require('./en_US'),
        'pt_BR': require('./pt_BR'),
        'th_TH': require('./th_TH')
    };

    return langInfo;

});
