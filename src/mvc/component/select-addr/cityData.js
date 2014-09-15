/**
 * @file 城市数据
 *       http://wiki.baidu.com/download/attachments/36869999/ip_mapcity.utf8.txt?version=1&modificationDate=1408612852469&api=v2
 *       http://wiki.baidu.com/pages/viewpage.action?pageId=36869999
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var data = [
        {
            value: '请选择城市',
            provinceVal: '请选择省份',
            text: '请选择城市'
        },
        {
            value: '38',
            provinceVal: '18',
            text: '吉林'
        },
        {
            value: '39',
            provinceVal: '18',
            text: '白城'
        },
        {
            value: '40',
            provinceVal: '18',
            text: '长春'
        },
        {
            value: '41',
            provinceVal: '18',
            text: '辽源'
        },
        {
            value: '42',
            provinceVal: '18',
            text: '白山'
        },
        {
            value: '43',
            provinceVal: '18',
            text: '四平'
        },
        {
            value: '44',
            provinceVal: '18',
            text: '松原'
        },
        {
            value: '45',
            provinceVal: '18',
            text: '通化'
        },
        {
            value: '46',
            provinceVal: '18',
            text: '延吉'
        },
        {
            value: '47',
            provinceVal: '18',
            text: '延边'
        },
        {
            value: '48',
            provinceVal: '5',
            text: '莆田'
        },
        {
            value: '49',
            provinceVal: '5',
            text: '南平'
        },
        {
            value: '50',
            provinceVal: '5',
            text: '龙岩'
        },
        {
            value: '51',
            provinceVal: '5',
            text: '宁德'
        },
        {
            value: '52',
            provinceVal: '5',
            text: '泉州'
        },
        {
            value: '53',
            provinceVal: '19',
            text: '淮安'
        },
        {
            value: '54',
            provinceVal: '19',
            text: '常州'
        },
        {
            value: '55',
            provinceVal: '19',
            text: '南京'
        },
        {
            value: '56',
            provinceVal: '19',
            text: '南通'
        },
        {
            value: '57',
            provinceVal: '19',
            text: '连云港'
        },
        {
            value: '58',
            provinceVal: '19',
            text: '徐州'
        },
        {
            value: '59',
            provinceVal: '19',
            text: '苏州'
        },
        {
            value: '60',
            provinceVal: '19',
            text: '宿迁'
        },
        {
            value: '61',
            provinceVal: '19',
            text: '泰州'
        },
        {
            value: '62',
            provinceVal: '19',
            text: '无锡'
        },
        {
            value: '63',
            provinceVal: '19',
            text: '盐城'
        },
        {
            value: '64',
            provinceVal: '19',
            text: '扬州'
        },
        {
            value: '65',
            provinceVal: '19',
            text: '镇江'
        },
        {
            value: '66',
            provinceVal: '5',
            text: '三明'
        },
        {
            value: '67',
            provinceVal: '20',
            text: '九江'
        },
        {
            value: '68',
            provinceVal: '20',
            text: '吉安'
        },
        {
            value: '69',
            provinceVal: '20',
            text: '景德镇'
        },
        {
            value: '70',
            provinceVal: '5',
            text: '厦门'
        },
        {
            value: '71',
            provinceVal: '20',
            text: '萍乡'
        },
        {
            value: '72',
            provinceVal: '20',
            text: '南昌'
        },
        {
            value: '73',
            provinceVal: '20',
            text: '新余'
        },
        {
            value: '74',
            provinceVal: '20',
            text: '上饶'
        },
        {
            value: '75',
            provinceVal: '20',
            text: '宜春'
        },
        {
            value: '76',
            provinceVal: '20',
            text: '鹰潭'
        },
        {
            value: '77',
            provinceVal: '20',
            text: '赣州'
        },
        {
            value: '78',
            provinceVal: '20',
            text: '抚州'
        },
        {
            value: '80',
            provinceVal: '5',
            text: '漳州'
        },
        {
            value: '81',
            provinceVal: '5',
            text: '福州'
        },
        {
            value: '82',
            provinceVal: '4',
            text: '江门'
        },
        {
            value: '83',
            provinceVal: '4',
            text: '揭阳'
        },
        {
            value: '84',
            provinceVal: '4',
            text: '广州'
        },
        {
            value: '85',
            provinceVal: '4',
            text: '潮州'
        },
        {
            value: '86',
            provinceVal: '4',
            text: '茂名'
        },
        {
            value: '88',
            provinceVal: '4',
            text: '梅州'
        },
        {
            value: '89',
            provinceVal: '4',
            text: '清远'
        },
        {
            value: '90',
            provinceVal: '4',
            text: '佛山'
        },
        {
            value: '91',
            provinceVal: '4',
            text: '汕头'
        },
        {
            value: '92',
            provinceVal: '4',
            text: '汕尾'
        },
        {
            value: '93',
            provinceVal: '4',
            text: '深圳'
        },
        {
            value: '94',
            provinceVal: '4',
            text: '韶关'
        },
        {
            value: '95',
            provinceVal: '12',
            text: '桂林'
        },
        {
            value: '96',
            provinceVal: '12',
            text: '贵港'
        },
        {
            value: '98',
            provinceVal: '12',
            text: '防城港'
        },
        {
            value: '99',
            provinceVal: '12',
            text: '南宁'
        },
        {
            value: '100',
            provinceVal: '12',
            text: '来宾'
        },
        {
            value: '101',
            provinceVal: '12',
            text: '柳州'
        },
        {
            value: '102',
            provinceVal: '12',
            text: '钦州'
        },
        {
            value: '103',
            provinceVal: '12',
            text: '梧州'
        },
        {
            value: '104',
            provinceVal: '12',
            text: '北海'
        },
        {
            value: '105',
            provinceVal: '12',
            text: '玉林'
        },
        {
            value: '106',
            provinceVal: '12',
            text: '河池'
        },
        {
            value: '107',
            provinceVal: '12',
            text: '贺州'
        },
        {
            value: '108',
            provinceVal: '12',
            text: '百色'
        },
        {
            value: '109',
            provinceVal: '4',
            text: '阳江'
        },
        {
            value: '110',
            provinceVal: '4',
            text: '湛江'
        },
        {
            value: '111',
            provinceVal: '4',
            text: '云浮'
        },
        {
            value: '112',
            provinceVal: '4',
            text: '中山'
        },
        {
            value: '113',
            provinceVal: '4',
            text: '珠海'
        },
        {
            value: '114',
            provinceVal: '4',
            text: '肇庆'
        },
        {
            value: '115',
            provinceVal: '4',
            text: '河源'
        },
        {
            value: '116',
            provinceVal: '4',
            text: '东莞'
        },
        {
            value: '117',
            provinceVal: '4',
            text: '惠州'
        },
        {
            value: '118',
            provinceVal: '10',
            text: '贵阳'
        },
        {
            value: '119',
            provinceVal: '10',
            text: '安顺'
        },
        {
            value: '120',
            provinceVal: '10',
            text: '六盘水'
        },
        {
            value: '121',
            provinceVal: '10',
            text: '黔南'
        },
        {
            value: '122',
            provinceVal: '10',
            text: '黔东南'
        },
        {
            value: '123',
            provinceVal: '10',
            text: '黔西南'
        },
        {
            value: '124',
            provinceVal: '10',
            text: '毕节'
        },
        {
            value: '125',
            provinceVal: '10',
            text: '铜仁'
        },
        {
            value: '126',
            provinceVal: '10',
            text: '遵义'
        },
        {
            value: '127',
            provinceVal: '9',
            text: '淮北'
        },
        {
            value: '128',
            provinceVal: '9',
            text: '安庆'
        },
        {
            value: '129',
            provinceVal: '9',
            text: '巢湖'
        },
        {
            value: '130',
            provinceVal: '9',
            text: '池州'
        },
        {
            value: '131',
            provinceVal: '9',
            text: '滁州'
        },
        {
            value: '132',
            provinceVal: '9',
            text: '黄山'
        },
        {
            value: '133',
            provinceVal: '9',
            text: '淮南'
        },
        {
            value: '134',
            provinceVal: '9',
            text: '马鞍山'
        },
        {
            value: '135',
            provinceVal: '9',
            text: '六安'
        },
        {
            value: '136',
            provinceVal: '9',
            text: '宣城'
        },
        {
            value: '137',
            provinceVal: '9',
            text: '宿州'
        },
        {
            value: '138',
            provinceVal: '9',
            text: '铜陵'
        },
        {
            value: '139',
            provinceVal: '9',
            text: '芜湖'
        },
        {
            value: '140',
            provinceVal: '9',
            text: '阜阳'
        },
        {
            value: '141',
            provinceVal: '9',
            text: '蚌埠'
        },
        {
            value: '142',
            provinceVal: '9',
            text: '合肥'
        },
        {
            value: '143',
            provinceVal: '9',
            text: '亳州'
        },
        {
            value: '144',
            provinceVal: '21',
            text: '丹东'
        },
        {
            value: '145',
            provinceVal: '21',
            text: '本溪'
        },
        {
            value: '146',
            provinceVal: '21',
            text: '锦州'
        },
        {
            value: '147',
            provinceVal: '21',
            text: '朝阳'
        },
        {
            value: '148',
            provinceVal: '21',
            text: '辽阳'
        },
        {
            value: '149',
            provinceVal: '21',
            text: '盘锦'
        },
        {
            value: '150',
            provinceVal: '21',
            text: '阜新'
        },
        {
            value: '151',
            provinceVal: '21',
            text: '鞍山'
        },
        {
            value: '152',
            provinceVal: '21',
            text: '抚顺'
        },
        {
            value: '153',
            provinceVal: '21',
            text: '沈阳'
        },
        {
            value: '154',
            provinceVal: '21',
            text: '铁岭'
        },
        {
            value: '155',
            provinceVal: '21',
            text: '大连'
        },
        {
            value: '156',
            provinceVal: '21',
            text: '营口'
        },
        {
            value: '157',
            provinceVal: '21',
            text: '葫芦岛'
        },
        {
            value: '158',
            provinceVal: '22',
            text: '赤峰'
        },
        {
            value: '159',
            provinceVal: '22',
            text: '阿拉善盟'
        },
        {
            value: '160',
            provinceVal: '22',
            text: '兴安盟'
        },
        {
            value: '161',
            provinceVal: '22',
            text: '通辽'
        },
        {
            value: '162',
            provinceVal: '22',
            text: '巴彦淖尔'
        },
        {
            value: '163',
            provinceVal: '22',
            text: '乌兰察布'
        },
        {
            value: '164',
            provinceVal: '22',
            text: '乌海'
        },
        {
            value: '165',
            provinceVal: '22',
            text: '锡林郭勒盟'
        },
        {
            value: '166',
            provinceVal: '22',
            text: '呼伦贝尔'
        },
        {
            value: '167',
            provinceVal: '22',
            text: '呼和浩特'
        },
        {
            value: '168',
            provinceVal: '22',
            text: '鄂尔多斯'
        },
        {
            value: '169',
            provinceVal: '22',
            text: '包头'
        },
        {
            value: '170',
            provinceVal: '23',
            text: '固原'
        },
        {
            value: '171',
            provinceVal: '23',
            text: '石嘴山'
        },
        {
            value: '172',
            provinceVal: '23',
            text: '吴忠'
        },
        {
            value: '173',
            provinceVal: '23',
            text: '中卫'
        },
        {
            value: '174',
            provinceVal: '23',
            text: '银川'
        },
        {
            value: '175',
            provinceVal: '24',
            text: '西宁'
        },
        {
            value: '176',
            provinceVal: '24',
            text: '海东'
        },
        {
            value: '177',
            provinceVal: '24',
            text: '海西'
        },
        {
            value: '178',
            provinceVal: '24',
            text: '玉树'
        },
        {
            value: '179',
            provinceVal: '30',
            text: '哈密'
        },
        {
            value: '180',
            provinceVal: '30',
            text: '博尔塔拉'
        },
        {
            value: '181',
            provinceVal: '30',
            text: '昌吉'
        },
        {
            value: '182',
            provinceVal: '30',
            text: '阿勒泰'
        },
        {
            value: '183',
            provinceVal: '30',
            text: '喀什'
        },
        {
            value: '184',
            provinceVal: '30',
            text: '克拉玛依'
        },
        {
            value: '185',
            provinceVal: '30',
            text: '阿克苏'
        },
        {
            value: '186',
            provinceVal: '30',
            text: '克孜勒苏柯尔克孜'
        },
        {
            value: '187',
            provinceVal: '30',
            text: '石河子'
        },
        {
            value: '188',
            provinceVal: '30',
            text: '塔城'
        },
        {
            value: '189',
            provinceVal: '30',
            text: '五家渠'
        },
        {
            value: '190',
            provinceVal: '30',
            text: '吐鲁番'
        },
        {
            value: '191',
            provinceVal: '30',
            text: '巴音郭楞'
        },
        {
            value: '192',
            provinceVal: '30',
            text: '乌鲁木齐'
        },
        {
            value: '193',
            provinceVal: '30',
            text: '伊犁'
        },
        {
            value: '195',
            provinceVal: '30',
            text: '和田'
        },
        {
            value: '196',
            provinceVal: '25',
            text: '济南'
        },
        {
            value: '197',
            provinceVal: '25',
            text: '济宁'
        },
        {
            value: '198',
            provinceVal: '25',
            text: '莱芜'
        },
        {
            value: '199',
            provinceVal: '25',
            text: '聊城'
        },
        {
            value: '200',
            provinceVal: '25',
            text: '德州'
        },
        {
            value: '201',
            provinceVal: '25',
            text: '临沂'
        },
        {
            value: '202',
            provinceVal: '25',
            text: '青岛'
        },
        {
            value: '203',
            provinceVal: '25',
            text: '日照'
        },
        {
            value: '204',
            provinceVal: '25',
            text: '潍坊'
        },
        {
            value: '205',
            provinceVal: '26',
            text: '晋城'
        },
        {
            value: '206',
            provinceVal: '26',
            text: '晋中'
        },
        {
            value: '207',
            provinceVal: '25',
            text: '淄博'
        },
        {
            value: '208',
            provinceVal: '25',
            text: '泰安'
        },
        {
            value: '209',
            provinceVal: '26',
            text: '长治'
        },
        {
            value: '210',
            provinceVal: '26',
            text: '吕梁'
        },
        {
            value: '211',
            provinceVal: '26',
            text: '临汾'
        },
        {
            value: '212',
            provinceVal: '26',
            text: '忻州'
        },
        {
            value: '213',
            provinceVal: '26',
            text: '朔州'
        },
        {
            value: '214',
            provinceVal: '26',
            text: '太原'
        },
        {
            value: '215',
            provinceVal: '26',
            text: '阳泉'
        },
        {
            value: '216',
            provinceVal: '26',
            text: '运城'
        },
        {
            value: '217',
            provinceVal: '26',
            text: '大同'
        },
        {
            value: '218',
            provinceVal: '25',
            text: '威海'
        },
        {
            value: '219',
            provinceVal: '25',
            text: '烟台'
        },
        {
            value: '220',
            provinceVal: '25',
            text: '东营'
        },
        {
            value: '221',
            provinceVal: '25',
            text: '枣庄'
        },
        {
            value: '222',
            provinceVal: '25',
            text: '菏泽'
        },
        {
            value: '223',
            provinceVal: '25',
            text: '滨州'
        },
        {
            value: '224',
            provinceVal: '28',
            text: '广安'
        },
        {
            value: '225',
            provinceVal: '28',
            text: '广元'
        },
        {
            value: '226',
            provinceVal: '28',
            text: '成都'
        },
        {
            value: '227',
            provinceVal: '28',
            text: '眉山'
        },
        {
            value: '228',
            provinceVal: '28',
            text: '凉山'
        },
        {
            value: '229',
            provinceVal: '28',
            text: '绵阳'
        },
        {
            value: '230',
            provinceVal: '28',
            text: '攀枝花'
        },
        {
            value: '231',
            provinceVal: '28',
            text: '南充'
        },
        {
            value: '232',
            provinceVal: '28',
            text: '德阳'
        },
        {
            value: '233',
            provinceVal: '28',
            text: '乐山'
        },
        {
            value: '234',
            provinceVal: '28',
            text: '泸州'
        },
        {
            value: '235',
            provinceVal: '28',
            text: '内江'
        },
        {
            value: '236',
            provinceVal: '28',
            text: '甘孜'
        },
        {
            value: '237',
            provinceVal: '28',
            text: '遂宁'
        },
        {
            value: '238',
            provinceVal: '28',
            text: '资阳'
        },
        {
            value: '239',
            provinceVal: '27',
            text: '宝鸡'
        },
        {
            value: '240',
            provinceVal: '27',
            text: '安康'
        },
        {
            value: '241',
            provinceVal: '27',
            text: '商洛'
        },
        {
            value: '242',
            provinceVal: '27',
            text: '铜川'
        },
        {
            value: '243',
            provinceVal: '27',
            text: '渭南'
        },
        {
            value: '244',
            provinceVal: '27',
            text: '西安'
        },
        {
            value: '245',
            provinceVal: '27',
            text: '咸阳'
        },
        {
            value: '246',
            provinceVal: '27',
            text: '延安'
        },
        {
            value: '247',
            provinceVal: '28',
            text: '巴中'
        },
        {
            value: '248',
            provinceVal: '27',
            text: '汉中'
        },
        {
            value: '249',
            provinceVal: '27',
            text: '榆林'
        },
        {
            value: '250',
            provinceVal: '28',
            text: '达州'
        },
        {
            value: '251',
            provinceVal: '28',
            text: '雅安'
        },
        {
            value: '252',
            provinceVal: '28',
            text: '阿坝'
        },
        {
            value: '253',
            provinceVal: '28',
            text: '自贡'
        },
        {
            value: '254',
            provinceVal: '28',
            text: '宜宾'
        },
        {
            value: '255',
            provinceVal: '11',
            text: '酒泉'
        },
        {
            value: '256',
            provinceVal: '11',
            text: '金昌'
        },
        {
            value: '257',
            provinceVal: '11',
            text: '嘉峪关'
        },
        {
            value: '258',
            provinceVal: '11',
            text: '兰州'
        },
        {
            value: '259',
            provinceVal: '11',
            text: '陇南'
        },
        {
            value: '260',
            provinceVal: '11',
            text: '平凉'
        },
        {
            value: '261',
            provinceVal: '11',
            text: '临夏'
        },
        {
            value: '262',
            provinceVal: '11',
            text: '庆阳'
        },
        {
            value: '263',
            provinceVal: '11',
            text: '定西'
        },
        {
            value: '264',
            provinceVal: '11',
            text: '武威'
        },
        {
            value: '265',
            provinceVal: '11',
            text: '天水'
        },
        {
            value: '266',
            provinceVal: '11',
            text: '张掖'
        },
        {
            value: '267',
            provinceVal: '11',
            text: '白银'
        },
        {
            value: '268',
            provinceVal: '29',
            text: '那曲'
        },
        {
            value: '269',
            provinceVal: '29',
            text: '拉萨'
        },
        {
            value: '270',
            provinceVal: '29',
            text: '林芝'
        },
        {
            value: '271',
            provinceVal: '29',
            text: '日喀则'
        },
        {
            value: '272',
            provinceVal: '32',
            text: '金华'
        },
        {
            value: '273',
            provinceVal: '32',
            text: '嘉兴'
        },
        {
            value: '274',
            provinceVal: '32',
            text: '衢州'
        },
        {
            value: '275',
            provinceVal: '32',
            text: '丽水'
        },
        {
            value: '276',
            provinceVal: '32',
            text: '宁波'
        },
        {
            value: '277',
            provinceVal: '32',
            text: '绍兴'
        },
        {
            value: '278',
            provinceVal: '32',
            text: '温州'
        },
        {
            value: '279',
            provinceVal: '32',
            text: '台州'
        },
        {
            value: '280',
            provinceVal: '32',
            text: '杭州'
        },
        {
            value: '281',
            provinceVal: '32',
            text: '舟山'
        },
        {
            value: '282',
            provinceVal: '32',
            text: '湖州'
        },
        {
            value: '283',
            provinceVal: '31',
            text: '楚雄'
        },
        {
            value: '284',
            provinceVal: '31',
            text: '昆明'
        },
        {
            value: '285',
            provinceVal: '31',
            text: '丽江'
        },
        {
            value: '286',
            provinceVal: '31',
            text: '德宏'
        },
        {
            value: '287',
            provinceVal: '31',
            text: '临沧'
        },
        {
            value: '288',
            provinceVal: '31',
            text: '曲靖'
        },
        {
            value: '289',
            provinceVal: '31',
            text: '保山'
        },
        {
            value: '290',
            provinceVal: '31',
            text: '普洱'
        },
        {
            value: '291',
            provinceVal: '31',
            text: '文山'
        },
        {
            value: '292',
            provinceVal: '31',
            text: '大理'
        },
        {
            value: '293',
            provinceVal: '31',
            text: '红河'
        },
        {
            value: '294',
            provinceVal: '31',
            text: '昭通'
        },
        {
            value: '295',
            provinceVal: '31',
            text: '玉溪'
        },
        {
            value: '296',
            provinceVal: '8',
            text: '东方'
        },
        {
            value: '297',
            provinceVal: '8',
            text: '琼海'
        },
        {
            value: '298',
            provinceVal: '8',
            text: '三亚'
        },
        {
            value: '299',
            provinceVal: '8',
            text: '文昌'
        },
        {
            value: '300',
            provinceVal: '8',
            text: '五指山'
        },
        {
            value: '301',
            provinceVal: '8',
            text: '万宁'
        },
        {
            value: '302',
            provinceVal: '8',
            text: '海口'
        },
        {
            value: '303',
            provinceVal: '8',
            text: '儋州'
        },
        {
            value: '304',
            provinceVal: '13',
            text: '保定'
        },
        {
            value: '305',
            provinceVal: '13',
            text: '沧州'
        },
        {
            value: '306',
            provinceVal: '13',
            text: '承德'
        },
        {
            value: '307',
            provinceVal: '13',
            text: '廊坊'
        },
        {
            value: '308',
            provinceVal: '14',
            text: '焦作'
        },
        {
            value: '309',
            provinceVal: '14',
            text: '安阳'
        },
        {
            value: '310',
            provinceVal: '14',
            text: '开封'
        },
        {
            value: '311',
            provinceVal: '14',
            text: '洛阳'
        },
        {
            value: '312',
            provinceVal: '14',
            text: '漯河'
        },
        {
            value: '313',
            provinceVal: '14',
            text: '平顶山'
        },
        {
            value: '314',
            provinceVal: '14',
            text: '驻马店'
        },
        {
            value: '315',
            provinceVal: '14',
            text: '南阳'
        },
        {
            value: '316',
            provinceVal: '14',
            text: '濮阳'
        },
        {
            value: '317',
            provinceVal: '14',
            text: '新乡'
        },
        {
            value: '318',
            provinceVal: '14',
            text: '信阳'
        },
        {
            value: '319',
            provinceVal: '14',
            text: '许昌'
        },
        {
            value: '320',
            provinceVal: '14',
            text: '商丘'
        },
        {
            value: '321',
            provinceVal: '14',
            text: '三门峡'
        },
        {
            value: '322',
            provinceVal: '14',
            text: '郑州'
        },
        {
            value: '323',
            provinceVal: '14',
            text: '鹤壁'
        },
        {
            value: '324',
            provinceVal: '14',
            text: '周口'
        },
        {
            value: '325',
            provinceVal: '13',
            text: '秦皇岛'
        },
        {
            value: '326',
            provinceVal: '13',
            text: '邢台'
        },
        {
            value: '327',
            provinceVal: '13',
            text: '石家庄'
        },
        {
            value: '329',
            provinceVal: '13',
            text: '唐山'
        },
        {
            value: '330',
            provinceVal: '13',
            text: '邯郸'
        },
        {
            value: '331',
            provinceVal: '13',
            text: '张家口'
        },
        {
            value: '332',
            provinceVal: '13',
            text: '衡水'
        },
        {
            value: '333',
            provinceVal: '15',
            text: '鸡西'
        },
        {
            value: '334',
            provinceVal: '15',
            text: '佳木斯'
        },
        {
            value: '335',
            provinceVal: '15',
            text: '哈尔滨'
        },
        {
            value: '336',
            provinceVal: '15',
            text: '牡丹江'
        },
        {
            value: '337',
            provinceVal: '15',
            text: '齐齐哈尔'
        },
        {
            value: '338',
            provinceVal: '15',
            text: '七台河'
        },
        {
            value: '339',
            provinceVal: '15',
            text: '绥化'
        },
        {
            value: '340',
            provinceVal: '15',
            text: '双鸭山'
        },
        {
            value: '341',
            provinceVal: '15',
            text: '伊春'
        },
        {
            value: '342',
            provinceVal: '15',
            text: '大庆'
        },
        {
            value: '343',
            provinceVal: '15',
            text: '大兴安岭'
        },
        {
            value: '344',
            provinceVal: '15',
            text: '鹤岗'
        },
        {
            value: '345',
            provinceVal: '15',
            text: '黑河'
        },
        {
            value: '346',
            provinceVal: '16',
            text: '荆门'
        },
        {
            value: '347',
            provinceVal: '16',
            text: '荆州'
        },
        {
            value: '348',
            provinceVal: '16',
            text: '黄石'
        },
        {
            value: '349',
            provinceVal: '16',
            text: '黄冈'
        },
        {
            value: '350',
            provinceVal: '17',
            text: '怀化'
        },
        {
            value: '351',
            provinceVal: '17',
            text: '常德'
        },
        {
            value: '352',
            provinceVal: '17',
            text: '长沙'
        },
        {
            value: '353',
            provinceVal: '17',
            text: '郴州'
        },
        {
            value: '354',
            provinceVal: '17',
            text: '娄底'
        },
        {
            value: '355',
            provinceVal: '17',
            text: '邵阳'
        },
        {
            value: '356',
            provinceVal: '17',
            text: '湘潭'
        },
        {
            value: '357',
            provinceVal: '17',
            text: '湘西'
        },
        {
            value: '358',
            provinceVal: '17',
            text: '张家界'
        },
        {
            value: '359',
            provinceVal: '17',
            text: '益阳'
        },
        {
            value: '360',
            provinceVal: '17',
            text: '衡阳'
        },
        {
            value: '361',
            provinceVal: '17',
            text: '岳阳'
        },
        {
            value: '362',
            provinceVal: '17',
            text: '永州'
        },
        {
            value: '363',
            provinceVal: '17',
            text: '株洲'
        },
        {
            value: '364',
            provinceVal: '16',
            text: '潜江'
        },
        {
            value: '365',
            provinceVal: '16',
            text: '孝感'
        },
        {
            value: '366',
            provinceVal: '16',
            text: '恩施'
        },
        {
            value: '367',
            provinceVal: '16',
            text: '随州'
        },
        {
            value: '368',
            provinceVal: '16',
            text: '神农架'
        },
        {
            value: '369',
            provinceVal: '16',
            text: '十堰'
        },
        {
            value: '370',
            provinceVal: '16',
            text: '襄樊'
        },
        {
            value: '371',
            provinceVal: '16',
            text: '武汉'
        },
        {
            value: '372',
            provinceVal: '16',
            text: '仙桃'
        },
        {
            value: '373',
            provinceVal: '16',
            text: '天门'
        },
        {
            value: '375',
            provinceVal: '16',
            text: '咸宁'
        },
        {
            value: '376',
            provinceVal: '16',
            text: '宜昌'
        },
        {
            value: '377',
            provinceVal: '16',
            text: '鄂州'
        },
        {
            value: '378',
            provinceVal: '1',
            text: '东城'
        },
        {
            value: '379',
            provinceVal: '1',
            text: '西城'
        },
        {
            value: '382',
            provinceVal: '1',
            text: '朝阳'
        },
        {
            value: '383',
            provinceVal: '1',
            text: '丰台'
        },
        {
            value: '384',
            provinceVal: '1',
            text: '石景山'
        },
        {
            value: '385',
            provinceVal: '1',
            text: '海淀'
        },
        {
            value: '386',
            provinceVal: '1',
            text: '门头沟'
        },
        {
            value: '387',
            provinceVal: '1',
            text: '房山'
        },
        {
            value: '388',
            provinceVal: '1',
            text: '通州'
        },
        {
            value: '389',
            provinceVal: '1',
            text: '顺义'
        },
        {
            value: '390',
            provinceVal: '1',
            text: '昌平'
        },
        {
            value: '391',
            provinceVal: '1',
            text: '大兴'
        },
        {
            value: '392',
            provinceVal: '1',
            text: '怀柔'
        },
        {
            value: '393',
            provinceVal: '1',
            text: '平谷'
        },
        {
            value: '394',
            provinceVal: '1',
            text: '密云'
        },
        {
            value: '395',
            provinceVal: '1',
            text: '延庆'
        },
        {
            value: '396',
            provinceVal: '2',
            text: '黄浦'
        },
        {
            value: '397',
            provinceVal: '2',
            text: '卢湾'
        },
        {
            value: '398',
            provinceVal: '2',
            text: '徐汇'
        },
        {
            value: '399',
            provinceVal: '2',
            text: '长宁'
        },
        {
            value: '400',
            provinceVal: '2',
            text: '静安'
        },
        {
            value: '401',
            provinceVal: '2',
            text: '普陀'
        },
        {
            value: '402',
            provinceVal: '2',
            text: '闸北'
        },
        {
            value: '403',
            provinceVal: '2',
            text: '虹口'
        },
        {
            value: '404',
            provinceVal: '2',
            text: '杨浦'
        },
        {
            value: '405',
            provinceVal: '2',
            text: '闵行'
        },
        {
            value: '406',
            provinceVal: '2',
            text: '宝山'
        },
        {
            value: '407',
            provinceVal: '2',
            text: '嘉定'
        },
        {
            value: '408',
            provinceVal: '2',
            text: '浦东'
        },
        {
            value: '409',
            provinceVal: '2',
            text: '金山'
        },
        {
            value: '410',
            provinceVal: '2',
            text: '松江'
        },
        {
            value: '411',
            provinceVal: '2',
            text: '青浦'
        },
        {
            value: '413',
            provinceVal: '2',
            text: '奉贤'
        },
        {
            value: '414',
            provinceVal: '2',
            text: '崇明'
        },
        {
            value: '415',
            provinceVal: '3',
            text: '和平'
        },
        {
            value: '416',
            provinceVal: '3',
            text: '河东'
        },
        {
            value: '417',
            provinceVal: '3',
            text: '河西'
        },
        {
            value: '418',
            provinceVal: '3',
            text: '南开'
        },
        {
            value: '419',
            provinceVal: '3',
            text: '河北'
        },
        {
            value: '420',
            provinceVal: '3',
            text: '红桥'
        },
        {
            value: '424',
            provinceVal: '3',
            text: '东丽'
        },
        {
            value: '425',
            provinceVal: '3',
            text: '西青'
        },
        {
            value: '426',
            provinceVal: '3',
            text: '津南'
        },
        {
            value: '427',
            provinceVal: '3',
            text: '北辰'
        },
        {
            value: '428',
            provinceVal: '3',
            text: '武清'
        },
        {
            value: '429',
            provinceVal: '3',
            text: '宝坻'
        },
        {
            value: '430',
            provinceVal: '3',
            text: '宁河'
        },
        {
            value: '431',
            provinceVal: '3',
            text: '静海'
        },
        {
            value: '432',
            provinceVal: '3',
            text: '蓟县'
        },
        {
            value: '433',
            provinceVal: '33',
            text: '渝中'
        },
        {
            value: '434',
            provinceVal: '33',
            text: '大渡口'
        },
        {
            value: '435',
            provinceVal: '33',
            text: '江北'
        },
        {
            value: '436',
            provinceVal: '33',
            text: '沙坪坝'
        },
        {
            value: '437',
            provinceVal: '33',
            text: '九龙坡'
        },
        {
            value: '438',
            provinceVal: '33',
            text: '南岸'
        },
        {
            value: '439',
            provinceVal: '33',
            text: '北碚'
        },
        {
            value: '440',
            provinceVal: '33',
            text: '万盛'
        },
        {
            value: '441',
            provinceVal: '33',
            text: '双桥'
        },
        {
            value: '442',
            provinceVal: '33',
            text: '渝北'
        },
        {
            value: '443',
            provinceVal: '33',
            text: '巴南'
        },
        {
            value: '444',
            provinceVal: '33',
            text: '万州'
        },
        {
            value: '445',
            provinceVal: '33',
            text: '涪陵'
        },
        {
            value: '446',
            provinceVal: '33',
            text: '黔江'
        },
        {
            value: '447',
            provinceVal: '33',
            text: '长寿'
        },
        {
            value: '448',
            provinceVal: '33',
            text: '江津'
        },
        {
            value: '449',
            provinceVal: '33',
            text: '合川'
        },
        {
            value: '450',
            provinceVal: '33',
            text: '永川'
        },
        {
            value: '451',
            provinceVal: '33',
            text: '南川'
        },
        {
            value: '452',
            provinceVal: '33',
            text: '綦江'
        },
        {
            value: '453',
            provinceVal: '33',
            text: '潼南'
        },
        {
            value: '454',
            provinceVal: '33',
            text: '铜梁'
        },
        {
            value: '455',
            provinceVal: '33',
            text: '大足'
        },
        {
            value: '456',
            provinceVal: '33',
            text: '荣昌'
        },
        {
            value: '457',
            provinceVal: '33',
            text: '璧山'
        },
        {
            value: '458',
            provinceVal: '33',
            text: '梁平'
        },
        {
            value: '459',
            provinceVal: '33',
            text: '城口'
        },
        {
            value: '460',
            provinceVal: '33',
            text: '丰都'
        },
        {
            value: '461',
            provinceVal: '33',
            text: '垫江'
        },
        {
            value: '462',
            provinceVal: '33',
            text: '武隆'
        },
        {
            value: '463',
            provinceVal: '33',
            text: '忠县'
        },
        {
            value: '464',
            provinceVal: '33',
            text: '开县'
        },
        {
            value: '465',
            provinceVal: '33',
            text: '云阳'
        },
        {
            value: '466',
            provinceVal: '33',
            text: '奉节'
        },
        {
            value: '467',
            provinceVal: '33',
            text: '巫山'
        },
        {
            value: '468',
            provinceVal: '33',
            text: '巫溪'
        },
        {
            value: '469',
            provinceVal: '33',
            text: '石柱'
        },
        {
            value: '470',
            provinceVal: '33',
            text: '秀山'
        },
        {
            value: '471',
            provinceVal: '33',
            text: '酉阳'
        },
        {
            value: '472',
            provinceVal: '33',
            text: '彭水'
        },
        {
            value: '475',
            provinceVal: '3',
            text: '滨海'
        },
        {
            value: '476',
            provinceVal: '14',
            text: '济源'
        },
        {
            value: '477',
            provinceVal: '11',
            text: '甘南'
        },
        {
            value: '478',
            provinceVal: '12',
            text: '崇左'
        },
        {
            value: '479',
            provinceVal: '24',
            text: '海南'
        },
        {
            value: '480',
            provinceVal: '29',
            text: '昌都'
        },
        {
            value: '481',
            provinceVal: '31',
            text: '怒江'
        },
        {
            value: '482',
            provinceVal: '31',
            text: '迪庆'
        },
        {
            value: '483',
            provinceVal: '31',
            text: '西双版纳'
        },
        {
            value: '484',
            provinceVal: '8',
            text: '定安县'
        },
        {
            value: '485',
            provinceVal: '8',
            text: '屯昌县'
        },
        {
            value: '486',
            provinceVal: '8',
            text: '陵水黎族自治县'
        },
        {
            value: '487',
            provinceVal: '8',
            text: '澄迈县'
        },
        {
            value: '488',
            provinceVal: '8',
            text: '保亭黎族苗族自治县'
        },
        {
            value: '489',
            provinceVal: '8',
            text: '琼中黎族苗族自治县'
        },
        {
            value: '490',
            provinceVal: '8',
            text: '乐东黎族自治县'
        },
        {
            value: '491',
            provinceVal: '8',
            text: '临高县'
        },
        {
            value: '492',
            provinceVal: '8',
            text: '昌江黎族自治县'
        },
        {
            value: '493',
            provinceVal: '8',
            text: '白沙黎族自治县'
        },
        {
            value: '494',
            provinceVal: '24',
            text: '海北'
        },
        {
            value: '495',
            provinceVal: '24',
            text: '黄南'
        },
        {
            value: '496',
            provinceVal: '24',
            text: '果洛'
        },
        {
            value: '497',
            provinceVal: '29',
            text: '山南'
        },
        {
            value: '498',
            provinceVal: '29',
            text: '阿里'
        },
        {
            value: '499',
            provinceVal: '30',
            text: '阿拉尔'
        },
        {
            value: '500',
            provinceVal: '30',
            text: '图木舒克'
        }
    ];

    return {
        /**
         * 获取所有城市数据
         */
        getAll: function () {
            return data;
        },

        /**
         * 根据省份获取城市
         *
         * @param {number} prov 省份
         */
        getCityByProvince: function (prov) {
            var ret = [
                {
                    value: '请选择城市',
                    provinceVal: '请选择省份',
                    text: '请选择城市'
                }
            ];
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].provinceVal === prov) {
                    ret.push(data[i]);
                }
            }
            return ret;
        }
    };

});
