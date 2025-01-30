const preline = require('preline/plugin');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",          // Templates Angular
    "./node_modules/preline/dist/*.js", // Arquivos JavaScript do Preline
  ],
  theme: {
    extend: {},
  },
  plugins: [preline], // Adicione o plugin do Preline
};
