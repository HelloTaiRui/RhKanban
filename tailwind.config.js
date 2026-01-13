module.exports = {
  purge: [

  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  corePlugins:[
    "flex",
    "flexDirection",
    "alignContent",
    "alignItems",
    "justifyContent",
    "justifyItems",
    "cursor",
    "display",
    "height",
    "margin",
    "padding",
    "pointerEvents",
    "position",
    "width",
    "overflow",
    "gap"
  ],//清单详见： https://v2.tailwindcss.com/docs/configuration#core-plugins
  plugins: [],
  
}
