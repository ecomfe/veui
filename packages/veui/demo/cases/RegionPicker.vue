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
    id: '10000',
    label: '中国',
    children: [
      {
        id: '1000',
        label: '华北地区',
        children: [
          {
            id: '1',
            label: '北京',
            children: [
              {
                id: '378',
                label: '东城'
              },
              {
                id: '379',
                label: '西城'
              },
              {
                id: '380',
                label: '崇文'
              },
              {
                id: '381',
                label: '宣武'
              },
              {
                id: '382',
                label: '朝阳'
              },
              {
                id: '383',
                label: '丰台'
              },
              {
                id: '384',
                label: '石景山'
              },
              {
                id: '385',
                label: '海淀'
              },
              {
                id: '386',
                label: '门头沟'
              },
              {
                id: '387',
                label: '房山'
              },
              {
                id: '388',
                label: '通州'
              },
              {
                id: '389',
                label: '顺义'
              },
              {
                id: '390',
                label: '昌平'
              },
              {
                id: '391',
                label: '大兴'
              },
              {
                id: '392',
                label: '怀柔'
              },
              {
                id: '393',
                label: '平谷'
              },
              {
                id: '394',
                label: '密云'
              },
              {
                id: '395',
                label: '延庆'
              }
            ]
          },
          {
            id: '3',
            label: '天津',
            children: [
              {
                id: '415',
                label: '和平'
              },
              {
                id: '416',
                label: '河东'
              },
              {
                id: '417',
                label: '河西'
              },
              {
                id: '418',
                label: '南开'
              },
              {
                id: '419',
                label: '河北'
              },
              {
                id: '420',
                label: '红桥'
              },
              {
                id: '421',
                label: '塘沽'
              },
              {
                id: '422',
                label: '汉沽'
              },
              {
                id: '423',
                label: '大港'
              },
              {
                id: '424',
                label: '东丽'
              },
              {
                id: '425',
                label: '西青'
              },
              {
                id: '426',
                label: '津南'
              },
              {
                id: '427',
                label: '北辰'
              },
              {
                id: '428',
                label: '武清'
              },
              {
                id: '429',
                label: '宝坻'
              },
              {
                id: '430',
                label: '宁河'
              },
              {
                id: '431',
                label: '静海'
              },
              {
                id: '432',
                label: '蓟县'
              },
              {
                id: '475',
                label: '滨海'
              }
            ]
          },
          {
            id: '13',
            label: '河北',
            children: [
              {
                id: '304',
                label: '保定'
              },
              {
                id: '305',
                label: '沧州'
              },
              {
                id: '306',
                label: '承德'
              },
              {
                id: '307',
                label: '廊坊'
              },
              {
                id: '325',
                label: '秦皇岛'
              },
              {
                id: '326',
                label: '邢台'
              },
              {
                id: '327',
                label: '石家庄'
              },
              {
                id: '329',
                label: '唐山'
              },
              {
                id: '330',
                label: '邯郸'
              },
              {
                id: '331',
                label: '张家口'
              },
              {
                id: '332',
                label: '衡水'
              }
            ]
          },
          {
            id: '22',
            label: '内蒙古',
            children: [
              {
                id: '158',
                label: '赤峰'
              },
              {
                id: '159',
                label: '阿拉善盟'
              },
              {
                id: '160',
                label: '兴安盟'
              },
              {
                id: '161',
                label: '通辽'
              },
              {
                id: '162',
                label: '巴彦淖尔'
              },
              {
                id: '163',
                label: '乌兰察布'
              },
              {
                id: '164',
                label: '乌海'
              },
              {
                id: '165',
                label: '锡林郭勒盟'
              },
              {
                id: '166',
                label: '呼伦贝尔'
              },
              {
                id: '167',
                label: '呼和浩特'
              },
              {
                id: '168',
                label: '鄂尔多斯'
              },
              {
                id: '169',
                label: '包头'
              }
            ]
          },
          {
            id: '26',
            label: '山西',
            children: [
              {
                id: '205',
                label: '晋城'
              },
              {
                id: '206',
                label: '晋中'
              },
              {
                id: '209',
                label: '长治'
              },
              {
                id: '210',
                label: '吕梁'
              },
              {
                id: '211',
                label: '临汾'
              },
              {
                id: '212',
                label: '忻州'
              },
              {
                id: '213',
                label: '朔州'
              },
              {
                id: '214',
                label: '太原'
              },
              {
                id: '215',
                label: '阳泉'
              },
              {
                id: '216',
                label: '运城'
              },
              {
                id: '217',
                label: '大同'
              }
            ]
          }
        ]
      },
      {
        id: '1001',
        label: '东北地区',
        children: [
          {
            id: '15',
            label: '黑龙江',
            disabled: true,
            children: [
              {
                id: '333',
                label: '鸡西'
              },
              {
                id: '334',
                label: '佳木斯'
              },
              {
                id: '335',
                label: '哈尔滨'
              },
              {
                id: '336',
                label: '牡丹江'
              },
              {
                id: '337',
                label: '齐齐哈尔'
              },
              {
                id: '338',
                label: '七台河'
              },
              {
                id: '339',
                label: '绥化'
              },
              {
                id: '340',
                label: '双鸭山'
              },
              {
                id: '341',
                label: '伊春'
              },
              {
                id: '342',
                label: '大庆'
              },
              {
                id: '343',
                label: '大兴安岭'
              },
              {
                id: '344',
                label: '鹤岗'
              },
              {
                id: '345',
                label: '黑河'
              }
            ]
          },
          {
            id: '18',
            label: '吉林',
            children: [
              {
                id: '38',
                label: '吉林'
              },
              {
                id: '39',
                label: '白城'
              },
              {
                id: '40',
                label: '长春'
              },
              {
                id: '41',
                label: '辽源'
              },
              {
                id: '42',
                label: '白山'
              },
              {
                id: '43',
                label: '四平'
              },
              {
                id: '44',
                label: '松原'
              },
              {
                id: '45',
                label: '通化'
              },
              {
                id: '46',
                label: '延吉'
              },
              {
                id: '47',
                label: '延边'
              }
            ]
          },
          {
            id: '21',
            label: '辽宁',
            children: [
              {
                id: '144',
                label: '丹东',
                disabled: true
              },
              {
                id: '145',
                label: '本溪'
              },
              {
                id: '146',
                label: '锦州'
              },
              {
                id: '147',
                label: '朝阳'
              },
              {
                id: '148',
                label: '辽阳'
              },
              {
                id: '149',
                label: '盘锦'
              },
              {
                id: '150',
                label: '阜新'
              },
              {
                id: '151',
                label: '鞍山'
              },
              {
                id: '152',
                label: '抚顺'
              },
              {
                id: '153',
                label: '沈阳'
              },
              {
                id: '154',
                label: '铁岭'
              },
              {
                id: '155',
                label: '大连'
              },
              {
                id: '156',
                label: '营口'
              },
              {
                id: '157',
                label: '葫芦岛'
              }
            ]
          }
        ]
      },
      {
        id: '1002',
        label: '华东地区',
        children: [
          {
            id: '2',
            label: '上海',
            children: [
              {
                id: '396',
                label: '黄浦'
              },
              {
                id: '397',
                label: '卢湾'
              },
              {
                id: '398',
                label: '徐汇'
              },
              {
                id: '399',
                label: '长宁'
              },
              {
                id: '400',
                label: '静安'
              },
              {
                id: '401',
                label: '普陀'
              },
              {
                id: '402',
                label: '闸北'
              },
              {
                id: '403',
                label: '虹口'
              },
              {
                id: '404',
                label: '杨浦'
              },
              {
                id: '405',
                label: '闵行'
              },
              {
                id: '406',
                label: '宝山'
              },
              {
                id: '407',
                label: '嘉定'
              },
              {
                id: '408',
                label: '浦东'
              },
              {
                id: '409',
                label: '金山'
              },
              {
                id: '410',
                label: '松江'
              },
              {
                id: '411',
                label: '青浦'
              },
              {
                id: '412',
                label: '南汇'
              },
              {
                id: '413',
                label: '奉贤'
              },
              {
                id: '414',
                label: '崇明'
              }
            ]
          },
          {
            id: '9',
            label: '安徽',
            children: [
              {
                id: '127',
                label: '淮北'
              },
              {
                id: '128',
                label: '安庆'
              },
              {
                id: '129',
                label: '巢湖'
              },
              {
                id: '130',
                label: '池州'
              },
              {
                id: '131',
                label: '滁州'
              },
              {
                id: '132',
                label: '黄山'
              },
              {
                id: '133',
                label: '淮南'
              },
              {
                id: '134',
                label: '马鞍山'
              },
              {
                id: '135',
                label: '六安'
              },
              {
                id: '136',
                label: '宣城'
              },
              {
                id: '137',
                label: '宿州'
              },
              {
                id: '138',
                label: '铜陵'
              },
              {
                id: '139',
                label: '芜湖'
              },
              {
                id: '140',
                label: '阜阳'
              },
              {
                id: '141',
                label: '蚌埠'
              },
              {
                id: '142',
                label: '合肥'
              },
              {
                id: '143',
                label: '亳州'
              }
            ]
          },
          {
            id: '5',
            label: '福建',
            children: [
              {
                id: '48',
                label: '莆田'
              },
              {
                id: '49',
                label: '南平'
              },
              {
                id: '50',
                label: '龙岩'
              },
              {
                id: '51',
                label: '宁德'
              },
              {
                id: '52',
                label: '泉州'
              },
              {
                id: '66',
                label: '三明'
              },
              {
                id: '70',
                label: '厦门'
              },
              {
                id: '80',
                label: '漳州'
              },
              {
                id: '81',
                label: '福州'
              }
            ]
          },
          {
            id: '19',
            label: '江苏',
            children: [
              {
                id: '53',
                label: '淮安'
              },
              {
                id: '54',
                label: '常州'
              },
              {
                id: '55',
                label: '南京'
              },
              {
                id: '56',
                label: '南通'
              },
              {
                id: '57',
                label: '连云港'
              },
              {
                id: '58',
                label: '徐州'
              },
              {
                id: '59',
                label: '苏州'
              },
              {
                id: '60',
                label: '宿迁'
              },
              {
                id: '61',
                label: '泰州'
              },
              {
                id: '62',
                label: '无锡'
              },
              {
                id: '63',
                label: '盐城'
              },
              {
                id: '64',
                label: '扬州'
              }
            ]
          },
          {
            id: '20',
            label: '江西',
            children: [
              {
                id: '67',
                label: '九江'
              },
              {
                id: '68',
                label: '吉安'
              },
              {
                id: '69',
                label: '景德镇'
              },
              {
                id: '71',
                label: '萍乡'
              },
              {
                id: '72',
                label: '南昌'
              },
              {
                id: '73',
                label: '新余'
              },
              {
                id: '74',
                label: '上饶'
              },
              {
                id: '75',
                label: '宜春'
              },
              {
                id: '76',
                label: '鹰潭'
              },
              {
                id: '77',
                label: '赣州'
              },
              {
                id: '78',
                label: '抚州'
              }
            ]
          },
          {
            id: '25',
            label: '山东',
            children: [
              {
                id: '196',
                label: '济南'
              },
              {
                id: '197',
                label: '济宁'
              },
              {
                id: '198',
                label: '莱芜'
              },
              {
                id: '199',
                label: '聊城'
              },
              {
                id: '200',
                label: '德州'
              },
              {
                id: '201',
                label: '临沂'
              },
              {
                id: '202',
                label: '青岛'
              },
              {
                id: '203',
                label: '日照'
              },
              {
                id: '204',
                label: '潍坊'
              },
              {
                id: '207',
                label: '淄博'
              },
              {
                id: '208',
                label: '泰安'
              },
              {
                id: '218',
                label: '威海'
              },
              {
                id: '219',
                label: '烟台'
              },
              {
                id: '220',
                label: '东营'
              },
              {
                id: '221',
                label: '枣庄'
              },
              {
                id: '222',
                label: '菏泽'
              },
              {
                id: '223',
                label: '滨州'
              }
            ]
          },
          {
            id: '32',
            label: '浙江',
            children: [
              {
                id: '272',
                label: '金华'
              },
              {
                id: '273',
                label: '嘉兴'
              },
              {
                id: '274',
                label: '衢州'
              },
              {
                id: '275',
                label: '丽水'
              },
              {
                id: '276',
                label: '宁波'
              },
              {
                id: '277',
                label: '绍兴'
              },
              {
                id: '278',
                label: '温州'
              },
              {
                id: '279',
                label: '台州'
              },
              {
                id: '280',
                label: '杭州'
              },
              {
                id: '281',
                label: '舟山'
              },
              {
                id: '282',
                label: '湖州'
              }
            ]
          }
        ]
      },
      {
        id: '1003',
        label: '华中地区',
        children: [
          {
            id: '14',
            label: '河南',
            children: [
              {
                id: '308',
                label: '焦作'
              },
              {
                id: '309',
                label: '安阳'
              },
              {
                id: '310',
                label: '开封'
              },
              {
                id: '311',
                label: '洛阳'
              },
              {
                id: '312',
                label: '漯河'
              },
              {
                id: '313',
                label: '平顶山'
              },
              {
                id: '314',
                label: '驻马店'
              },
              {
                id: '315',
                label: '南阳'
              },
              {
                id: '316',
                label: '濮阳'
              },
              {
                id: '317',
                label: '新乡'
              },
              {
                id: '318',
                label: '信阳'
              },
              {
                id: '319',
                label: '许昌'
              },
              {
                id: '320',
                label: '商丘'
              },
              {
                id: '321',
                label: '三门峡'
              },
              {
                id: '322',
                label: '郑州'
              },
              {
                id: '323',
                label: '鹤壁'
              },
              {
                id: '324',
                label: '周口'
              },
              {
                id: '476',
                label: '济源'
              }
            ]
          },
          {
            id: '16',
            label: '湖北',
            children: [
              {
                id: '346',
                label: '荆门'
              },
              {
                id: '347',
                label: '荆州'
              },
              {
                id: '348',
                label: '黄石'
              },
              {
                id: '349',
                label: '黄冈'
              },
              {
                id: '364',
                label: '潜江'
              },
              {
                id: '365',
                label: '孝感'
              },
              {
                id: '366',
                label: '恩施'
              },
              {
                id: '367',
                label: '随州'
              },
              {
                id: '368',
                label: '神农架'
              },
              {
                id: '369',
                label: '十堰'
              },
              {
                id: '370',
                label: '襄樊'
              },
              {
                id: '371',
                label: '武汉'
              },
              {
                id: '372',
                label: '仙桃'
              },
              {
                id: '373',
                label: '天门'
              },
              {
                id: '375',
                label: '咸宁'
              },
              {
                id: '376',
                label: '宜昌'
              },
              {
                id: '377',
                label: '鄂州'
              }
            ]
          },
          {
            id: '17',
            label: '湖南',
            children: [
              {
                id: '350',
                label: '怀化'
              },
              {
                id: '351',
                label: '常德'
              },
              {
                id: '352',
                label: '长沙'
              },
              {
                id: '353',
                label: '郴州'
              },
              {
                id: '354',
                label: '娄底'
              },
              {
                id: '355',
                label: '邵阳'
              },
              {
                id: '356',
                label: '湘潭'
              },
              {
                id: '357',
                label: '湘西'
              },
              {
                id: '358',
                label: '张家界'
              },
              {
                id: '359',
                label: '益阳'
              },
              {
                id: '360',
                label: '衡阳'
              },
              {
                id: '361',
                label: '岳阳'
              },
              {
                id: '362',
                label: '永州'
              },
              {
                id: '363',
                label: '株洲'
              }
            ]
          }
        ]
      },
      {
        id: '1004',
        label: '华南地区',
        children: [
          {
            id: '4',
            label: '广东',
            children: [
              {
                id: '82',
                label: '江门'
              },
              {
                id: '83',
                label: '揭阳'
              },
              {
                id: '84',
                label: '广州'
              },
              {
                id: '85',
                label: '潮州'
              },
              {
                id: '86',
                label: '茂名'
              },
              {
                id: '88',
                label: '梅州'
              },
              {
                id: '89',
                label: '清远'
              },
              {
                id: '90',
                label: '佛山'
              },
              {
                id: '91',
                label: '汕头'
              },
              {
                id: '92',
                label: '汕尾'
              },
              {
                id: '93',
                label: '深圳'
              },
              {
                id: '94',
                label: '韶关'
              },
              {
                id: '109',
                label: '阳江'
              },
              {
                id: '110',
                label: '湛江'
              },
              {
                id: '111',
                label: '云浮'
              },
              {
                id: '112',
                label: '中山'
              },
              {
                id: '113',
                label: '珠海'
              },
              {
                id: '114',
                label: '肇庆'
              },
              {
                id: '115',
                label: '河源'
              },
              {
                id: '116',
                label: '东莞'
              },
              {
                id: '117',
                label: '惠州'
              }
            ]
          },
          {
            id: '12',
            label: '广西',
            children: [
              {
                id: '95',
                label: '桂林'
              },
              {
                id: '96',
                label: '贵港'
              },
              {
                id: '98',
                label: '防城港'
              },
              {
                id: '99',
                label: '南宁'
              },
              {
                id: '100',
                label: '来宾'
              },
              {
                id: '101',
                label: '柳州'
              },
              {
                id: '102',
                label: '钦州'
              },
              {
                id: '103',
                label: '梧州'
              },
              {
                id: '104',
                label: '北海'
              },
              {
                id: '105',
                label: '玉林'
              },
              {
                id: '106',
                label: '河池'
              },
              {
                id: '107',
                label: '贺州'
              },
              {
                id: '108',
                label: '百色'
              },
              {
                id: '478',
                label: '崇左'
              }
            ]
          },
          {
            id: '8',
            label: '海南',
            children: [
              {
                id: '296',
                label: '东方'
              },
              {
                id: '297',
                label: '琼海'
              },
              {
                id: '298',
                label: '三亚'
              },
              {
                id: '299',
                label: '文昌'
              },
              {
                id: '300',
                label: '五指山'
              },
              {
                id: '301',
                label: '万宁'
              },
              {
                id: '302',
                label: '海口'
              },
              {
                id: '303',
                label: '儋州'
              },
              {
                id: '484',
                label: '定安县'
              },
              {
                id: '485',
                label: '屯昌县'
              },
              {
                id: '486',
                label: '陵水黎族自治县'
              },
              {
                id: '487',
                label: '澄迈县'
              },
              {
                id: '488',
                label: '保亭黎族苗族自治县'
              },
              {
                id: '489',
                label: '琼中黎族苗族自治县'
              },
              {
                id: '490',
                label: '乐东黎族自治县'
              },
              {
                id: '491',
                label: '临高县'
              },
              {
                id: '492',
                label: '昌江黎族自治县'
              },
              {
                id: '493',
                label: '白沙黎族自治县'
              }
            ]
          }
        ]
      },
      {
        id: '1005',
        label: '西南地区',
        children: [
          {
            id: '33',
            label: '重庆',
            children: [
              {
                id: '433',
                label: '渝中'
              },
              {
                id: '434',
                label: '大渡口'
              },
              {
                id: '435',
                label: '江北'
              },
              {
                id: '436',
                label: '沙坪坝'
              },
              {
                id: '437',
                label: '九龙坡'
              },
              {
                id: '438',
                label: '南岸'
              },
              {
                id: '439',
                label: '北碚'
              },
              {
                id: '440',
                label: '万盛'
              },
              {
                id: '441',
                label: '双桥'
              },
              {
                id: '442',
                label: '渝北'
              },
              {
                id: '443',
                label: '巴南'
              },
              {
                id: '444',
                label: '万州'
              },
              {
                id: '445',
                label: '涪陵'
              },
              {
                id: '446',
                label: '黔江'
              },
              {
                id: '447',
                label: '长寿'
              },
              {
                id: '448',
                label: '江津'
              },
              {
                id: '449',
                label: '合川'
              },
              {
                id: '450',
                label: '永川'
              },
              {
                id: '451',
                label: '南川'
              },
              {
                id: '452',
                label: '綦江'
              },
              {
                id: '453',
                label: '潼南'
              },
              {
                id: '454',
                label: '铜梁'
              },
              {
                id: '455',
                label: '大足'
              },
              {
                id: '456',
                label: '荣昌'
              },
              {
                id: '457',
                label: '璧山'
              },
              {
                id: '458',
                label: '梁平'
              },
              {
                id: '459',
                label: '城口'
              },
              {
                id: '460',
                label: '丰都'
              },
              {
                id: '461',
                label: '垫江'
              },
              {
                id: '462',
                label: '武隆'
              },
              {
                id: '463',
                label: '忠县'
              },
              {
                id: '464',
                label: '开县'
              },
              {
                id: '465',
                label: '云阳'
              },
              {
                id: '466',
                label: '奉节'
              },
              {
                id: '467',
                label: '巫山'
              },
              {
                id: '468',
                label: '巫溪'
              },
              {
                id: '469',
                label: '石柱'
              },
              {
                id: '470',
                label: '秀山'
              },
              {
                id: '471',
                label: '酉阳'
              },
              {
                id: '472',
                label: '彭水'
              }
            ]
          },
          {
            id: '10',
            label: '贵州',
            children: [
              {
                id: '118',
                label: '贵阳'
              },
              {
                id: '119',
                label: '安顺'
              },
              {
                id: '120',
                label: '六盘水'
              },
              {
                id: '121',
                label: '黔南'
              },
              {
                id: '122',
                label: '黔东南'
              },
              {
                id: '123',
                label: '黔西南'
              },
              {
                id: '124',
                label: '毕节'
              },
              {
                id: '125',
                label: '铜仁'
              },
              {
                id: '126',
                label: '遵义'
              }
            ]
          },
          {
            id: '28',
            label: '四川',
            children: [
              {
                id: '224',
                label: '广安'
              },
              {
                id: '225',
                label: '广元'
              },
              {
                id: '226',
                label: '成都'
              },
              {
                id: '227',
                label: '眉山'
              },
              {
                id: '228',
                label: '凉山'
              },
              {
                id: '229',
                label: '绵阳'
              },
              {
                id: '230',
                label: '攀枝花'
              },
              {
                id: '231',
                label: '南充'
              },
              {
                id: '232',
                label: '德阳'
              },
              {
                id: '233',
                label: '乐山'
              },
              {
                id: '234',
                label: '泸州'
              },
              {
                id: '235',
                label: '内江'
              },
              {
                id: '236',
                label: '甘孜'
              },
              {
                id: '237',
                label: '遂宁'
              },
              {
                id: '238',
                label: '资阳'
              },
              {
                id: '247',
                label: '巴中'
              },
              {
                id: '250',
                label: '达州'
              },
              {
                id: '251',
                label: '雅安'
              },
              {
                id: '252',
                label: '阿坝'
              },
              {
                id: '253',
                label: '自贡'
              },
              {
                id: '254',
                label: '宜宾'
              }
            ]
          },
          {
            id: '29',
            label: '西藏',
            children: [
              {
                id: '268',
                label: '那曲'
              },
              {
                id: '269',
                label: '拉萨'
              },
              {
                id: '270',
                label: '林芝'
              },
              {
                id: '271',
                label: '日喀则'
              },
              {
                id: '480',
                label: '昌都'
              },
              {
                id: '497',
                label: '山南'
              },
              {
                id: '498',
                label: '阿里'
              }
            ]
          },
          {
            id: '31',
            label: '云南',
            children: [
              {
                id: '283',
                label: '楚雄'
              },
              {
                id: '284',
                label: '昆明'
              },
              {
                id: '285',
                label: '丽江'
              },
              {
                id: '286',
                label: '德宏'
              },
              {
                id: '287',
                label: '临沧'
              },
              {
                id: '288',
                label: '曲靖'
              },
              {
                id: '289',
                label: '保山'
              },
              {
                id: '290',
                label: '普洱'
              },
              {
                id: '291',
                label: '文山'
              },
              {
                id: '292',
                label: '大理'
              },
              {
                id: '293',
                label: '红河'
              },
              {
                id: '294',
                label: '昭通'
              },
              {
                id: '295',
                label: '玉溪'
              },
              {
                id: '481',
                label: '怒江'
              },
              {
                id: '482',
                label: '迪庆'
              },
              {
                id: '483',
                label: '西双版纳'
              }
            ]
          }
        ]
      },
      {
        id: '1006',
        label: '西北地区',
        children: [
          {
            id: '11',
            label: '甘肃',
            children: [
              {
                id: '255',
                label: '酒泉'
              },
              {
                id: '256',
                label: '金昌'
              },
              {
                id: '257',
                label: '嘉峪关'
              },
              {
                id: '258',
                label: '兰州'
              },
              {
                id: '259',
                label: '陇南'
              },
              {
                id: '260',
                label: '平凉'
              },
              {
                id: '261',
                label: '临夏'
              },
              {
                id: '262',
                label: '庆阳'
              },
              {
                id: '263',
                label: '定西'
              },
              {
                id: '264',
                label: '武威'
              },
              {
                id: '265',
                label: '天水'
              },
              {
                id: '266',
                label: '张掖'
              },
              {
                id: '267',
                label: '白银'
              },
              {
                id: '477',
                label: '甘南'
              }
            ]
          },
          {
            id: '23',
            label: '宁夏',
            children: [
              {
                id: '170',
                label: '固原'
              },
              {
                id: '171',
                label: '石嘴山'
              },
              {
                id: '172',
                label: '吴忠'
              },
              {
                id: '173',
                label: '中卫'
              },
              {
                id: '174',
                label: '银川'
              }
            ]
          },
          {
            id: '24',
            label: '青海',
            children: [
              {
                id: '175',
                label: '西宁'
              },
              {
                id: '176',
                label: '海东'
              },
              {
                id: '177',
                label: '海西'
              },
              {
                id: '178',
                label: '玉树'
              },
              {
                id: '479',
                label: '海南'
              },
              {
                id: '494',
                label: '海北'
              },
              {
                id: '495',
                label: '黄南'
              },
              {
                id: '496',
                label: '果洛'
              }
            ]
          },
          {
            id: '27',
            label: '陕西',
            children: [
              {
                id: '239',
                label: '宝鸡'
              },
              {
                id: '240',
                label: '安康'
              },
              {
                id: '241',
                label: '商洛'
              },
              {
                id: '242',
                label: '铜川'
              },
              {
                id: '243',
                label: '渭南'
              },
              {
                id: '244',
                label: '西安'
              },
              {
                id: '245',
                label: '咸阳'
              },
              {
                id: '246',
                label: '延安'
              },
              {
                id: '248',
                label: '汉中'
              },
              {
                id: '249',
                label: '榆林'
              }
            ]
          },
          {
            id: '30',
            label: '新疆',
            children: [
              {
                id: '179',
                label: '哈密'
              },
              {
                id: '180',
                label: '博尔塔拉'
              },
              {
                id: '181',
                label: '昌吉'
              },
              {
                id: '182',
                label: '阿勒泰'
              },
              {
                id: '183',
                label: '喀什'
              },
              {
                id: '184',
                label: '克拉玛依'
              },
              {
                id: '185',
                label: '阿克苏'
              },
              {
                id: '186',
                label: '克孜勒苏柯尔克孜'
              },
              {
                id: '187',
                label: '石河子'
              },
              {
                id: '188',
                label: '塔城'
              },
              {
                id: '189',
                label: '五家渠'
              },
              {
                id: '190',
                label: '吐鲁番'
              },
              {
                id: '191',
                label: '巴音郭楞'
              },
              {
                id: '192',
                label: '乌鲁木齐'
              },
              {
                id: '193',
                label: '伊犁'
              },
              {
                id: '195',
                label: '和田'
              },
              {
                id: '499',
                label: '阿拉尔'
              },
              {
                id: '500',
                label: '图木舒克'
              }
            ]
          }
        ]
      },
      {
        id: '1007',
        label: '港澳台',
        children: [
          {
            id: '34',
            label: '香港'
          },
          {
            id: '35',
            label: '台湾'
          },
          {
            id: '36',
            label: '澳门'
          }
        ]
      }
    ]
  },
  {
    id: '7',
    label: '日本'
  },
  {
    id: '37',
    label: '其他国家'
  }
]

