const withMT = require("@material-tailwind/react/utils/withMT");
const colors = require("tailwindcss/colors");
 
module.exports = withMT({
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: colors.slate,
        gray: colors.gray,
        blue: colors.blue,
        indigo: colors.indigo,
        emerald: colors.emerald,
        amber: colors.amber,
        red: colors.red,
        green: colors.green,
        yellow: colors.yellow,
      },
    },
  },
  plugins: [],
});
