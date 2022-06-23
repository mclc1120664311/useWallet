import less from 'rollup-plugin-less';
import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [less(), typescript(), uglify()],
  external: ['react', 'react-dom'],
}
