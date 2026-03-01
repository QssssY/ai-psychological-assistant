import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // 配置服务器和代理
  server: {
    proxy: {
      '/api': {
        target: 'http://159.75.169.224:1235',
        changeOrigin: true,
      }
    }
  }
})
