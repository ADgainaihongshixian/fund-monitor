import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constant': path.resolve(__dirname, './src/constant'),
    },
  },
  server: {
    proxy: {
      // 搜索基金接口代理
      '/api/eastmoney': {
        target: 'https://fund.eastmoney.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/eastmoney/, ''),
        headers: {
          'Referer': 'https://fund.eastmoney.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },

      // 基金实时估值相关数据接口代理
      '/api/fundgz': {
        target: 'http://fundgz.1234567.com.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fundgz/, ''),
        headers: {
          'Referer': 'http://fundgz.1234567.com.cn/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },

      // 基金历史数据接口代理
      '/api/fund': {
        target: 'https://api.fund.eastmoney.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fund/, ''),
        headers: {
          'Referer': 'https://fund.eastmoney.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },

      // 贵金属数据接口代理 (新浪财经)
      '/api/sina-metal': {
        target: 'https://hq.sinajs.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sina-metal/, ''),
        headers: {
          'Referer': 'https://finance.sina.com.cn/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },

      // 汇率数据接口代理 (新浪财经)
      '/api/sina-exchange': {
        target: 'https://hq.sinajs.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sina-exchange/, ''),
        headers: {
          'Referer': 'https://finance.sina.com.cn/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      },
    }
  }
})