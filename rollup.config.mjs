import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

function buildConfig({ input, output }) {
  return {
    input,
    plugins: [typescript(), resolve()],
    onwarn: (e) => {
      throw new Error(e);
    },
    output,
  };
}
export default [
  buildConfig({
    input: 'src/eslint-plugin-redos-detector.ts',
    output: [
      {
        file: 'dist/eslint-plugin-redos-detector.js',
        format: 'commonjs',
      },
    ],
  }),
];
