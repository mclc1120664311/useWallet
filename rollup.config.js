import postcss from 'rollup-plugin-postcss'


import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript2'

// import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: './dist/my-lib-umd.js',
      format: 'umd',
      name: 'myLib'
      //当入口文件有export时，'umd'格式必须指定name
      //这样，在通过<script>标签引入时，才能通过name访问到export的内容。
    },
    {
      file: './dist/index.es.js',
      format: 'es'
    },
    {
      file: './dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },

  ],
  plugins: [postcss(), typescript()],
  external: ['react', 'react-dom'],
}
