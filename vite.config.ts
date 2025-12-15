import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Swapp-app/",
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate heavy libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          // IMPORTANT: Separate QR display (light) from QR scanner (heavy)
          "qr-display": ["qrcode.react"], // ~40KB - used on many pages
          "qr-scanner": ["html5-qrcode"], // ~350KB - only for scanner pages
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    allowedHosts: ["numerable-james-overapt.ngrok-free.dev"],
  },
});
