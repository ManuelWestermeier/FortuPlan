import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "FortuPlan",
        short_name: "FortuPlan",
        description: "Plan your Days and Events with security.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#15151f",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "docs",
  },
  server: {
    port: 2727,
  },
});
