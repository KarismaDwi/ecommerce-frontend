import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dusty": "#D58A94",
        "peach": "#FF9A8A",
        "aduh": "#e6c3ca",
        "nude": "#F2DADF",
      },
    },
  },
  plugins: [],
} satisfies Config;
