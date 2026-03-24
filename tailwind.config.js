/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px"
      }
    },
    extend: {
      colors: {
        background: "hsl(210 20% 6%)",
        foreground: "hsl(210 40% 98%)",
        muted: "hsl(210 12% 16%)",
        border: "hsl(210 12% 18%)",
        card: "hsl(210 18% 8%)",
        accent: "hsl(210 100% 60%)",
        accentSoft: "hsl(210 100% 60% / 0.12)",
        danger: "hsl(0 84% 60%)"
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px"
      },
      boxShadow: {
        "soft-lg":
          "0 18px 60px rgba(15, 23, 42, 0.65), 0 0 0 1px rgba(148, 163, 184, 0.12)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-40px)" }
        }
      },
      animation: {
        blink: "blink 1.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite"
      }
    }
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")]
};

