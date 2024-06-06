module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 1,
        features: {
          'custom-properties': false,
        },
      },
    ],
    'postcss-advanced-variables',
    'tailwindcss/nesting',
    'tailwindcss',
    'autoprefixer',
    'postcss-aspect-ratio-mini',
    ['postcss-px-to-viewport',{
      viewportWidth: 390, // (Number) The width of the viewport.
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: "vw", // (String) Expected units.
      selectorBlackList: [".ignore", ".hairlines"], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
      mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
      exclude: [
        /[\\/]node_modules[\\/]/,
        /[\\/]src[\\/]pc[\\/]/,
        /[\\/]src[\\/]pages[\\/]/,
        /[\\/]src[\\/]components[\\/]/,
        /[\\/]src[\\/]hooks[\\/]/,
        /[\\/]src[\\/]api[\\/]/,
        /[\\/]src[\\/]recoil[\\/]/,
        /[\\/]src[\\/]utils[\\/]/,
        /[\\/]src[\\/]typings[\\/]/,
        /[\\/]src[\\/]assets[\\/]/,
      ],
    }],
    ['postcss-write-svg',{
      utf8: false,
    }],
  ],
};
