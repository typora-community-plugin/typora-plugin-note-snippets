import fs from 'node:fs/promises'
import { defineConfig } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import virtual from '@rollup/plugin-virtual'
import { virtualModules } from 'rollup-plugin-typora'


const { compilerOptions } = JSON.parse(await fs.readFile('./tsconfig.json', 'utf8'))

const overrided = {
  "target": "ES5",
  "downlevelIteration": true,

  "module": undefined,
  "emitDeclarationOnly": undefined,
  "declaration": undefined,
  "declarationDir": undefined,
}

await fs.rm('./dist', { recursive: true, force: true })
await fs.mkdir('./dist')

export default defineConfig({
  input: 'src/main.ts',
  output: {
    file: 'dist/main.js',
    format: 'es',
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.IS_DEV': 'false',
    }),
    virtual(virtualModules),
    nodeResolve(),
    commonjs(),
    typescript({
      compilerOptions: {
        ...compilerOptions,
        ...overrided,
      },
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [["@babel/preset-env", { "useBuiltIns": "entry", "corejs": 3 }]],
      exclude: [
        /\bcore-js\b/,
      ],
    }),
    terser(),
  ],
})
