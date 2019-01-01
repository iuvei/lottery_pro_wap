// 判断localStorage中是否有用户已经选择的主题
var defaultTheme = window.platform === 'wanyou' ? 'theme-blue' : 'theme-dark'
var themeStyle = localStorage.getItem('themeStyle') || defaultTheme
var themeSrc = '../../../static/platform/wanyou/' + themeStyle + '.css'
var linkTag = document.createElement('link')
linkTag.setAttribute('id', 'theme-style')
linkTag.setAttribute('rel', 'stylesheet')
linkTag.setAttribute('href', themeSrc)
// 添加theme style
document.querySelector('html').appendChild(linkTag)
