import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/creep.ts',
  output: {
    dir: 'public',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    resolve(), // Resolve Node.js modules
    commonjs(), // Convert CommonJS modules to ES modules
    typescript({ tsconfig: './tsconfig.json' }),
  ],
};
