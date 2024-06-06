const isProd = process.env.NODE_ENV === 'production';
const cdn = process.env.PUBLIC_URL;

const withLess = require('next-with-less');
const webpack = require('webpack');

// CSS Imported by a Dependency
const withTM = require('next-transpile-modules')(['@antv/graphin']);

// const IS_PROD = process.env.NEXT_PUBLIC_PROD;

const urlPrefix =
  (process.env.NEXT_PUBLIC_PROD ? 'https:' : 'http:') +
  process.env.PUBLIC_URL +
  '/_next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // async headers(){
  //   return [
  //     {
  //       source: "*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
  //         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  //       ]
  //     }
  //   ]
  // },
  poweredByHeader: false,
  compress: false,
  reactStrictMode: false,
  output: 'standalone',
  assetPrefix: isProd && cdn ? cdn : undefined,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                'prefixIds',
              ],
            },
            titleProp: true,
            ref: true,
          },
        },
        'file-loader',
      ],
      issuer: {
        and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
      },
    });
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        stream: 'stream-browserify',
      },
      fallback: {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
      },
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );
    return config;
  },
};

module.exports = withLess(withTM(nextConfig));
