import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., 'development', 'production')
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Define environment variables globally, using 'process.env' as an object for access in the code
    define: {
      'process.env': {
        ...env // Spread the loaded environment variables into process.env
      }
    },
    plugins: [react()],
  };
});
