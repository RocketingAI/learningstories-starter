/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
// const config = {};
const config = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
      // This lets Webpack handle dynamic requires in development
      if (!isServer) {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          global: {
            test: /[\\/]components[\\/]global[\\/]/,
            name: 'global-components',
            chunks: 'all',
          },
        };
      }
      return config;
    },
  }

  export default config;

// /** @type {import('next').NextConfig} */
// const nextConfig = {};
// export default nextConfig;