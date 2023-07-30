// import colors from "tailwindcss/";
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        mainOne: {
          light: "#C6FFDD",
          dark: "#000",
        },
        mainTwo: {
          light: "#FBD786",
          dark: "#000",
        },
        mainThree: {
          light: "#f7797d",
          dark: "#000",
        },
        mainFour: {
          light: "rgb(0, 209, 174)",
        },
        mainFive: {
          light: "rgb(11, 114, 196)",
        },
      },
      spacing: {},
      fontSize: {
        text: "24px",
        header: "48px",
      },
    },
  },
};
