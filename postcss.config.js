// const fontConfig = [
//   {style: 'normal', weight: 400, type: 'otf', url: './assets/fonts/Helvetica'},
//   {style: 'normal', weight: 400, type: 'otf', url: './assets/fonts/Helvetica-Bold'},
//   {style: 'oblique', weight: 400, type: 'otf', url: './assets/fonts/Helvetica'},
// ]

// const fontVariants = {
//   normal: {
//     400: {
//       url: {
//         otf: 'assets/fonts/JosefinSans-Regular.otf',
//       },
//     },
//   },
//   bold: {
//     800: {
//       url: {
//         otf: 'assets/fonts/Helvetica-Bold.otf',
//       },
//     },
//     900: {
//       url: {
//         otf: 'assets/fonts/Helvetica-Black.otf',
//       },
//     },
//   },
// italic: {
//   900: {
//     url: {
//       otf: 'assets/fonts/Helvetica-BlackOblique.otf',
//     },
//   },
// },
// };

module.exports = ctx => ({
  parser: 'postcss-scss',
  plugins: {
    // 'postcss-font-magician': {
    //   hosted: ['./assets/fonts/'],
    //   custom: {
    //     Helvetica: {
    //       variants: fontVariants,
    //     },
    //   },
    // },
    'postcss-cssnext': {
      warnForDuplicates: false,
    },
    cssnano: ctx.env === 'production' ? { preset: 'default' } : false,
  },
});
