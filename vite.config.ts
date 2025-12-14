import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Swapp-test-main/", // Change this to your repo name
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    allowedHosts: ["numerable-james-overapt.ngrok-free.dev"],
  },
});
