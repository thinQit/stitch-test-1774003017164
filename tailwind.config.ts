import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        primaryHover: "var(--primary-hover)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        error: "var(--error)",
        success: "var(--success)"
      },
      borderRadius: {
        lg: "var(--radius)"
      }
    }
  },
  plugins: []
};

export default config;
