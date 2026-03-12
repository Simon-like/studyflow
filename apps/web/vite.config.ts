import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "StudyFlow",
        short_name: "StudyFlow",
        description: "智能学习陪伴应用",
        theme_color: "#E8A87C",
        background_color: "#FDF8F3",
        display: "standalone",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@studyflow/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@studyflow/api": path.resolve(__dirname, "../../packages/api/src/index.ts"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  define: {
    // 让共享包中的 process.env.VITE_API_BASE_URL 能被 Vite 正确替换
    "process.env.VITE_API_BASE_URL": JSON.stringify(process.env.VITE_API_BASE_URL ?? ""),
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
