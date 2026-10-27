import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Slot 20 Step 9 & Section 3.3 Proxy Comparison:
    // When using dev proxy, request to /api/* will be forwarded to Spring Boot:
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:8080",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, "")
    //   }
    // }
  }
});
