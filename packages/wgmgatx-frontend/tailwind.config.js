module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      futura_book: "Futura Bk BT",
      futura_black: "Futura XBlk BT",
      futura_heavy: "Futura Hv BT",
      futura_medium: "Futura Md BT",
      futura_light: "Futura Lt BT",
      prata: "Prata",
    },
    colors: {
      primary: {
        100: "hsl(36 53% 67%)",
        200: "hsl(36 27% 52%)",
      },
      gradient: {
        from: "rgba(0, 0, 0, 0.42)",
        to: "black",
      },
      grayscale: {
        100: "hsl(240 6% 27% / 0.8)",
        200: "hsl(240 6% 27% / 0.5)",
        300: "hsl(240 6% 27% / 0.35)",
        400: "rgb(255 255 255 / 0.8)",
        500: "#fff",
      },
    },
  },
  plugins: [],
};
