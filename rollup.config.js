import typescript from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify';

var env = process.env.NODE_ENV
var config = {
    name: 'ReduxAwaiter',
    output: {
        format: 'umd'
    },
    plugins: [
        typescript({
            tsconfig: require('./tsconfig.json'),
            typescript: require('typescript')
        })
    ]
}

if (env === 'production') {
    config.plugins.push(
        uglify({
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            }
        })
    )
}

export default config