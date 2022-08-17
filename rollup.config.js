import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './index.ts',
  output: [
    {
      format: 'cjs',
      file: './bundle.js'
    },
  ],
  plugins: [
    resolve(),
    typescript(),
    commonjs()
  ]
};