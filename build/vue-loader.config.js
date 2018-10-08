module.exports = {
  extractCSS: process.env.NODE_ENV === 'production',
  preserveWhitespace: false,
  postcss: [
    require('precss'),
    require('autoprefixer')({
      browsers: ['last 3 versions']
    })
  ]
}
