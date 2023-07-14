import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cardo: `var(--font-base)`,
        sans: ["Arial", "sans-serif"],
      },
      fontSize: {
        xs: [
          "14px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.03em",
          },
        ],
        sm: [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.03em",
          },
        ],
        base: [
          "18px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.03em",
          },
        ],
        lg: [
          "20px",
          {
            lineHeight: "30px",
            letterSpacing: "-0.03em",
          },
        ],
        xl: [
          "24px",
          {
            lineHeight: "34px",
            letterSpacing: "-0.03em",
          },
        ],
        "2xl": [
          "32px",
          {
            lineHeight: "42px",
            letterSpacing: "-0.03em",
          },
        ],
        "3xl": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "-0.03em",
          },
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
