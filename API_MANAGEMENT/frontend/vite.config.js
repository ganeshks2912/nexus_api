import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:5000",
      "/tenants": "http://localhost:5000",
      "/apis": "http://localhost:5000",
      "/api-keys": "http://localhost:5000",
      "/analytics": "http://localhost:5000",
      "/gateway": "http://localhost:5000",
      "/health": "http://localhost:5000"
    }
  }
});
