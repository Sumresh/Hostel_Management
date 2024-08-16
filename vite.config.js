import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows external access
  },
  build: {
    outDir: "build", // Change the output directory to 'build'
  },
});
