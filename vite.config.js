import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { obfuscator } from 'rollup-plugin-obfuscator'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/complianceiq/',
  plugins: [
    react(),
    obfuscator({
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      debugProtection: true,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimal',
      rotateStringArray: true,
      selfDefending: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.75,
      transformObjectKeys: true,
      unicodeEscapeSequence: false
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ai: ['@tensorflow/tfjs'],
          utils: ['lodash', 'axios']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/insurer-rules': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
}) 