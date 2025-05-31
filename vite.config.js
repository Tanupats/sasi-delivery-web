import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()], server: {
    host: '0.0.0.0', // เปิดให้เครื่องอื่นในเครือข่ายเข้าได้
    port: 5173        // กำหนดพอร์ต (เปลี่ยนได้ถ้าต้องการ)
  }

})
