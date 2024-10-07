import typescript from 'rollup-plugin-typescript2';
import postprocess from '@stadtlandnetz/rollup-plugin-postprocess';



export default {
  input: './src/main.ts',
  plugins: [
    typescript(),
    postprocess([
      [/import [^;]* as L from 'leaflet';/, '']
    ])
  ],

  watch: {
    clearScreen: false,
    include: ['src/**'],
    exclude: 'node_modules/**',
  },
  output: {
    dir: './build',
    format: 'es',
  },
};
