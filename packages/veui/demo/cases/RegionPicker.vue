<template>
  <article>
    <h1><code>&lt;veui-region-picker&gt;</code></h1>
    <h3>品牌数据源</h3>
    <section><input type="text" v-model="selected"></section>
    <section>已选地区：{{ selected1.join(', ') || '无' }}</section>
    <section>
      <veui-region-picker :datasource="regions1" v-model="selected1" include-indeterminate></veui-region-picker>
    </section>
    <h3>网盟数据源</h3>
    <section>已选地区：{{ selected2.join(', ') || '无' }}</section>
    <section>
      <veui-region-picker :datasource="regions2" v-model="selected2"></veui-region-picker>
    </section>
  </article>
</template>

<script>
import { RegionPicker } from 'veui'

export default {
  name: 'region-picker-demo',
  components: {
    'veui-region-picker': RegionPicker
  },
  data () {
    return {
      regions1: REGIONS_BRAND,
      selected1: ['15', '333'],
      regions2: REGIONS_CLB,
      selected2: ['742', '743', '17'],
      selected: ''
    }
  },
  watch: {
    selected (val) {
      let ids = val.split(/,\s*/).filter(id => id)
      if (ids.length) {
        this.selected1 = ids
      }
    }
  }
}

const REGIONS_BRAND = [
  {
    value: '10000',
    label: '中国',
    children: [
      {
        value: '1000',
        label: '华北地区',
        children: [
          {
            value: '1',
            label: '北京',
            children: [
              {
                value: '378',
                label: '东城'
              },
              {
                value: '379',
                label: '西城'
              },
              {
                value: '380',
                label: '崇文'
              },
              {
                value: '381',
                label: '宣武'
              },
              {
                value: '382',
                label: '朝阳'
              },
              {
                value: '383',
                label: '丰台'
              },
              {
                value: '384',
                label: '石景山'
              },
              {
                value: '385',
                label: '海淀'
              },
              {
                value: '386',
                label: '门头沟'
              },
              {
                value: '387',
                label: '房山'
              },
              {
                value: '388',
                label: '通州'
              },
              {
                value: '389',
                label: '顺义'
              },
              {
                value: '390',
                label: '昌平'
              },
              {
                value: '391',
                label: '大兴'
              },
              {
                value: '392',
                label: '怀柔'
              },
              {
                value: '393',
                label: '平谷'
              },
              {
                value: '394',
                label: '密云'
              },
              {
                value: '395',
                label: '延庆'
              }
            ]
          },
          {
            value: '3',
            label: '天津',
            children: [
              {
                value: '415',
                label: '和平'
              },
              {
                value: '416',
                label: '河东'
              },
              {
                value: '417',
                label: '河西'
              },
              {
                value: '418',
                label: '南开'
              },
              {
                value: '419',
                label: '河北'
              },
              {
                value: '420',
                label: '红桥'
              },
              {
                value: '421',
                label: '塘沽'
              },
              {
                value: '422',
                label: '汉沽'
              },
              {
                value: '423',
                label: '大港'
              },
              {
                value: '424',
                label: '东丽'
              },
              {
                value: '425',
                label: '西青'
              },
              {
                value: '426',
                label: '津南'
              },
              {
                value: '427',
                label: '北辰'
              },
              {
                value: '428',
                label: '武清'
              },
              {
                value: '429',
                label: '宝坻'
              },
              {
                value: '430',
                label: '宁河'
              },
              {
                value: '431',
                label: '静海'
              },
              {
                value: '432',
                label: '蓟县'
              },
              {
                value: '475',
                label: '滨海'
              }
            ]
          },
          {
            value: '13',
            label: '河北',
            children: [
              {
                value: '304',
                label: '保定'
              },
              {
                value: '305',
                label: '沧州'
              },
              {
                value: '306',
                label: '承德'
              },
              {
                value: '307',
                label: '廊坊'
              },
              {
                value: '325',
                label: '秦皇岛'
              },
              {
                value: '326',
                label: '邢台'
              },
              {
                value: '327',
                label: '石家庄'
              },
              {
                value: '329',
                label: '唐山'
              },
              {
                value: '330',
                label: '邯郸'
              },
              {
                value: '331',
                label: '张家口'
              },
              {
                value: '332',
                label: '衡水'
              }
            ]
          },
          {
            value: '22',
            label: '内蒙古',
            children: [
              {
                value: '158',
                label: '赤峰'
              },
              {
                value: '159',
                label: '阿拉善盟'
              },
              {
                value: '160',
                label: '兴安盟'
              },
              {
                value: '161',
                label: '通辽'
              },
              {
                value: '162',
                label: '巴彦淖尔'
              },
              {
                value: '163',
                label: '乌兰察布'
              },
              {
                value: '164',
                label: '乌海'
              },
              {
                value: '165',
                label: '锡林郭勒盟'
              },
              {
                value: '166',
                label: '呼伦贝尔'
              },
              {
                value: '167',
                label: '呼和浩特'
              },
              {
                value: '168',
                label: '鄂尔多斯'
              },
              {
                value: '169',
                label: '包头'
              }
            ]
          },
          {
            value: '26',
            label: '山西',
            children: [
              {
                value: '205',
                label: '晋城'
              },
              {
                value: '206',
                label: '晋中'
              },
              {
                value: '209',
                label: '长治'
              },
              {
                value: '210',
                label: '吕梁'
              },
              {
                value: '211',
                label: '临汾'
              },
              {
                value: '212',
                label: '忻州'
              },
              {
                value: '213',
                label: '朔州'
              },
              {
                value: '214',
                label: '太原'
              },
              {
                value: '215',
                label: '阳泉'
              },
              {
                value: '216',
                label: '运城'
              },
              {
                value: '217',
                label: '大同'
              }
            ]
          }
        ]
      },
      {
        value: '1001',
        label: '东北地区',
        children: [
          {
            value: '15',
            label: '黑龙江',
            disabled: true,
            children: [
              {
                value: '333',
                label: '鸡西'
              },
              {
                value: '334',
                label: '佳木斯'
              },
              {
                value: '335',
                label: '哈尔滨'
              },
              {
                value: '336',
                label: '牡丹江'
              },
              {
                value: '337',
                label: '齐齐哈尔'
              },
              {
                value: '338',
                label: '七台河'
              },
              {
                value: '339',
                label: '绥化'
              },
              {
                value: '340',
                label: '双鸭山'
              },
              {
                value: '341',
                label: '伊春'
              },
              {
                value: '342',
                label: '大庆'
              },
              {
                value: '343',
                label: '大兴安岭'
              },
              {
                value: '344',
                label: '鹤岗'
              },
              {
                value: '345',
                label: '黑河'
              }
            ]
          },
          {
            value: '18',
            label: '吉林',
            children: [
              {
                value: '38',
                label: '吉林'
              },
              {
                value: '39',
                label: '白城'
              },
              {
                value: '40',
                label: '长春'
              },
              {
                value: '41',
                label: '辽源'
              },
              {
                value: '42',
                label: '白山'
              },
              {
                value: '43',
                label: '四平'
              },
              {
                value: '44',
                label: '松原'
              },
              {
                value: '45',
                label: '通化'
              },
              {
                value: '46',
                label: '延吉'
              },
              {
                value: '47',
                label: '延边'
              }
            ]
          },
          {
            value: '21',
            label: '辽宁',
            children: [
              {
                value: '144',
                label: '丹东',
                disabled: true
              },
              {
                value: '145',
                label: '本溪'
              },
              {
                value: '146',
                label: '锦州'
              },
              {
                value: '147',
                label: '朝阳'
              },
              {
                value: '148',
                label: '辽阳'
              },
              {
                value: '149',
                label: '盘锦'
              },
              {
                value: '150',
                label: '阜新'
              },
              {
                value: '151',
                label: '鞍山'
              },
              {
                value: '152',
                label: '抚顺'
              },
              {
                value: '153',
                label: '沈阳'
              },
              {
                value: '154',
                label: '铁岭'
              },
              {
                value: '155',
                label: '大连'
              },
              {
                value: '156',
                label: '营口'
              },
              {
                value: '157',
                label: '葫芦岛'
              }
            ]
          }
        ]
      },
      {
        value: '1002',
        label: '华东地区',
        children: [
          {
            value: '2',
            label: '上海',
            children: [
              {
                value: '396',
                label: '黄浦'
              },
              {
                value: '397',
                label: '卢湾'
              },
              {
                value: '398',
                label: '徐汇'
              },
              {
                value: '399',
                label: '长宁'
              },
              {
                value: '400',
                label: '静安'
              },
              {
                value: '401',
                label: '普陀'
              },
              {
                value: '402',
                label: '闸北'
              },
              {
                value: '403',
                label: '虹口'
              },
              {
                value: '404',
                label: '杨浦'
              },
              {
                value: '405',
                label: '闵行'
              },
              {
                value: '406',
                label: '宝山'
              },
              {
                value: '407',
                label: '嘉定'
              },
              {
                value: '408',
                label: '浦东'
              },
              {
                value: '409',
                label: '金山'
              },
              {
                value: '410',
                label: '松江'
              },
              {
                value: '411',
                label: '青浦'
              },
              {
                value: '412',
                label: '南汇'
              },
              {
                value: '413',
                label: '奉贤'
              },
              {
                value: '414',
                label: '崇明'
              }
            ]
          },
          {
            value: '9',
            label: '安徽',
            children: [
              {
                value: '127',
                label: '淮北'
              },
              {
                value: '128',
                label: '安庆'
              },
              {
                value: '129',
                label: '巢湖'
              },
              {
                value: '130',
                label: '池州'
              },
              {
                value: '131',
                label: '滁州'
              },
              {
                value: '132',
                label: '黄山'
              },
              {
                value: '133',
                label: '淮南'
              },
              {
                value: '134',
                label: '马鞍山'
              },
              {
                value: '135',
                label: '六安'
              },
              {
                value: '136',
                label: '宣城'
              },
              {
                value: '137',
                label: '宿州'
              },
              {
                value: '138',
                label: '铜陵'
              },
              {
                value: '139',
                label: '芜湖'
              },
              {
                value: '140',
                label: '阜阳'
              },
              {
                value: '141',
                label: '蚌埠'
              },
              {
                value: '142',
                label: '合肥'
              },
              {
                value: '143',
                label: '亳州'
              }
            ]
          },
          {
            value: '5',
            label: '福建',
            children: [
              {
                value: '48',
                label: '莆田'
              },
              {
                value: '49',
                label: '南平'
              },
              {
                value: '50',
                label: '龙岩'
              },
              {
                value: '51',
                label: '宁德'
              },
              {
                value: '52',
                label: '泉州'
              },
              {
                value: '66',
                label: '三明'
              },
              {
                value: '70',
                label: '厦门'
              },
              {
                value: '80',
                label: '漳州'
              },
              {
                value: '81',
                label: '福州'
              }
            ]
          },
          {
            value: '19',
            label: '江苏',
            children: [
              {
                value: '53',
                label: '淮安'
              },
              {
                value: '54',
                label: '常州'
              },
              {
                value: '55',
                label: '南京'
              },
              {
                value: '56',
                label: '南通'
              },
              {
                value: '57',
                label: '连云港'
              },
              {
                value: '58',
                label: '徐州'
              },
              {
                value: '59',
                label: '苏州'
              },
              {
                value: '60',
                label: '宿迁'
              },
              {
                value: '61',
                label: '泰州'
              },
              {
                value: '62',
                label: '无锡'
              },
              {
                value: '63',
                label: '盐城'
              },
              {
                value: '64',
                label: '扬州'
              }
            ]
          },
          {
            value: '20',
            label: '江西',
            children: [
              {
                value: '67',
                label: '九江'
              },
              {
                value: '68',
                label: '吉安'
              },
              {
                value: '69',
                label: '景德镇'
              },
              {
                value: '71',
                label: '萍乡'
              },
              {
                value: '72',
                label: '南昌'
              },
              {
                value: '73',
                label: '新余'
              },
              {
                value: '74',
                label: '上饶'
              },
              {
                value: '75',
                label: '宜春'
              },
              {
                value: '76',
                label: '鹰潭'
              },
              {
                value: '77',
                label: '赣州'
              },
              {
                value: '78',
                label: '抚州'
              }
            ]
          },
          {
            value: '25',
            label: '山东',
            children: [
              {
                value: '196',
                label: '济南'
              },
              {
                value: '197',
                label: '济宁'
              },
              {
                value: '198',
                label: '莱芜'
              },
              {
                value: '199',
                label: '聊城'
              },
              {
                value: '200',
                label: '德州'
              },
              {
                value: '201',
                label: '临沂'
              },
              {
                value: '202',
                label: '青岛'
              },
              {
                value: '203',
                label: '日照'
              },
              {
                value: '204',
                label: '潍坊'
              },
              {
                value: '207',
                label: '淄博'
              },
              {
                value: '208',
                label: '泰安'
              },
              {
                value: '218',
                label: '威海'
              },
              {
                value: '219',
                label: '烟台'
              },
              {
                value: '220',
                label: '东营'
              },
              {
                value: '221',
                label: '枣庄'
              },
              {
                value: '222',
                label: '菏泽'
              },
              {
                value: '223',
                label: '滨州'
              }
            ]
          },
          {
            value: '32',
            label: '浙江',
            children: [
              {
                value: '272',
                label: '金华'
              },
              {
                value: '273',
                label: '嘉兴'
              },
              {
                value: '274',
                label: '衢州'
              },
              {
                value: '275',
                label: '丽水'
              },
              {
                value: '276',
                label: '宁波'
              },
              {
                value: '277',
                label: '绍兴'
              },
              {
                value: '278',
                label: '温州'
              },
              {
                value: '279',
                label: '台州'
              },
              {
                value: '280',
                label: '杭州'
              },
              {
                value: '281',
                label: '舟山'
              },
              {
                value: '282',
                label: '湖州'
              }
            ]
          }
        ]
      },
      {
        value: '1003',
        label: '华中地区',
        children: [
          {
            value: '14',
            label: '河南',
            children: [
              {
                value: '308',
                label: '焦作'
              },
              {
                value: '309',
                label: '安阳'
              },
              {
                value: '310',
                label: '开封'
              },
              {
                value: '311',
                label: '洛阳'
              },
              {
                value: '312',
                label: '漯河'
              },
              {
                value: '313',
                label: '平顶山'
              },
              {
                value: '314',
                label: '驻马店'
              },
              {
                value: '315',
                label: '南阳'
              },
              {
                value: '316',
                label: '濮阳'
              },
              {
                value: '317',
                label: '新乡'
              },
              {
                value: '318',
                label: '信阳'
              },
              {
                value: '319',
                label: '许昌'
              },
              {
                value: '320',
                label: '商丘'
              },
              {
                value: '321',
                label: '三门峡'
              },
              {
                value: '322',
                label: '郑州'
              },
              {
                value: '323',
                label: '鹤壁'
              },
              {
                value: '324',
                label: '周口'
              },
              {
                value: '476',
                label: '济源'
              }
            ]
          },
          {
            value: '16',
            label: '湖北',
            children: [
              {
                value: '346',
                label: '荆门'
              },
              {
                value: '347',
                label: '荆州'
              },
              {
                value: '348',
                label: '黄石'
              },
              {
                value: '349',
                label: '黄冈'
              },
              {
                value: '364',
                label: '潜江'
              },
              {
                value: '365',
                label: '孝感'
              },
              {
                value: '366',
                label: '恩施'
              },
              {
                value: '367',
                label: '随州'
              },
              {
                value: '368',
                label: '神农架'
              },
              {
                value: '369',
                label: '十堰'
              },
              {
                value: '370',
                label: '襄樊'
              },
              {
                value: '371',
                label: '武汉'
              },
              {
                value: '372',
                label: '仙桃'
              },
              {
                value: '373',
                label: '天门'
              },
              {
                value: '375',
                label: '咸宁'
              },
              {
                value: '376',
                label: '宜昌'
              },
              {
                value: '377',
                label: '鄂州'
              }
            ]
          },
          {
            value: '17',
            label: '湖南',
            children: [
              {
                value: '350',
                label: '怀化'
              },
              {
                value: '351',
                label: '常德'
              },
              {
                value: '352',
                label: '长沙'
              },
              {
                value: '353',
                label: '郴州'
              },
              {
                value: '354',
                label: '娄底'
              },
              {
                value: '355',
                label: '邵阳'
              },
              {
                value: '356',
                label: '湘潭'
              },
              {
                value: '357',
                label: '湘西'
              },
              {
                value: '358',
                label: '张家界'
              },
              {
                value: '359',
                label: '益阳'
              },
              {
                value: '360',
                label: '衡阳'
              },
              {
                value: '361',
                label: '岳阳'
              },
              {
                value: '362',
                label: '永州'
              },
              {
                value: '363',
                label: '株洲'
              }
            ]
          }
        ]
      },
      {
        value: '1004',
        label: '华南地区',
        children: [
          {
            value: '4',
            label: '广东',
            children: [
              {
                value: '82',
                label: '江门'
              },
              {
                value: '83',
                label: '揭阳'
              },
              {
                value: '84',
                label: '广州'
              },
              {
                value: '85',
                label: '潮州'
              },
              {
                value: '86',
                label: '茂名'
              },
              {
                value: '88',
                label: '梅州'
              },
              {
                value: '89',
                label: '清远'
              },
              {
                value: '90',
                label: '佛山'
              },
              {
                value: '91',
                label: '汕头'
              },
              {
                value: '92',
                label: '汕尾'
              },
              {
                value: '93',
                label: '深圳'
              },
              {
                value: '94',
                label: '韶关'
              },
              {
                value: '109',
                label: '阳江'
              },
              {
                value: '110',
                label: '湛江'
              },
              {
                value: '111',
                label: '云浮'
              },
              {
                value: '112',
                label: '中山'
              },
              {
                value: '113',
                label: '珠海'
              },
              {
                value: '114',
                label: '肇庆'
              },
              {
                value: '115',
                label: '河源'
              },
              {
                value: '116',
                label: '东莞'
              },
              {
                value: '117',
                label: '惠州'
              }
            ]
          },
          {
            value: '12',
            label: '广西',
            children: [
              {
                value: '95',
                label: '桂林'
              },
              {
                value: '96',
                label: '贵港'
              },
              {
                value: '98',
                label: '防城港'
              },
              {
                value: '99',
                label: '南宁'
              },
              {
                value: '100',
                label: '来宾'
              },
              {
                value: '101',
                label: '柳州'
              },
              {
                value: '102',
                label: '钦州'
              },
              {
                value: '103',
                label: '梧州'
              },
              {
                value: '104',
                label: '北海'
              },
              {
                value: '105',
                label: '玉林'
              },
              {
                value: '106',
                label: '河池'
              },
              {
                value: '107',
                label: '贺州'
              },
              {
                value: '108',
                label: '百色'
              },
              {
                value: '478',
                label: '崇左'
              }
            ]
          },
          {
            value: '8',
            label: '海南',
            children: [
              {
                value: '296',
                label: '东方'
              },
              {
                value: '297',
                label: '琼海'
              },
              {
                value: '298',
                label: '三亚'
              },
              {
                value: '299',
                label: '文昌'
              },
              {
                value: '300',
                label: '五指山'
              },
              {
                value: '301',
                label: '万宁'
              },
              {
                value: '302',
                label: '海口'
              },
              {
                value: '303',
                label: '儋州'
              },
              {
                value: '484',
                label: '定安县'
              },
              {
                value: '485',
                label: '屯昌县'
              },
              {
                value: '486',
                label: '陵水黎族自治县'
              },
              {
                value: '487',
                label: '澄迈县'
              },
              {
                value: '488',
                label: '保亭黎族苗族自治县'
              },
              {
                value: '489',
                label: '琼中黎族苗族自治县'
              },
              {
                value: '490',
                label: '乐东黎族自治县'
              },
              {
                value: '491',
                label: '临高县'
              },
              {
                value: '492',
                label: '昌江黎族自治县'
              },
              {
                value: '493',
                label: '白沙黎族自治县'
              }
            ]
          }
        ]
      },
      {
        value: '1005',
        label: '西南地区',
        children: [
          {
            value: '33',
            label: '重庆',
            children: [
              {
                value: '433',
                label: '渝中'
              },
              {
                value: '434',
                label: '大渡口'
              },
              {
                value: '435',
                label: '江北'
              },
              {
                value: '436',
                label: '沙坪坝'
              },
              {
                value: '437',
                label: '九龙坡'
              },
              {
                value: '438',
                label: '南岸'
              },
              {
                value: '439',
                label: '北碚'
              },
              {
                value: '440',
                label: '万盛'
              },
              {
                value: '441',
                label: '双桥'
              },
              {
                value: '442',
                label: '渝北'
              },
              {
                value: '443',
                label: '巴南'
              },
              {
                value: '444',
                label: '万州'
              },
              {
                value: '445',
                label: '涪陵'
              },
              {
                value: '446',
                label: '黔江'
              },
              {
                value: '447',
                label: '长寿'
              },
              {
                value: '448',
                label: '江津'
              },
              {
                value: '449',
                label: '合川'
              },
              {
                value: '450',
                label: '永川'
              },
              {
                value: '451',
                label: '南川'
              },
              {
                value: '452',
                label: '綦江'
              },
              {
                value: '453',
                label: '潼南'
              },
              {
                value: '454',
                label: '铜梁'
              },
              {
                value: '455',
                label: '大足'
              },
              {
                value: '456',
                label: '荣昌'
              },
              {
                value: '457',
                label: '璧山'
              },
              {
                value: '458',
                label: '梁平'
              },
              {
                value: '459',
                label: '城口'
              },
              {
                value: '460',
                label: '丰都'
              },
              {
                value: '461',
                label: '垫江'
              },
              {
                value: '462',
                label: '武隆'
              },
              {
                value: '463',
                label: '忠县'
              },
              {
                value: '464',
                label: '开县'
              },
              {
                value: '465',
                label: '云阳'
              },
              {
                value: '466',
                label: '奉节'
              },
              {
                value: '467',
                label: '巫山'
              },
              {
                value: '468',
                label: '巫溪'
              },
              {
                value: '469',
                label: '石柱'
              },
              {
                value: '470',
                label: '秀山'
              },
              {
                value: '471',
                label: '酉阳'
              },
              {
                value: '472',
                label: '彭水'
              }
            ]
          },
          {
            value: '10',
            label: '贵州',
            children: [
              {
                value: '118',
                label: '贵阳'
              },
              {
                value: '119',
                label: '安顺'
              },
              {
                value: '120',
                label: '六盘水'
              },
              {
                value: '121',
                label: '黔南'
              },
              {
                value: '122',
                label: '黔东南'
              },
              {
                value: '123',
                label: '黔西南'
              },
              {
                value: '124',
                label: '毕节'
              },
              {
                value: '125',
                label: '铜仁'
              },
              {
                value: '126',
                label: '遵义'
              }
            ]
          },
          {
            value: '28',
            label: '四川',
            children: [
              {
                value: '224',
                label: '广安'
              },
              {
                value: '225',
                label: '广元'
              },
              {
                value: '226',
                label: '成都'
              },
              {
                value: '227',
                label: '眉山'
              },
              {
                value: '228',
                label: '凉山'
              },
              {
                value: '229',
                label: '绵阳'
              },
              {
                value: '230',
                label: '攀枝花'
              },
              {
                value: '231',
                label: '南充'
              },
              {
                value: '232',
                label: '德阳'
              },
              {
                value: '233',
                label: '乐山'
              },
              {
                value: '234',
                label: '泸州'
              },
              {
                value: '235',
                label: '内江'
              },
              {
                value: '236',
                label: '甘孜'
              },
              {
                value: '237',
                label: '遂宁'
              },
              {
                value: '238',
                label: '资阳'
              },
              {
                value: '247',
                label: '巴中'
              },
              {
                value: '250',
                label: '达州'
              },
              {
                value: '251',
                label: '雅安'
              },
              {
                value: '252',
                label: '阿坝'
              },
              {
                value: '253',
                label: '自贡'
              },
              {
                value: '254',
                label: '宜宾'
              }
            ]
          },
          {
            value: '29',
            label: '西藏',
            children: [
              {
                value: '268',
                label: '那曲'
              },
              {
                value: '269',
                label: '拉萨'
              },
              {
                value: '270',
                label: '林芝'
              },
              {
                value: '271',
                label: '日喀则'
              },
              {
                value: '480',
                label: '昌都'
              },
              {
                value: '497',
                label: '山南'
              },
              {
                value: '498',
                label: '阿里'
              }
            ]
          },
          {
            value: '31',
            label: '云南',
            children: [
              {
                value: '283',
                label: '楚雄'
              },
              {
                value: '284',
                label: '昆明'
              },
              {
                value: '285',
                label: '丽江'
              },
              {
                value: '286',
                label: '德宏'
              },
              {
                value: '287',
                label: '临沧'
              },
              {
                value: '288',
                label: '曲靖'
              },
              {
                value: '289',
                label: '保山'
              },
              {
                value: '290',
                label: '普洱'
              },
              {
                value: '291',
                label: '文山'
              },
              {
                value: '292',
                label: '大理'
              },
              {
                value: '293',
                label: '红河'
              },
              {
                value: '294',
                label: '昭通'
              },
              {
                value: '295',
                label: '玉溪'
              },
              {
                value: '481',
                label: '怒江'
              },
              {
                value: '482',
                label: '迪庆'
              },
              {
                value: '483',
                label: '西双版纳'
              }
            ]
          }
        ]
      },
      {
        value: '1006',
        label: '西北地区',
        children: [
          {
            value: '11',
            label: '甘肃',
            children: [
              {
                value: '255',
                label: '酒泉'
              },
              {
                value: '256',
                label: '金昌'
              },
              {
                value: '257',
                label: '嘉峪关'
              },
              {
                value: '258',
                label: '兰州'
              },
              {
                value: '259',
                label: '陇南'
              },
              {
                value: '260',
                label: '平凉'
              },
              {
                value: '261',
                label: '临夏'
              },
              {
                value: '262',
                label: '庆阳'
              },
              {
                value: '263',
                label: '定西'
              },
              {
                value: '264',
                label: '武威'
              },
              {
                value: '265',
                label: '天水'
              },
              {
                value: '266',
                label: '张掖'
              },
              {
                value: '267',
                label: '白银'
              },
              {
                value: '477',
                label: '甘南'
              }
            ]
          },
          {
            value: '23',
            label: '宁夏',
            children: [
              {
                value: '170',
                label: '固原'
              },
              {
                value: '171',
                label: '石嘴山'
              },
              {
                value: '172',
                label: '吴忠'
              },
              {
                value: '173',
                label: '中卫'
              },
              {
                value: '174',
                label: '银川'
              }
            ]
          },
          {
            value: '24',
            label: '青海',
            children: [
              {
                value: '175',
                label: '西宁'
              },
              {
                value: '176',
                label: '海东'
              },
              {
                value: '177',
                label: '海西'
              },
              {
                value: '178',
                label: '玉树'
              },
              {
                value: '479',
                label: '海南'
              },
              {
                value: '494',
                label: '海北'
              },
              {
                value: '495',
                label: '黄南'
              },
              {
                value: '496',
                label: '果洛'
              }
            ]
          },
          {
            value: '27',
            label: '陕西',
            children: [
              {
                value: '239',
                label: '宝鸡'
              },
              {
                value: '240',
                label: '安康'
              },
              {
                value: '241',
                label: '商洛'
              },
              {
                value: '242',
                label: '铜川'
              },
              {
                value: '243',
                label: '渭南'
              },
              {
                value: '244',
                label: '西安'
              },
              {
                value: '245',
                label: '咸阳'
              },
              {
                value: '246',
                label: '延安'
              },
              {
                value: '248',
                label: '汉中'
              },
              {
                value: '249',
                label: '榆林'
              }
            ]
          },
          {
            value: '30',
            label: '新疆',
            children: [
              {
                value: '179',
                label: '哈密'
              },
              {
                value: '180',
                label: '博尔塔拉'
              },
              {
                value: '181',
                label: '昌吉'
              },
              {
                value: '182',
                label: '阿勒泰'
              },
              {
                value: '183',
                label: '喀什'
              },
              {
                value: '184',
                label: '克拉玛依'
              },
              {
                value: '185',
                label: '阿克苏'
              },
              {
                value: '186',
                label: '克孜勒苏柯尔克孜'
              },
              {
                value: '187',
                label: '石河子'
              },
              {
                value: '188',
                label: '塔城'
              },
              {
                value: '189',
                label: '五家渠'
              },
              {
                value: '190',
                label: '吐鲁番'
              },
              {
                value: '191',
                label: '巴音郭楞'
              },
              {
                value: '192',
                label: '乌鲁木齐'
              },
              {
                value: '193',
                label: '伊犁'
              },
              {
                value: '195',
                label: '和田'
              },
              {
                value: '499',
                label: '阿拉尔'
              },
              {
                value: '500',
                label: '图木舒克'
              }
            ]
          }
        ]
      },
      {
        value: '1007',
        label: '港澳台',
        children: [
          {
            value: '34',
            label: '香港'
          },
          {
            value: '35',
            label: '台湾'
          },
          {
            value: '36',
            label: '澳门'
          }
        ]
      }
    ]
  },
  {
    value: '7',
    label: '日本'
  },
  {
    value: '37',
    label: '其他国家'
  }
]

