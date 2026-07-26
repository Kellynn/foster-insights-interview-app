import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [
    pluginReact({
      reactCompiler: true,
    }),
  ],
  output: {
    // Please replace <REPO_NAME> with the repository name.
    // For example, "/my-project/"
    assetPrefix: '/foster-insights-interview-app/',
  },
});
