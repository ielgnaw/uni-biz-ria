/**
 * @file 省份数据
 *       http://wiki.baidu.com/download/attachments/36869999/ip_mapprov.utf8.txt?version=1&modificationDate=1408612861826&api=v2
 *       http://wiki.baidu.com/pages/viewpage.action?pageId=36869999
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var data = [
        {
            value: '请选择省份',
            text: '请选择省份'
        },
        {
            value: '1',
            text: '北京'
        },
        {
            value: '2',
            text: '上海'
        },
        {
            value: '3',
            text: '天津'
        },
        {
            value: '4',
            text: '广东'
        },
        {
            value: '5',
            text: '福建'
        },
        {
            value: '8',
            text: '海南'
        },
        {
            value: '9',
            text: '安徽'
        },
        {
            value: '10',
            text: '贵州'
        },
        {
            value: '11',
            text: '甘肃'
        },
        {
            value: '12',
            text: '广西'
        },
        {
            value: '13',
            text: '河北'
        },
        {
            value: '14',
            text: '河南'
        },
        {
            value: '15',
            text: '黑龙江'
        },
        {
            value: '16',
            text: '湖北'
        },
        {
            value: '17',
            text: '湖南'
        },
        {
            value: '18',
            text: '吉林'
        },
        {
            value: '19',
            text: '江苏'
        },
        {
            value: '20',
            text: '江西'
        },
        {
            value: '21',
            text: '辽宁'
        },
        {
            value: '22',
            text: '内蒙古'
        },
        {
            value: '23',
            text: '宁夏'
        },
        {
            value: '24',
            text: '青海'
        },
        {
            value: '25',
            text: '山东'
        },
        {
            value: '26',
            text: '山西'
        },
        {
            value: '27',
            text: '陕西'
        },
        {
            value: '28',
            text: '四川'
        },
        {
            value: '29',
            text: '西藏'
        },
        {
            value: '30',
            text: '新疆'
        },
        {
            value: '31',
            text: '云南'
        },
        {
            value: '32',
            text: '浙江'
        },
        {
            value: '33',
            text: '重庆'
        }
    ];

    return {
        /**
         * 获取所有省份数据
         */
        getAll: function () {
            return data;
        }
    };

});