const REGIONS_CLB = [
  {
    id: '90',
    label: '中国',
    children: [
      {
        id: '80',
        label: '华北地区',
        children: [
          {
            id: '1',
            label: '北京',
            children: [
              {
                id: '742',
                label: '昌平区'
              },
              {
                id: '743',
                label: '朝阳区'
              },
              {
                id: '744',
                label: '崇文区'
              },
              {
                id: '745',
                label: '大兴区'
              },
              {
                id: '746',
                label: '东城区'
              },
              {
                id: '747',
                label: '房山区'
              },
              {
                id: '748',
                label: '丰台区'
              },
              {
                id: '749',
                label: '海淀区'
              },
              {
                id: '750',
                label: '怀柔区'
              },
              {
                id: '751',
                label: '门头沟区'
              },
              {
                id: '752',
                label: '密云县'
              },
              {
                id: '753',
                label: '平谷区'
              },
              {
                id: '754',
                label: '石景山区'
              },
              {
                id: '755',
                label: '顺义区'
              },
              {
                id: '756',
                label: '通州区'
              },
              {
                id: '757',
                label: '西城区'
              },
              {
                id: '758',
                label: '宣武区'
              },
              {
                id: '759',
                label: '延庆县'
              }
            ]
          },
          {
            id: '3',
            label: '天津',
            children: [
              {
                id: '760',
                label: '宝坻区'
              },
              {
                id: '761',
                label: '北辰区'
              },
              {
                id: '763',
                label: '东丽区'
              },
              {
                id: '765',
                label: '河北区'
              },
              {
                id: '766',
                label: '河东区'
              },
              {
                id: '767',
                label: '和平区'
              },
              {
                id: '768',
                label: '河西区'
              },
              {
                id: '769',
                label: '红桥区'
              },
              {
                id: '770',
                label: '蓟县'
              },
              {
                id: '771',
                label: '津南区'
              },
              {
                id: '772',
                label: '静海县'
              },
              {
                id: '773',
                label: '南开区'
              },
              {
                id: '774',
                label: '宁河县'
              },
              {
                id: '776',
                label: '武清区'
              },
              {
                id: '777',
                label: '西青区'
              },
              {
                id: '900',
                label: '滨海新区'
              }
            ]
          },
          {
            id: '15',
            label: '河北',
            children: [
              {
                id: '226',
                label: '保定市'
              },
              {
                id: '228',
                label: '沧州市'
              },
              {
                id: '229',
                label: '承德市'
              },
              {
                id: '230',
                label: '邯郸市'
              },
              {
                id: '231',
                label: '衡水市'
              },
              {
                id: '234',
                label: '廊坊市'
              },
              {
                id: '236',
                label: '秦皇岛市'
              },
              {
                id: '239',
                label: '石家庄市'
              },
              {
                id: '240',
                label: '唐山市'
              },
              {
                id: '241',
                label: '邢台市'
              },
              {
                id: '242',
                label: '张家口市'
              }
            ]
          },
          {
            id: '24',
            label: '内蒙古',
            children: [
              {
                id: '428',
                label: '阿拉善盟'
              },
              {
                id: '429',
                label: '巴彦淖尔市'
              },
              {
                id: '430',
                label: '包头市'
              },
              {
                id: '431',
                label: '赤峰市'
              },
              {
                id: '432',
                label: '鄂尔多斯市'
              },
              {
                id: '434',
                label: '呼和浩特市'
              },
              {
                id: '435',
                label: '呼伦贝尔市'
              },
              {
                id: '437',
                label: '通辽市'
              },
              {
                id: '438',
                label: '乌海市'
              },
              {
                id: '439',
                label: '乌兰察布市'
              },
              {
                id: '442',
                label: '锡林郭勒盟'
              },
              {
                id: '444',
                label: '兴安盟'
              }
            ]
          },
          {
            id: '28',
            label: '山西',
            children: [
              {
                id: '486',
                label: '大同市'
              },
              {
                id: '491',
                label: '晋城市'
              },
              {
                id: '492',
                label: '晋中市'
              },
              {
                id: '493',
                label: '临汾市'
              },
              {
                id: '494',
                label: '吕梁市'
              },
              {
                id: '495',
                label: '朔州市'
              },
              {
                id: '496',
                label: '太原市'
              },
              {
                id: '497',
                label: '忻州市'
              },
              {
                id: '498',
                label: '阳泉市'
              },
              {
                id: '501',
                label: '运城市'
              },
              {
                id: '502',
                label: '长治市'
              }
            ]
          }
        ]
      },
      {
        id: '81',
        label: '东北地区',
        children: [
          {
            id: '17',
            label: '黑龙江',
            children: [
              {
                id: '272',
                label: '大庆市'
              },
              {
                id: '273',
                label: '大兴安岭地区'
              },
              {
                id: '276',
                label: '哈尔滨市'
              },
              {
                id: '278',
                label: '鹤岗市'
              },
              {
                id: '279',
                label: '黑河市'
              },
              {
                id: '282',
                label: '鸡西市'
              },
              {
                id: '284',
                label: '佳木斯市'
              },
              {
                id: '287',
                label: '牡丹江市'
              },
              {
                id: '289',
                label: '七台河市'
              },
              {
                id: '290',
                label: '齐齐哈尔市'
              },
              {
                id: '291',
                label: '双鸭山市'
              },
              {
                id: '293',
                label: '绥化市'
              },
              {
                id: '298',
                label: '伊春市'
              }
            ]
          },
          {
            id: '20',
            label: '吉林',
            children: [
              {
                id: '345',
                label: '白城市'
              },
              {
                id: '346',
                label: '白山市'
              },
              {
                id: '351',
                label: '吉林市'
              },
              {
                id: '352',
                label: '辽源市'
              },
              {
                id: '355',
                label: '四平市'
              },
              {
                id: '356',
                label: '松原市'
              },
              {
                id: '358',
                label: '通化市'
              },
              {
                id: '359',
                label: '延边朝鲜族自治州'
              },
              {
                id: '361',
                label: '长春市'
              }
            ]
          },
          {
            id: '23',
            label: '辽宁',
            children: [
              {
                id: '413',
                label: '鞍山市'
              },
              {
                id: '414',
                label: '本溪市'
              },
              {
                id: '415',
                label: '朝阳市'
              },
              {
                id: '416',
                label: '大连市'
              },
              {
                id: '417',
                label: '丹东市'
              },
              {
                id: '418',
                label: '抚顺市'
              },
              {
                id: '419',
                label: '阜新市'
              },
              {
                id: '421',
                label: '葫芦岛市'
              },
              {
                id: '422',
                label: '锦州市'
              },
              {
                id: '423',
                label: '辽阳市'
              },
              {
                id: '424',
                label: '盘锦市'
              },
              {
                id: '425',
                label: '沈阳市'
              },
              {
                id: '426',
                label: '铁岭市'
              },
              {
                id: '427',
                label: '营口市'
              }
            ]
          }
        ]
      },
      {
        id: '82',
        label: '华东地区',
        children: [
          {
            id: '2',
            label: '上海',
            children: [
              {
                id: '818',
                label: '宝山区'
              },
              {
                id: '819',
                label: '崇明县'
              },
              {
                id: '820',
                label: '奉贤区'
              },
              {
                id: '821',
                label: '虹口区'
              },
              {
                id: '822',
                label: '黄浦区'
              },
              {
                id: '823',
                label: '嘉定区'
              },
              {
                id: '824',
                label: '金山区'
              },
              {
                id: '825',
                label: '静安区'
              },
              {
                id: '826',
                label: '卢湾区'
              },
              {
                id: '827',
                label: '闵行区'
              },
              {
                id: '830',
                label: '浦东新区'
              },
              {
                id: '831',
                label: '普陀区'
              },
              {
                id: '832',
                label: '青浦区'
              },
              {
                id: '833',
                label: '松江区'
              },
              {
                id: '834',
                label: '徐汇区'
              },
              {
                id: '835',
                label: '杨浦区'
              },
              {
                id: '836',
                label: '闸北区'
              },
              {
                id: '837',
                label: '长宁区'
              }
            ]
          },
          {
            id: '8',
            label: '安徽',
            children: [
              {
                id: '101',
                label: '安庆市'
              },
              {
                id: '102',
                label: '蚌埠市'
              },
              {
                id: '103',
                label: '亳州市'
              },
              {
                id: '104',
                label: '巢湖市'
              },
              {
                id: '105',
                label: '池州市'
              },
              {
                id: '106',
                label: '滁州市'
              },
              {
                id: '107',
                label: '阜阳市'
              },
              {
                id: '110',
                label: '合肥市'
              },
              {
                id: '111',
                label: '淮北市'
              },
              {
                id: '112',
                label: '淮南市'
              },
              {
                id: '113',
                label: '黄山市'
              },
              {
                id: '115',
                label: '六安市'
              },
              {
                id: '116',
                label: '马鞍山市'
              },
              {
                id: '118',
                label: '铜陵市'
              },
              {
                id: '119',
                label: '芜湖市'
              },
              {
                id: '120',
                label: '宿州市'
              },
              {
                id: '121',
                label: '宣城市'
              }
            ]
          },
          {
            id: '9',
            label: '福建',
            children: [
              {
                id: '124',
                label: '福州市'
              },
              {
                id: '126',
                label: '龙岩市'
              },
              {
                id: '127',
                label: '南平市'
              },
              {
                id: '128',
                label: '宁德市'
              },
              {
                id: '129',
                label: '莆田市'
              },
              {
                id: '130',
                label: '泉州市'
              },
              {
                id: '131',
                label: '三明市'
              },
              {
                id: '132',
                label: '厦门市'
              },
              {
                id: '138',
                label: '漳州市'
              }
            ]
          },
          {
            id: '21',
            label: '江苏',
            children: [
              {
                id: '363',
                label: '常州市'
              },
              {
                id: '367',
                label: '淮安市'
              },
              {
                id: '375',
                label: '连云港市'
              },
              {
                id: '376',
                label: '南京市'
              },
              {
                id: '377',
                label: '南通市'
              },
              {
                id: '381',
                label: '苏州市'
              },
              {
                id: '383',
                label: '泰州市'
              },
              {
                id: '386',
                label: '无锡市'
              },
              {
                id: '391',
                label: '宿迁市'
              },
              {
                id: '392',
                label: '徐州市'
              },
              {
                id: '393',
                label: '盐城市'
              },
              {
                id: '395',
                label: '扬州市'
              },
              {
                id: '399',
                label: '镇江市'
              }
            ]
          },
          {
            id: '22',
            label: '江西',
            children: [
              {
                id: '401',
                label: '抚州市'
              },
              {
                id: '402',
                label: '赣州市'
              },
              {
                id: '403',
                label: '吉安市'
              },
              {
                id: '404',
                label: '景德镇市'
              },
              {
                id: '406',
                label: '九江市'
              },
              {
                id: '407',
                label: '南昌市'
              },
              {
                id: '408',
                label: '萍乡市'
              },
              {
                id: '409',
                label: '上饶市'
              },
              {
                id: '410',
                label: '新余市'
              },
              {
                id: '411',
                label: '宜春市'
              },
              {
                id: '412',
                label: '鹰潭市'
              }
            ]
          },
          {
            id: '27',
            label: '山东',
            children: [
              {
                id: '461',
                label: '滨州市'
              },
              {
                id: '462',
                label: '德州市'
              },
              {
                id: '463',
                label: '东营市'
              },
              {
                id: '466',
                label: '菏泽市'
              },
              {
                id: '467',
                label: '济南市'
              },
              {
                id: '468',
                label: '济宁市'
              },
              {
                id: '470',
                label: '莱芜市'
              },
              {
                id: '472',
                label: '聊城市'
              },
              {
                id: '473',
                label: '临沂市'
              },
              {
                id: '474',
                label: '青岛市'
              },
              {
                id: '476',
                label: '日照市'
              },
              {
                id: '477',
                label: '泰安市'
              },
              {
                id: '479',
                label: '威海市'
              },
              {
                id: '480',
                label: '潍坊市'
              },
              {
                id: '481',
                label: '烟台市'
              },
              {
                id: '482',
                label: '枣庄市'
              },
              {
                id: '485',
                label: '淄博市'
              }
            ]
          },
          {
            id: '34',
            label: '浙江',
            children: [
              {
                id: '604',
                label: '杭州市'
              },
              {
                id: '605',
                label: '湖州市'
              },
              {
                id: '606',
                label: '嘉兴市'
              },
              {
                id: '608',
                label: '金华市'
              },
              {
                id: '611',
                label: '丽水市'
              },
              {
                id: '615',
                label: '宁波市'
              },
              {
                id: '617',
                label: '衢州市'
              },
              {
                id: '619',
                label: '绍兴市'
              },
              {
                id: '621',
                label: '台州市'
              },
              {
                id: '624',
                label: '温州市'
              },
              {
                id: '630',
                label: '舟山市'
              }
            ]
          }
        ]
      },
      {
        id: '83',
        label: '华中地区',
        children: [
          {
            id: '16',
            label: '河南',
            children: [
              {
                id: '243',
                label: '安阳市'
              },
              {
                id: '246',
                label: '鹤壁市'
              },
              {
                id: '249',
                label: '焦作市'
              },
              {
                id: '250',
                label: '开封市'
              },
              {
                id: '252',
                label: '漯河市'
              },
              {
                id: '253',
                label: '洛阳市'
              },
              {
                id: '254',
                label: '南阳市'
              },
              {
                id: '255',
                label: '平顶山市'
              },
              {
                id: '256',
                label: '濮阳市'
              },
              {
                id: '257',
                label: '三门峡市'
              },
              {
                id: '258',
                label: '商丘市'
              },
              {
                id: '261',
                label: '新乡市'
              },
              {
                id: '262',
                label: '信阳市'
              },
              {
                id: '263',
                label: '许昌市'
              },
              {
                id: '266',
                label: '郑州市'
              },
              {
                id: '267',
                label: '周口市'
              },
              {
                id: '268',
                label: '驻马店市'
              },
              {
                id: '901',
                label: '济源市'
              }
            ]
          },
          {
            id: '18',
            label: '湖北',
            children: [
              {
                id: '304',
                label: '鄂州市'
              },
              {
                id: '305',
                label: '恩施市'
              },
              {
                id: '307',
                label: '黄冈市'
              },
              {
                id: '308',
                label: '黄石市'
              },
              {
                id: '309',
                label: '荆门市'
              },
              {
                id: '310',
                label: '荆州市'
              },
              {
                id: '311',
                label: '潜江市'
              },
              {
                id: '312',
                label: '神农架林区'
              },
              {
                id: '313',
                label: '十堰市'
              },
              {
                id: '314',
                label: '随州市'
              },
              {
                id: '315',
                label: '天门市'
              },
              {
                id: '317',
                label: '武汉'
              },
              {
                id: '319',
                label: '仙桃市'
              },
              {
                id: '320',
                label: '咸宁市'
              },
              {
                id: '321',
                label: '襄樊市'
              },
              {
                id: '323',
                label: '孝感市'
              },
              {
                id: '324',
                label: '宜昌市'
              }
            ]
          },
          {
            id: '19',
            label: '湖南',
            children: [
              {
                id: '328',
                label: '常德市'
              },
              {
                id: '329',
                label: '郴州市'
              },
              {
                id: '330',
                label: '衡阳市'
              },
              {
                id: '331',
                label: '怀化市'
              },
              {
                id: '334',
                label: '娄底市'
              },
              {
                id: '335',
                label: '邵阳市'
              },
              {
                id: '337',
                label: '湘潭市'
              },
              {
                id: '338',
                label: '湘西土家族苗族自治州'
              },
              {
                id: '339',
                label: '益阳市'
              },
              {
                id: '340',
                label: '永州市'
              },
              {
                id: '341',
                label: '岳阳市'
              },
              {
                id: '342',
                label: '张家界市'
              },
              {
                id: '343',
                label: '长沙市'
              },
              {
                id: '344',
                label: '株洲市'
              }
            ]
          }
        ]
      },
      {
        id: '84',
        label: '华南地区',
        children: [
          {
            id: '11',
            label: '广东',
            children: [
              {
                id: '157',
                label: '潮州市'
              },
              {
                id: '158',
                label: '东莞市'
              },
              {
                id: '160',
                label: '佛山市'
              },
              {
                id: '162',
                label: '广州市'
              },
              {
                id: '163',
                label: '河源市'
              },
              {
                id: '164',
                label: '惠州市'
              },
              {
                id: '166',
                label: '江门市'
              },
              {
                id: '167',
                label: '揭阳市'
              },
              {
                id: '169',
                label: '茂名市'
              },
              {
                id: '170',
                label: '梅州市'
              },
              {
                id: '172',
                label: '清远市'
              },
              {
                id: '173',
                label: '汕头市'
              },
              {
                id: '174',
                label: '汕尾市'
              },
              {
                id: '175',
                label: '韶关市'
              },
              {
                id: '176',
                label: '深圳市'
              },
              {
                id: '180',
                label: '阳江市'
              },
              {
                id: '182',
                label: '云浮市'
              },
              {
                id: '184',
                label: '湛江市'
              },
              {
                id: '185',
                label: '肇庆市'
              },
              {
                id: '186',
                label: '中山市'
              },
              {
                id: '187',
                label: '珠海市'
              }
            ]
          },
          {
            id: '12',
            label: '广西',
            children: [
              {
                id: '188',
                label: '百色市'
              },
              {
                id: '189',
                label: '北海市'
              },
              {
                id: '191',
                label: '防城港市'
              },
              {
                id: '193',
                label: '贵港市'
              },
              {
                id: '194',
                label: '桂林市'
              },
              {
                id: '195',
                label: '河池市'
              },
              {
                id: '196',
                label: '贺州市'
              },
              {
                id: '197',
                label: '来宾市'
              },
              {
                id: '198',
                label: '柳州市'
              },
              {
                id: '199',
                label: '南宁市'
              },
              {
                id: '200',
                label: '钦州市'
              },
              {
                id: '201',
                label: '梧州市'
              },
              {
                id: '203',
                label: '玉林市'
              }
            ]
          },
          {
            id: '14',
            label: '海南',
            children: [
              {
                id: '218',
                label: '儋州市'
              },
              {
                id: '219',
                label: '东方市'
              },
              {
                id: '220',
                label: '海口市'
              },
              {
                id: '221',
                label: '琼海市'
              },
              {
                id: '223',
                label: '三亚市'
              },
              {
                id: '225',
                label: '文昌市'
              },
              {
                id: '867',
                label: '五指山'
              },
              {
                id: '868',
                label: '万宁'
              }
            ]
          }
        ]
      },
      {
        id: '85',
        label: '西南地区',
        children: [
          {
            id: '4',
            label: '重庆',
            children: [
              {
                id: '778',
                label: '巴南区'
              },
              {
                id: '779',
                label: '北碚区'
              },
              {
                id: '780',
                label: '璧山县'
              },
              {
                id: '781',
                label: '城口县'
              },
              {
                id: '782',
                label: '大渡口区'
              },
              {
                id: '783',
                label: '大足县'
              },
              {
                id: '784',
                label: '垫江县'
              },
              {
                id: '785',
                label: '丰都县'
              },
              {
                id: '786',
                label: '奉节县'
              },
              {
                id: '787',
                label: '涪陵区'
              },
              {
                id: '788',
                label: '合川区'
              },
              {
                id: '789',
                label: '江北区'
              },
              {
                id: '790',
                label: '江津区'
              },
              {
                id: '791',
                label: '九龙坡区'
              },
              {
                id: '792',
                label: '开县'
              },
              {
                id: '793',
                label: '梁平县'
              },
              {
                id: '794',
                label: '南岸区'
              },
              {
                id: '795',
                label: '南川区'
              },
              {
                id: '796',
                label: '彭水县'
              },
              {
                id: '797',
                label: '綦江县'
              },
              {
                id: '798',
                label: '黔江区'
              },
              {
                id: '799',
                label: '荣昌县'
              },
              {
                id: '800',
                label: '沙坪坝区'
              },
              {
                id: '801',
                label: '石柱县'
              },
              {
                id: '802',
                label: '双桥区'
              },
              {
                id: '803',
                label: '铜梁县'
              },
              {
                id: '804',
                label: '潼南县'
              },
              {
                id: '805',
                label: '万盛区'
              },
              {
                id: '806',
                label: '万州区'
              },
              {
                id: '807',
                label: '巫山县'
              },
              {
                id: '808',
                label: '巫溪县'
              },
              {
                id: '809',
                label: '武隆县'
              },
              {
                id: '810',
                label: '秀山县'
              },
              {
                id: '811',
                label: '永川区'
              },
              {
                id: '812',
                label: '酉阳县'
              },
              {
                id: '813',
                label: '渝北区'
              },
              {
                id: '814',
                label: '渝中区'
              },
              {
                id: '815',
                label: '云阳县'
              },
              {
                id: '816',
                label: '长寿区'
              },
              {
                id: '817',
                label: '忠县'
              }
            ]
          },
          {
            id: '13',
            label: '贵州',
            children: [
              {
                id: '204',
                label: '安顺市'
              },
              {
                id: '205',
                label: '毕节市'
              },
              {
                id: '208',
                label: '贵阳市'
              },
              {
                id: '210',
                label: '六盘水市'
              },
              {
                id: '211',
                label: '黔东南苗族侗族自治州'
              },
              {
                id: '212',
                label: '黔南布依族苗族自治州'
              },
              {
                id: '213',
                label: '黔西南布依族苗族自治州'
              },
              {
                id: '215',
                label: '铜仁市'
              },
              {
                id: '217',
                label: '遵义市'
              }
            ]
          },
          {
            id: '30',
            label: '四川',
            children: [
              {
                id: '516',
                label: '阿坝藏族羌族自治州'
              },
              {
                id: '517',
                label: '巴中市'
              },
              {
                id: '518',
                label: '成都市'
              },
              {
                id: '519',
                label: '达州市'
              },
              {
                id: '520',
                label: '德阳市'
              },
              {
                id: '523',
                label: '甘孜藏族自治州'
              },
              {
                id: '524',
                label: '广安市'
              },
              {
                id: '526',
                label: '广元市'
              },
              {
                id: '528',
                label: '乐山市'
              },
              {
                id: '529',
                label: '凉山彝族自治州'
              },
              {
                id: '530',
                label: '泸州市'
              },
              {
                id: '531',
                label: '眉山市'
              },
              {
                id: '532',
                label: '绵阳市'
              },
              {
                id: '534',
                label: '南充市'
              },
              {
                id: '535',
                label: '内江市'
              },
              {
                id: '536',
                label: '攀枝花市'
              },
              {
                id: '538',
                label: '遂宁市'
              },
              {
                id: '540',
                label: '雅安市'
              },
              {
                id: '541',
                label: '宜宾市'
              },
              {
                id: '542',
                label: '资阳市'
              },
              {
                id: '543',
                label: '自贡市'
              }
            ]
          },
          {
            id: '31',
            label: '西藏',
            children: [
              {
                id: '546',
                label: '拉萨市'
              },
              {
                id: '547',
                label: '林芝地区'
              },
              {
                id: '548',
                label: '那曲地区'
              },
              {
                id: '549',
                label: '日喀则地区'
              }
            ]
          },
          {
            id: '33',
            label: '云南',
            children: [
              {
                id: '578',
                label: '保山市'
              },
              {
                id: '579',
                label: '楚雄市'
              },
              {
                id: '580',
                label: '大理市'
              },
              {
                id: '581',
                label: '德宏傣族景颇族自治州'
              },
              {
                id: '585',
                label: '红河哈尼族彝族自治州'
              },
              {
                id: '587',
                label: '昆明市'
              },
              {
                id: '589',
                label: '丽江市'
              },
              {
                id: '590',
                label: '临沧市'
              },
              {
                id: '593',
                label: '普洱市'
              },
              {
                id: '594',
                label: '曲靖市'
              },
              {
                id: '595',
                label: '文山市'
              },
              {
                id: '597',
                label: '玉溪市'
              },
              {
                id: '598',
                label: '昭通市'
              }
            ]
          }
        ]
      },
      {
        id: '86',
        label: '西北地区',
        children: [
          {
            id: '10',
            label: '甘肃',
            children: [
              {
                id: '139',
                label: '白银市'
              },
              {
                id: '140',
                label: '定西市'
              },
              {
                id: '144',
                label: '嘉峪关市'
              },
              {
                id: '145',
                label: '金昌市'
              },
              {
                id: '146',
                label: '酒泉市'
              },
              {
                id: '147',
                label: '兰州市'
              },
              {
                id: '148',
                label: '临夏回族自治州'
              },
              {
                id: '150',
                label: '陇南市'
              },
              {
                id: '151',
                label: '平凉市'
              },
              {
                id: '152',
                label: '庆阳市'
              },
              {
                id: '153',
                label: '天水市'
              },
              {
                id: '154',
                label: '武威市'
              },
              {
                id: '156',
                label: '张掖市'
              }
            ]
          },
          {
            id: '25',
            label: '宁夏',
            children: [
              {
                id: '446',
                label: '固原市'
              },
              {
                id: '447',
                label: '石嘴山市'
              },
              {
                id: '448',
                label: '吴忠市'
              },
              {
                id: '449',
                label: '银川市'
              },
              {
                id: '450',
                label: '中卫市'
              }
            ]
          },
          {
            id: '26',
            label: '青海',
            children: [
              {
                id: '454',
                label: '海东地区'
              },
              {
                id: '456',
                label: '海西蒙古族藏族自治州'
              },
              {
                id: '458',
                label: '西宁市'
              },
              {
                id: '459',
                label: '玉树藏族自治州'
              }
            ]
          },
          {
            id: '29',
            label: '陕西',
            children: [
              {
                id: '503',
                label: '安康市'
              },
              {
                id: '504',
                label: '宝鸡市'
              },
              {
                id: '506',
                label: '汉中市'
              },
              {
                id: '508',
                label: '商洛市'
              },
              {
                id: '509',
                label: '铜川市'
              },
              {
                id: '510',
                label: '渭南市'
              },
              {
                id: '511',
                label: '西安市'
              },
              {
                id: '512',
                label: '咸阳市'
              },
              {
                id: '513',
                label: '延安市'
              },
              {
                id: '515',
                label: '榆林市'
              }
            ]
          },
          {
            id: '32',
            label: '新疆',
            children: [
              {
                id: '551',
                label: '阿克苏地区'
              },
              {
                id: '554',
                label: '阿勒泰市'
              },
              {
                id: '556',
                label: '巴音郭楞蒙古自治州'
              },
              {
                id: '557',
                label: '博尔塔拉蒙古自治州'
              },
              {
                id: '560',
                label: '昌吉回族自治州'
              },
              {
                id: '563',
                label: '哈密市'
              },
              {
                id: '564',
                label: '和田市'
              },
              {
                id: '565',
                label: '喀什市'
              },
              {
                id: '566',
                label: '克拉玛依市'
              },
              {
                id: '570',
                label: '石河子市'
              },
              {
                id: '571',
                label: '塔城市'
              },
              {
                id: '572',
                label: '吐鲁番市'
              },
              {
                id: '573',
                label: '乌鲁木齐市'
              },
              {
                id: '576',
                label: '伊犁市'
              },
              {
                id: '869',
                label: '克孜勒苏柯尔克孜'
              },
              {
                id: '870',
                label: '五家渠'
              }
            ]
          }
        ]
      },
      {
        id: '87',
        label: '港澳台',
        children: [
          {
            id: '5',
            label: '澳门'
          },
          {
            id: '6',
            label: '香港'
          },
          {
            id: '7',
            label: '台湾'
          }
        ]
      }
    ]
  },
  {
    id: '999',
    label: '国外'
  },
  {
    id: '0',
    label: '其他'
  }
]
</script>

<style lang="less" scoped>
section {
  margin-bottom: 10px;
}
</style>
