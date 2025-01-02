import { fileURLToPath, URL } from 'node:url'
import { resolve } from "node:path";
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import terser from "@rollup/plugin-terser";
const lifecycle = process.env.npm_lifecycle_event;

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
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  ...getConfigs()
})
