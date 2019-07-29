const path = require('path')
const ESMWebpackPlugin = require('@purtuga/esm-webpack-plugin')

const base = {
  mode: 'production',
  devtool: 'source-map',
  target: 'web',
  entry: './index.js'
}

const outputBase = {
  path: path.resolve(__dirname, './dist'),
  library: 'elementreeStateMachine'
}

const esm = Object.assign({}, base, {
  output: Object.assign({}, outputBase, {
    filename: 'statemachine.esm.js',
    libraryTarget: 'var'
  }),
  plugins: [
    new ESMWebpackPlugin()
  ]
})

module.exports = [esm]
