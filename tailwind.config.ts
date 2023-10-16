import type { Config } from "tailwindcss";

// Tailwind colors for Flexoki theme by Steph Ango. https://stephango.com/flexoki
const flexoki = {
  base: {
    black: "#100F0F",
    950: "#1C1B1A",
    900: "#282726",
    850: "#343331",
    800: "#403E3C",
    700: "#575653",
    600: "#6F6E69",
    500: "#878580",
    300: "#B7B5AC",
    200: "#CECDC3",
    150: "#DAD8CE",
    100: "#E6E4D9",
    50: "#F2F0E5",
    paper: "#FFFCF0",
  },
  red: {
    DEFAULT: "#AF3029",
    light: "#D14D41",
  },
  orange: {
    DEFAULT: "#BC5215",
    light: "#DA702C",
  },
  yellow: {
    DEFAULT: "#AD8301",
    light: "#D0A215",
  },
  green: {
    DEFAULT: "#66800B",
    light: "#879A39",
  },
  cyan: {
    DEFAULT: "#24837B",
    light: "#3AA99F",
  },
  blue: {
    DEFAULT: "#205EA6",
    light: "#4385BE",
  },
  purple: {
    DEFAULT: "#5E409D",
    light: "#8B7EC8",
  },
  magenta: {
    DEFAULT: "#A02F6F",
    light: "#CE5D97",
  },
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
        "36px",
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
    colors: {
      white: flexoki.base.paper,
      light: flexoki.base[150],
      mid: flexoki.base[500],
      dark: flexoki.base[700],
      black: flexoki.base.black,
    },
    extend: {
      fontFamily: {
        base: ["var(--font-base)"],
        handwriting: ["var(--font-handwriting)"],
      },
    },
  },
  plugins: [],
};
export default config;
