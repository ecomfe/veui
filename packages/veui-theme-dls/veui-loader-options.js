const VEUI_STYLE = process.env.VEUI_STYLE || process.env.VUE_APP_VEUI_STYLE

const styles =
  VEUI_STYLE === 'dual'
    ? [
      {
        package: 'veui-theme-dls',
        path: 'dist/themes/ai/components',
        fileName: '{module}.css'
      },
      {
        package: 'veui-theme-dls',
        path: 'dist/themes/d22/components',
        fileName: '{module}.css'
      }
    ]
    : [
      {
        package: 'veui-theme-dls',
        fileName: '{module}.less'
      }
    ]

module.exports = {
  modules: [
    ...styles,
    {
      package: 'veui-theme-dls',
      fileName: '{module}.js',
      transform: false
    }
  ],
  global: ['focus-visible']
}
