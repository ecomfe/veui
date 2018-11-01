import i18n from '../../managers/i18n'

i18n.register(
  'zh-Hans',
  {
    max: '不能大于{ruleValue}',
    maxLength: '字符长度不能超过{ruleValue}',
    min: '不能小于{ruleValue}',
    minLength: '字符长度不能短于{ruleValue}',
    numeric: '值必须为数字',
    pattern: '格式不符合要求',
    required: '请填写'
  },
  {
    ns: 'rules'
  }
)
