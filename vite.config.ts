import { fileURLToPath, URL } from 'node:url'
import { resolve } from "node:path";
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import terser from "@rollup/plugin-terser";
const lifecycle = process.env.npm_lifecycle_event;
import VitePluginOneofCssModule from "vite-plugin-oneof-css-module"
import styleImport from 'vite-plugin-style-import';
import postcssPrefixSelector from 'postcss-prefix-selector';
import { viteStaticCopy } from 'vite-plugin-static-copy'

function getConfigs(): UserConfig {
  return lifecycle === "lib"
    ? {
      publicDir: false,
      build: {
        lib: {
          entry: resolve(__dirname, "packages/index.ts"),
          name: "zzbdexComponents",
          fileName: format => `index.${format}.js`
        },
        // https://rollupjs.org/guide/en/#big-list-of-options
        rollupOptions: {
          treeshake: true,
          external: ["vue", "element-plus"],
          output: {
            globals: {
              vue: "Vue",
              "element-plus": "ElementPlus"
            },
            exports: "named"
          },
          // plugins: [terser({ compress: { drop_console: true } })]
        },
        terserOptions: false,
        polyfillModulePreload: false,
        assetsDir: "assets",
      }
    }
    : ({
      build: {
        sourcemap: false,
        chunkSizeWarningLimit: 4000
      }
    } as any);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'src/assets/**/*',
    //       dest: 'assets'  // 复制到构建目录的 'assets' 目录
    //     }
    //   ]
    // })
  ],
  css: {
    postcss: {
      plugins: [
        postcssPrefixSelector({
          prefix: '.zzbdex',
          transform(prefix, selector, prefixedSelector, filePath, rule) {
            if (selector.match(/^(html|body)/)) {
              return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
            }

            if (filePath.match(/node_modules/)) {
              return selector; // Do not prefix styles imported from node_modules
            }

            const annotation = rule.prev();
            if (annotation?.type === 'comment' && annotation.text.trim() === 'no-prefix') {
              return selector; // Do not prefix style rules that are preceded by: /* no-prefix */
            }

            return prefixedSelector;
          },
        }),
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  ...getConfigs()
})
