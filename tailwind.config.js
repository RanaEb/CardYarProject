/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0077C8",
        "primary-dark": "#0057A3",
        accent: "#00AEC2",
        "accent-light": "#66DDEB",

        background: "#F9FAFB",
        surface: "#FFFFFF",
        border: "#E5E7EB",

        textMain: "#053475",
        textMuted: "#6B7280",

        danger: "#DC2626",
      },
      fontFamily: {
      sans: ["Vazirmatn", "system-ui", "sans-serif"],
    },
    },
  },
  plugins: [],
};

export default config;
