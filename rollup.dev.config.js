const path = require('path');
const { babel } = require('@rollup/plugin-babel');
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'


const serve = require('rollup-plugin-serve');

const resolveFile = function (filePath) {
    return path.join(__dirname, '..', filePath)
}

module.exports = {
    input: resolveFile('src/index.js'),
    output: {
        file: resolveFile('dist/index.js'),
        format: 'umd',
        sourcemap: true,
    },
    plugins: [
        babel({
            presets: ['@babel/preset-env']
        }),
        serve({
            port: 3001,
            contentBase: [resolveFile('example'), resolveFile('dist')]
        }),
        postcss(), typescript()
    ],
}