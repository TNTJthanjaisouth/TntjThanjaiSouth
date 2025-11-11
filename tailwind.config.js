/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#edced3",
        secondarylight: "#faf7fc",
        primary: "green",

        secondaryDark: "#111827",
      },
    },
  },
  plugins: [],
};