const REGIONS_CLB = [
  {
    value: '90',
    label: '中国',
    children: [
      {
        value: '80',
        label: '华北地区',
        children: [
          {
            value: '1',
            label: '北京',
            children: [
              {
                value: '742',
                label: '昌平区'
              },
              {
                value: '743',
                label: '朝阳区'
              },
              {
                value: '744',
                label: '崇文区'
              },
              {
                value: '745',
                label: '大兴区'
              },
              {
                value: '746',
                label: '东城区'
              },
              {
                value: '747',
                label: '房山区'
              },
              {
                value: '748',
                label: '丰台区'
              },
              {
                value: '749',
                label: '海淀区'
              },
              {
                value: '750',
                label: '怀柔区'
              },
              {
                value: '751',
                label: '门头沟区'
              },
              {
                value: '752',
                label: '密云县'
              },
              {
                value: '753',
                label: '平谷区'
              },
              {
                value: '754',
                label: '石景山区'
              },
              {
                value: '755',
                label: '顺义区'
              },
              {
                value: '756',
                label: '通州区'
              },
              {
                value: '757',
                label: '西城区'
              },
              {
                value: '758',
                label: '宣武区'
              },
              {
                value: '759',
                label: '延庆县'
              }
            ]
          },
          {
            value: '3',
            label: '天津',
            children: [
              {
                value: '760',
                label: '宝坻区'
              },
              {
                value: '761',
                label: '北辰区'
              },
              {
                value: '763',
                label: '东丽区'
              },
              {
                value: '765',
                label: '河北区'
              },
              {
                value: '766',
                label: '河东区'
              },
              {
                value: '767',
                label: '和平区'
              },
              {
                value: '768',
                label: '河西区'
              },
              {
                value: '769',
                label: '红桥区'
              },
              {
                value: '770',
                label: '蓟县'
              },
              {
                value: '771',
                label: '津南区'
              },
              {
                value: '772',
                label: '静海县'
              },
              {
                value: '773',
                label: '南开区'
              },
              {
                value: '774',
                label: '宁河县'
              },
              {
                value: '776',
                label: '武清区'
              },
              {
                value: '777',
                label: '西青区'
              },
              {
                value: '900',
                label: '滨海新区'
              }
            ]
          },
          {
            value: '15',
            label: '河北',
            children: [
              {
                value: '226',
                label: '保定市'
              },
              {
                value: '228',
                label: '沧州市'
              },
              {
                value: '229',
                label: '承德市'
              },
              {
                value: '230',
                label: '邯郸市'
              },
              {
                value: '231',
                label: '衡水市'
              },
              {
                value: '234',
                label: '廊坊市'
              },
              {
                value: '236',
                label: '秦皇岛市'
              },
              {
                value: '239',
                label: '石家庄市'
              },
              {
                value: '240',
                label: '唐山市'
              },
              {
                value: '241',
                label: '邢台市'
              },
              {
                value: '242',
                label: '张家口市'
              }
            ]
          },
          {
            value: '24',
            label: '内蒙古',
            children: [
              {
                value: '428',
                label: '阿拉善盟'
              },
              {
                value: '429',
                label: '巴彦淖尔市'
              },
              {
                value: '430',
                label: '包头市'
              },
              {
                value: '431',
                label: '赤峰市'
              },
              {
                value: '432',
                label: '鄂尔多斯市'
              },
              {
                value: '434',
                label: '呼和浩特市'
              },
              {
                value: '435',
                label: '呼伦贝尔市'
              },
              {
                value: '437',
                label: '通辽市'
              },
              {
                value: '438',
                label: '乌海市'
              },
              {
                value: '439',
                label: '乌兰察布市'
              },
              {
                value: '442',
                label: '锡林郭勒盟'
              },
              {
                value: '444',
                label: '兴安盟'
              }
            ]
          },
          {
            value: '28',
            label: '山西',
            children: [
              {
                value: '486',
                label: '大同市'
              },
              {
                value: '491',
                label: '晋城市'
              },
              {
                value: '492',
                label: '晋中市'
              },
              {
                value: '493',
                label: '临汾市'
              },
              {
                value: '494',
                label: '吕梁市'
              },
              {
                value: '495',
                label: '朔州市'
              },
              {
                value: '496',
                label: '太原市'
              },
              {
                value: '497',
                label: '忻州市'
              },
              {
                value: '498',
                label: '阳泉市'
              },
              {
                value: '501',
                label: '运城市'
              },
              {
                value: '502',
                label: '长治市'
              }
            ]
          }
        ]
      },
      {
        value: '81',
        label: '东北地区',
        children: [
          {
            value: '17',
            label: '黑龙江',
            children: [
              {
                value: '272',
                label: '大庆市'
              },
              {
                value: '273',
                label: '大兴安岭地区'
              },
              {
                value: '276',
                label: '哈尔滨市'
              },
              {
                value: '278',
                label: '鹤岗市'
              },
              {
                value: '279',
                label: '黑河市'
              },
              {
                value: '282',
                label: '鸡西市'
              },
              {
                value: '284',
                label: '佳木斯市'
              },
              {
                value: '287',
                label: '牡丹江市'
              },
              {
                value: '289',
                label: '七台河市'
              },
              {
                value: '290',
                label: '齐齐哈尔市'
              },
              {
                value: '291',
                label: '双鸭山市'
              },
              {
                value: '293',
                label: '绥化市'
              },
              {
                value: '298',
                label: '伊春市'
              }
            ]
          },
          {
            value: '20',
            label: '吉林',
            children: [
              {
                value: '345',
                label: '白城市'
              },
              {
                value: '346',
                label: '白山市'
              },
              {
                value: '351',
                label: '吉林市'
              },
              {
                value: '352',
                label: '辽源市'
              },
              {
                value: '355',
                label: '四平市'
              },
              {
                value: '356',
                label: '松原市'
              },
              {
                value: '358',
                label: '通化市'
              },
              {
                value: '359',
                label: '延边朝鲜族自治州'
              },
              {
                value: '361',
                label: '长春市'
              }
            ]
          },
          {
            value: '23',
            label: '辽宁',
            children: [
              {
                value: '413',
                label: '鞍山市'
              },
              {
                value: '414',
                label: '本溪市'
              },
              {
                value: '415',
                label: '朝阳市'
              },
              {
                value: '416',
                label: '大连市'
              },
              {
                value: '417',
                label: '丹东市'
              },
              {
                value: '418',
                label: '抚顺市'
              },
              {
                value: '419',
                label: '阜新市'
              },
              {
                value: '421',
                label: '葫芦岛市'
              },
              {
                value: '422',
                label: '锦州市'
              },
              {
                value: '423',
                label: '辽阳市'
              },
              {
                value: '424',
                label: '盘锦市'
              },
              {
                value: '425',
                label: '沈阳市'
              },
              {
                value: '426',
                label: '铁岭市'
              },
              {
                value: '427',
                label: '营口市'
              }
            ]
          }
        ]
      },
      {
        value: '82',
        label: '华东地区',
        children: [
          {
            value: '2',
            label: '上海',
            children: [
              {
                value: '818',
                label: '宝山区'
              },
              {
                value: '819',
                label: '崇明县'
              },
              {
                value: '820',
                label: '奉贤区'
              },
              {
                value: '821',
                label: '虹口区'
              },
              {
                value: '822',
                label: '黄浦区'
              },
              {
                value: '823',
                label: '嘉定区'
              },
              {
                value: '824',
                label: '金山区'
              },
              {
                value: '825',
                label: '静安区'
              },
              {
                value: '826',
                label: '卢湾区'
              },
              {
                value: '827',
                label: '闵行区'
              },
              {
                value: '830',
                label: '浦东新区'
              },
              {
                value: '831',
                label: '普陀区'
              },
              {
                value: '832',
                label: '青浦区'
              },
              {
                value: '833',
                label: '松江区'
              },
              {
                value: '834',
                label: '徐汇区'
              },
              {
                value: '835',
                label: '杨浦区'
              },
              {
                value: '836',
                label: '闸北区'
              },
              {
                value: '837',
                label: '长宁区'
              }
            ]
          },
          {
            value: '8',
            label: '安徽',
            children: [
              {
                value: '101',
                label: '安庆市'
              },
              {
                value: '102',
                label: '蚌埠市'
              },
              {
                value: '103',
                label: '亳州市'
              },
              {
                value: '104',
                label: '巢湖市'
              },
              {
                value: '105',
                label: '池州市'
              },
              {
                value: '106',
                label: '滁州市'
              },
              {
                value: '107',
                label: '阜阳市'
              },
              {
                value: '110',
                label: '合肥市'
              },
              {
                value: '111',
                label: '淮北市'
              },
              {
                value: '112',
                label: '淮南市'
              },
              {
                value: '113',
                label: '黄山市'
              },
              {
                value: '115',
                label: '六安市'
              },
              {
                value: '116',
                label: '马鞍山市'
              },
              {
                value: '118',
                label: '铜陵市'
              },
              {
                value: '119',
                label: '芜湖市'
              },
              {
                value: '120',
                label: '宿州市'
              },
              {
                value: '121',
                label: '宣城市'
              }
            ]
          },
          {
            value: '9',
            label: '福建',
            children: [
              {
                value: '124',
                label: '福州市'
              },
              {
                value: '126',
                label: '龙岩市'
              },
              {
                value: '127',
                label: '南平市'
              },
              {
                value: '128',
                label: '宁德市'
              },
              {
                value: '129',
                label: '莆田市'
              },
              {
                value: '130',
                label: '泉州市'
              },
              {
                value: '131',
                label: '三明市'
              },
              {
                value: '132',
                label: '厦门市'
              },
              {
                value: '138',
                label: '漳州市'
              }
            ]
          },
          {
            value: '21',
            label: '江苏',
            children: [
              {
                value: '363',
                label: '常州市'
              },
              {
                value: '367',
                label: '淮安市'
              },
              {
                value: '375',
                label: '连云港市'
              },
              {
                value: '376',
                label: '南京市'
              },
              {
                value: '377',
                label: '南通市'
              },
              {
                value: '381',
                label: '苏州市'
              },
              {
                value: '383',
                label: '泰州市'
              },
              {
                value: '386',
                label: '无锡市'
              },
              {
                value: '391',
                label: '宿迁市'
              },
              {
                value: '392',
                label: '徐州市'
              },
              {
                value: '393',
                label: '盐城市'
              },
              {
                value: '395',
                label: '扬州市'
              },
              {
                value: '399',
                label: '镇江市'
              }
            ]
          },
          {
            value: '22',
            label: '江西',
            children: [
              {
                value: '401',
                label: '抚州市'
              },
              {
                value: '402',
                label: '赣州市'
              },
              {
                value: '403',
                label: '吉安市'
              },
              {
                value: '404',
                label: '景德镇市'
              },
              {
                value: '406',
                label: '九江市'
              },
              {
                value: '407',
                label: '南昌市'
              },
              {
                value: '408',
                label: '萍乡市'
              },
              {
                value: '409',
                label: '上饶市'
              },
              {
                value: '410',
                label: '新余市'
              },
              {
                value: '411',
                label: '宜春市'
              },
              {
                value: '412',
                label: '鹰潭市'
              }
            ]
          },
          {
            value: '27',
            label: '山东',
            children: [
              {
                value: '461',
                label: '滨州市'
              },
              {
                value: '462',
                label: '德州市'
              },
              {
                value: '463',
                label: '东营市'
              },
              {
                value: '466',
                label: '菏泽市'
              },
              {
                value: '467',
                label: '济南市'
              },
              {
                value: '468',
                label: '济宁市'
              },
              {
                value: '470',
                label: '莱芜市'
              },
              {
                value: '472',
                label: '聊城市'
              },
              {
                value: '473',
                label: '临沂市'
              },
              {
                value: '474',
                label: '青岛市'
              },
              {
                value: '476',
                label: '日照市'
              },
              {
                value: '477',
                label: '泰安市'
              },
              {
                value: '479',
                label: '威海市'
              },
              {
                value: '480',
                label: '潍坊市'
              },
              {
                value: '481',
                label: '烟台市'
              },
              {
                value: '482',
                label: '枣庄市'
              },
              {
                value: '485',
                label: '淄博市'
              }
            ]
          },
          {
            value: '34',
            label: '浙江',
            children: [
              {
                value: '604',
                label: '杭州市'
              },
              {
                value: '605',
                label: '湖州市'
              },
              {
                value: '606',
                label: '嘉兴市'
              },
              {
                value: '608',
                label: '金华市'
              },
              {
                value: '611',
                label: '丽水市'
              },
              {
                value: '615',
                label: '宁波市'
              },
              {
                value: '617',
                label: '衢州市'
              },
              {
                value: '619',
                label: '绍兴市'
              },
              {
                value: '621',
                label: '台州市'
              },
              {
                value: '624',
                label: '温州市'
              },
              {
                value: '630',
                label: '舟山市'
              }
            ]
          }
        ]
      },
      {
        value: '83',
        label: '华中地区',
        children: [
          {
            value: '16',
            label: '河南',
            children: [
              {
                value: '243',
                label: '安阳市'
              },
              {
                value: '246',
                label: '鹤壁市'
              },
              {
                value: '249',
                label: '焦作市'
              },
              {
                value: '250',
                label: '开封市'
              },
              {
                value: '252',
                label: '漯河市'
              },
              {
                value: '253',
                label: '洛阳市'
              },
              {
                value: '254',
                label: '南阳市'
              },
              {
                value: '255',
                label: '平顶山市'
              },
              {
                value: '256',
                label: '濮阳市'
              },
              {
                value: '257',
                label: '三门峡市'
              },
              {
                value: '258',
                label: '商丘市'
              },
              {
                value: '261',
                label: '新乡市'
              },
              {
                value: '262',
                label: '信阳市'
              },
              {
                value: '263',
                label: '许昌市'
              },
              {
                value: '266',
                label: '郑州市'
              },
              {
                value: '267',
                label: '周口市'
              },
              {
                value: '268',
                label: '驻马店市'
              },
              {
                value: '901',
                label: '济源市'
              }
            ]
          },
          {
            value: '18',
            label: '湖北',
            children: [
              {
                value: '304',
                label: '鄂州市'
              },
              {
                value: '305',
                label: '恩施市'
              },
              {
                value: '307',
                label: '黄冈市'
              },
              {
                value: '308',
                label: '黄石市'
              },
              {
                value: '309',
                label: '荆门市'
              },
              {
                value: '310',
                label: '荆州市'
              },
              {
                value: '311',
                label: '潜江市'
              },
              {
                value: '312',
                label: '神农架林区'
              },
              {
                value: '313',
                label: '十堰市'
              },
              {
                value: '314',
                label: '随州市'
              },
              {
                value: '315',
                label: '天门市'
              },
              {
                value: '317',
                label: '武汉'
              },
              {
                value: '319',
                label: '仙桃市'
              },
              {
                value: '320',
                label: '咸宁市'
              },
              {
                value: '321',
                label: '襄樊市'
              },
              {
                value: '323',
                label: '孝感市'
              },
              {
                value: '324',
                label: '宜昌市'
              }
            ]
          },
          {
            value: '19',
            label: '湖南',
            children: [
              {
                value: '328',
                label: '常德市'
              },
              {
                value: '329',
                label: '郴州市'
              },
              {
                value: '330',
                label: '衡阳市'
              },
              {
                value: '331',
                label: '怀化市'
              },
              {
                value: '334',
                label: '娄底市'
              },
              {
                value: '335',
                label: '邵阳市'
              },
              {
                value: '337',
                label: '湘潭市'
              },
              {
                value: '338',
                label: '湘西土家族苗族自治州'
              },
              {
                value: '339',
                label: '益阳市'
              },
              {
                value: '340',
                label: '永州市'
              },
              {
                value: '341',
                label: '岳阳市'
              },
              {
                value: '342',
                label: '张家界市'
              },
              {
                value: '343',
                label: '长沙市'
              },
              {
                value: '344',
                label: '株洲市'
              }
            ]
          }
        ]
      },
      {
        value: '84',
        label: '华南地区',
        children: [
          {
            value: '11',
            label: '广东',
            children: [
              {
                value: '157',
                label: '潮州市'
              },
              {
                value: '158',
                label: '东莞市'
              },
              {
                value: '160',
                label: '佛山市'
              },
              {
                value: '162',
                label: '广州市'
              },
              {
                value: '163',
                label: '河源市'
              },
              {
                value: '164',
                label: '惠州市'
              },
              {
                value: '166',
                label: '江门市'
              },
              {
                value: '167',
                label: '揭阳市'
              },
              {
                value: '169',
                label: '茂名市'
              },
              {
                value: '170',
                label: '梅州市'
              },
              {
                value: '172',
                label: '清远市'
              },
              {
                value: '173',
                label: '汕头市'
              },
              {
                value: '174',
                label: '汕尾市'
              },
              {
                value: '175',
                label: '韶关市'
              },
              {
                value: '176',
                label: '深圳市'
              },
              {
                value: '180',
                label: '阳江市'
              },
              {
                value: '182',
                label: '云浮市'
              },
              {
                value: '184',
                label: '湛江市'
              },
              {
                value: '185',
                label: '肇庆市'
              },
              {
                value: '186',
                label: '中山市'
              },
              {
                value: '187',
                label: '珠海市'
              }
            ]
          },
          {
            value: '12',
            label: '广西',
            children: [
              {
                value: '188',
                label: '百色市'
              },
              {
                value: '189',
                label: '北海市'
              },
              {
                value: '191',
                label: '防城港市'
              },
              {
                value: '193',
                label: '贵港市'
              },
              {
                value: '194',
                label: '桂林市'
              },
              {
                value: '195',
                label: '河池市'
              },
              {
                value: '196',
                label: '贺州市'
              },
              {
                value: '197',
                label: '来宾市'
              },
              {
                value: '198',
                label: '柳州市'
              },
              {
                value: '199',
                label: '南宁市'
              },
              {
                value: '200',
                label: '钦州市'
              },
              {
                value: '201',
                label: '梧州市'
              },
              {
                value: '203',
                label: '玉林市'
              }
            ]
          },
          {
            value: '14',
            label: '海南',
            children: [
              {
                value: '218',
                label: '儋州市'
              },
              {
                value: '219',
                label: '东方市'
              },
              {
                value: '220',
                label: '海口市'
              },
              {
                value: '221',
                label: '琼海市'
              },
              {
                value: '223',
                label: '三亚市'
              },
              {
                value: '225',
                label: '文昌市'
              },
              {
                value: '867',
                label: '五指山'
              },
              {
                value: '868',
                label: '万宁'
              }
            ]
          }
        ]
      },
      {
        value: '85',
        label: '西南地区',
        children: [
          {
            value: '4',
            label: '重庆',
            children: [
              {
                value: '778',
                label: '巴南区'
              },
              {
                value: '779',
                label: '北碚区'
              },
              {
                value: '780',
                label: '璧山县'
              },
              {
                value: '781',
                label: '城口县'
              },
              {
                value: '782',
                label: '大渡口区'
              },
              {
                value: '783',
                label: '大足县'
              },
              {
                value: '784',
                label: '垫江县'
              },
              {
                value: '785',
                label: '丰都县'
              },
              {
                value: '786',
                label: '奉节县'
              },
              {
                value: '787',
                label: '涪陵区'
              },
              {
                value: '788',
                label: '合川区'
              },
              {
                value: '789',
                label: '江北区'
              },
              {
                value: '790',
                label: '江津区'
              },
              {
                value: '791',
                label: '九龙坡区'
              },
              {
                value: '792',
                label: '开县'
              },
              {
                value: '793',
                label: '梁平县'
              },
              {
                value: '794',
                label: '南岸区'
              },
              {
                value: '795',
                label: '南川区'
              },
              {
                value: '796',
                label: '彭水县'
              },
              {
                value: '797',
                label: '綦江县'
              },
              {
                value: '798',
                label: '黔江区'
              },
              {
                value: '799',
                label: '荣昌县'
              },
              {
                value: '800',
                label: '沙坪坝区'
              },
              {
                value: '801',
                label: '石柱县'
              },
              {
                value: '802',
                label: '双桥区'
              },
              {
                value: '803',
                label: '铜梁县'
              },
              {
                value: '804',
                label: '潼南县'
              },
              {
                value: '805',
                label: '万盛区'
              },
              {
                value: '806',
                label: '万州区'
              },
              {
                value: '807',
                label: '巫山县'
              },
              {
                value: '808',
                label: '巫溪县'
              },
              {
                value: '809',
                label: '武隆县'
              },
              {
                value: '810',
                label: '秀山县'
              },
              {
                value: '811',
                label: '永川区'
              },
              {
                value: '812',
                label: '酉阳县'
              },
              {
                value: '813',
                label: '渝北区'
              },
              {
                value: '814',
                label: '渝中区'
              },
              {
                value: '815',
                label: '云阳县'
              },
              {
                value: '816',
                label: '长寿区'
              },
              {
                value: '817',
                label: '忠县'
              }
            ]
          },
          {
            value: '13',
            label: '贵州',
            children: [
              {
                value: '204',
                label: '安顺市'
              },
              {
                value: '205',
                label: '毕节市'
              },
              {
                value: '208',
                label: '贵阳市'
              },
              {
                value: '210',
                label: '六盘水市'
              },
              {
                value: '211',
                label: '黔东南苗族侗族自治州'
              },
              {
                value: '212',
                label: '黔南布依族苗族自治州'
              },
              {
                value: '213',
                label: '黔西南布依族苗族自治州'
              },
              {
                value: '215',
                label: '铜仁市'
              },
              {
                value: '217',
                label: '遵义市'
              }
            ]
          },
          {
            value: '30',
            label: '四川',
            children: [
              {
                value: '516',
                label: '阿坝藏族羌族自治州'
              },
              {
                value: '517',
                label: '巴中市'
              },
              {
                value: '518',
                label: '成都市'
              },
              {
                value: '519',
                label: '达州市'
              },
              {
                value: '520',
                label: '德阳市'
              },
              {
                value: '523',
                label: '甘孜藏族自治州'
              },
              {
                value: '524',
                label: '广安市'
              },
              {
                value: '526',
                label: '广元市'
              },
              {
                value: '528',
                label: '乐山市'
              },
              {
                value: '529',
                label: '凉山彝族自治州'
              },
              {
                value: '530',
                label: '泸州市'
              },
              {
                value: '531',
                label: '眉山市'
              },
              {
                value: '532',
                label: '绵阳市'
              },
              {
                value: '534',
                label: '南充市'
              },
              {
                value: '535',
                label: '内江市'
              },
              {
                value: '536',
                label: '攀枝花市'
              },
              {
                value: '538',
                label: '遂宁市'
              },
              {
                value: '540',
                label: '雅安市'
              },
              {
                value: '541',
                label: '宜宾市'
              },
              {
                value: '542',
                label: '资阳市'
              },
              {
                value: '543',
                label: '自贡市'
              }
            ]
          },
          {
            value: '31',
            label: '西藏',
            children: [
              {
                value: '546',
                label: '拉萨市'
              },
              {
                value: '547',
                label: '林芝地区'
              },
              {
                value: '548',
                label: '那曲地区'
              },
              {
                value: '549',
                label: '日喀则地区'
              }
            ]
          },
          {
            value: '33',
            label: '云南',
            children: [
              {
                value: '578',
                label: '保山市'
              },
              {
                value: '579',
                label: '楚雄市'
              },
              {
                value: '580',
                label: '大理市'
              },
              {
                value: '581',
                label: '德宏傣族景颇族自治州'
              },
              {
                value: '585',
                label: '红河哈尼族彝族自治州'
              },
              {
                value: '587',
                label: '昆明市'
              },
              {
                value: '589',
                label: '丽江市'
              },
              {
                value: '590',
                label: '临沧市'
              },
              {
                value: '593',
                label: '普洱市'
              },
              {
                value: '594',
                label: '曲靖市'
              },
              {
                value: '595',
                label: '文山市'
              },
              {
                value: '597',
                label: '玉溪市'
              },
              {
                value: '598',
                label: '昭通市'
              }
            ]
          }
        ]
      },
      {
        value: '86',
        label: '西北地区',
        children: [
          {
            value: '10',
            label: '甘肃',
            children: [
              {
                value: '139',
                label: '白银市'
              },
              {
                value: '140',
                label: '定西市'
              },
              {
                value: '144',
                label: '嘉峪关市'
              },
              {
                value: '145',
                label: '金昌市'
              },
              {
                value: '146',
                label: '酒泉市'
              },
              {
                value: '147',
                label: '兰州市'
              },
              {
                value: '148',
                label: '临夏回族自治州'
              },
              {
                value: '150',
                label: '陇南市'
              },
              {
                value: '151',
                label: '平凉市'
              },
              {
                value: '152',
                label: '庆阳市'
              },
              {
                value: '153',
                label: '天水市'
              },
              {
                value: '154',
                label: '武威市'
              },
              {
                value: '156',
                label: '张掖市'
              }
            ]
          },
          {
            value: '25',
            label: '宁夏',
            children: [
              {
                value: '446',
                label: '固原市'
              },
              {
                value: '447',
                label: '石嘴山市'
              },
              {
                value: '448',
                label: '吴忠市'
              },
              {
                value: '449',
                label: '银川市'
              },
              {
                value: '450',
                label: '中卫市'
              }
            ]
          },
          {
            value: '26',
            label: '青海',
            children: [
              {
                value: '454',
                label: '海东地区'
              },
              {
                value: '456',
                label: '海西蒙古族藏族自治州'
              },
              {
                value: '458',
                label: '西宁市'
              },
              {
                value: '459',
                label: '玉树藏族自治州'
              }
            ]
          },
          {
            value: '29',
            label: '陕西',
            children: [
              {
                value: '503',
                label: '安康市'
              },
              {
                value: '504',
                label: '宝鸡市'
              },
              {
                value: '506',
                label: '汉中市'
              },
              {
                value: '508',
                label: '商洛市'
              },
              {
                value: '509',
                label: '铜川市'
              },
              {
                value: '510',
                label: '渭南市'
              },
              {
                value: '511',
                label: '西安市'
              },
              {
                value: '512',
                label: '咸阳市'
              },
              {
                value: '513',
                label: '延安市'
              },
              {
                value: '515',
                label: '榆林市'
              }
            ]
          },
          {
            value: '32',
            label: '新疆',
            children: [
              {
                value: '551',
                label: '阿克苏地区'
              },
              {
                value: '554',
                label: '阿勒泰市'
              },
              {
                value: '556',
                label: '巴音郭楞蒙古自治州'
              },
              {
                value: '557',
                label: '博尔塔拉蒙古自治州'
              },
              {
                value: '560',
                label: '昌吉回族自治州'
              },
              {
                value: '563',
                label: '哈密市'
              },
              {
                value: '564',
                label: '和田市'
              },
              {
                value: '565',
                label: '喀什市'
              },
              {
                value: '566',
                label: '克拉玛依市'
              },
              {
                value: '570',
                label: '石河子市'
              },
              {
                value: '571',
                label: '塔城市'
              },
              {
                value: '572',
                label: '吐鲁番市'
              },
              {
                value: '573',
                label: '乌鲁木齐市'
              },
              {
                value: '576',
                label: '伊犁市'
              },
              {
                value: '869',
                label: '克孜勒苏柯尔克孜'
              },
              {
                value: '870',
                label: '五家渠'
              }
            ]
          }
        ]
      },
      {
        value: '87',
        label: '港澳台',
        children: [
          {
            value: '5',
            label: '澳门'
          },
          {
            value: '6',
            label: '香港'
          },
          {
            value: '7',
            label: '台湾'
          }
        ]
      }
    ]
  },
  {
    value: '999',
    label: '国外'
  },
  {
    value: '0',
    label: '其他'
  }
]
</script>

<style lang="less" scoped>
section {
  margin-bottom: 10px;
}
</style>
