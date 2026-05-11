import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), "VITE_");
  // 代理目标：dev 环境读 VITE_PROXY_TARGET，默认本地后端
  const proxyTarget = env.VITE_PROXY_TARGET || "http://localhost:8080";

  return {
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
      port: 5180,
      proxy: {
        // 反向代理所有后端 API 路径，绕过浏览器 CORS 限制
        // 目标地址由 .env 中的 VITE_PROXY_TARGET 控制
        "/auth": { target: proxyTarget, changeOrigin: true },
        "/users": { target: proxyTarget, changeOrigin: true },
        "/tasks": { target: proxyTarget, changeOrigin: true },
        "/pomodoros": { target: proxyTarget, changeOrigin: true },
        "/stats": { target: proxyTarget, changeOrigin: true },
        "/companion": { target: proxyTarget, changeOrigin: true },
        "/community": { target: proxyTarget, changeOrigin: true },
        "/health": { target: proxyTarget, changeOrigin: true },
        "/docs": { target: proxyTarget, changeOrigin: true },
        "/api-docs": { target: proxyTarget, changeOrigin: true },
      },
    },
    define: {
      "process.env.VITE_API_BASE_URL": JSON.stringify(env.VITE_API_BASE_URL ?? ""),
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
