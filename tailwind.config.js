module.exports = {
  important: true, // <= This is needed to some cases that Tailwind need to override Antd
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      'xxs': '335px',
      'xs': '425px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
 
};
