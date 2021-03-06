import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { generateSW } from 'rollup-plugin-workbox';
import html from '@web/rollup-plugin-html';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';
import { terser } from 'rollup-plugin-terser';

function augmentWithDatePlugin() {
  return {
    name: 'augment-with-date',
    augmentChunkHash(chunkInfo) {
      if (chunkInfo.name === 'foo') {
        return Date.now().toString();
      }
    }
  };
}

export default {
  input: 'index.html',
  output: {
    entryFileNames: `${new Date().getTime()}-[name]-[hash].js`,
    chunkFileNames: `${new Date().getTime()}-[name]-[hash].js`,
    assetFileNames: `${new Date().getTime()}-[name]-[hash][extname]`,
    format: 'es',
    dir: 'dist',
  },
  preserveEntrySignatures: false,

  plugins: [
    /** Enable using HTML as rollup entrypoint */
    html({
      minify: true,
      injectServiceWorker: false,
      serviceWorkerPath: 'dist/sw.js',
    }),
    /** Resolve bare module imports */
    nodeResolve(),
    commonjs(),
    /** Minify JS */
    terser(),
    /** Bundle assets references via import.meta.url */
    importMetaAssets(),
    /** Compile JS to a lower language target */
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: [
              'last 3 Chrome major versions',
              'last 3 Firefox major versions',
              'last 3 Edge major versions',
              'last 3 Safari major versions',
            ],
            modules: false,
            bugfixes: true,
          },
        ],
      ],
      plugins: [
        [
          require.resolve('babel-plugin-template-html-minifier'),
          {
            modules: { lit: ['html', { name: 'css', encapsulation: 'style' }] },
            failOnError: false,
            strictCSS: true,
            htmlMinifier: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              removeComments: true,
              caseSensitive: true,
              minifyCSS: true,
            },
          },
        ],
      ],
    }),
    /** Create and inject a service worker */
    // generateSW({
    //   globIgnores: ['polyfills/*.js', 'nomodule-*.js'],
    //   navigateFallback: '/index.html',
    //   // where to output the generated sw
    //   swDest: path.join('dist', 'sw.js'),
    //   // directory to match patterns against to be precached
    //   globDirectory: path.join('dist'),
    //   // cache any html js and css by default
    //   globPatterns: ['**/*.{html,js,css,webmanifest}'],
    //   skipWaiting: true,
    //   clientsClaim: true,
    //   runtimeCaching: [{ urlPattern: 'polyfills/*.js', handler: 'CacheFirst' }],
    // }),
  ],
};
