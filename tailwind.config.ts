import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cardo: "var(--font-cardo)",
        sans: ["Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
