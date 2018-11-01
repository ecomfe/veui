import i18n from '../../managers/i18n'

i18n.register(
  'en-US',
  {
    max: 'Can\'t be greater than {ruleValue}',
    maxLength: 'Can\'t be more than {ruleValue} characters',
    min: 'Can\'t be less than {ruleValue}',
    minLength: 'Can\'t be less than {ruleValue} characters',
    numeric: 'The value must be a number',
    pattern: 'Invalid pattern',
    required: 'Required'
  },
  {
    ns: 'rules'
  }
)
