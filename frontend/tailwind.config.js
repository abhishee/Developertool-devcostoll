/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       "#0A0C10",
        surface:  "#14171F",
        surface2: "#1B1F2A",
        border:   "#232735",
        accent:   "#7C5CFF",
        mint:     "#34E4B8",
        text:     "#E7E9F2",
        muted:    "#7A8099",
        dim:      "#4E5468",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body:    ["Inter", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
