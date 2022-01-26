const CracoLessPlugin = require('craco-less')
const { getThemeVariables } = require('antd/dist/theme')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: getThemeVariables({
              dark: true,
              compact: true,
              'border-radius-base': '8px',
              'primary-color': '#a71d31',
            }),
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
}
