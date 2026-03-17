import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        safe: "#00C853",
        danger: "#FF3B30",
        ink: "#000000",
        paper: "#FFFFFF",
        mist: "#F5F5F5",
        "mist-dark": "#E8E8E8",
      },
      boxShadow: {
        brutal: "3px 3px 0px #000000",
        "brutal-sm": "2px 2px 0px #000000",
        "brutal-lg": "5px 5px 0px #000000",
        "brutal-safe": "3px 3px 0px #00C853",
        "brutal-danger": "3px 3px 0px #FF3B30",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 1.5s infinite",
        "gradient-x": "gradient-x 8s ease infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
