const webpackMerge = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')

module.exports = webpackMerge.merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer:
        {
            host: '127.0.0.1',
            open: true,
            https: false,
        }
    }
)
