import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    "./src/**/*.{ts,tsx,js,jsx,astro}",
    "./pages/**/*.{ts,tsx,js,jsx,astro}",
  ],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      keyframes: {
        speedOutRight: {
          "25%": {
            transform: "rotate(15deg)",
          },
          "50%": {
            transform: "rotate(-15deg)",
          },
          "100%": {
            transform: "rotate(-15deg) translate(200%, 75px)",
          },
        },
      },
      semanticTokens: {
        colors: {
          $accent: {
            DEFAULT: {
              value: {
                base: "{colors.blue.700}",
                _osDark: "{colors.blue.500}",
              },
            },
            50: { value: "{colors.blue.50}" },
            100: { value: "{colors.blue.100}" },
            200: { value: "{colors.blue.200}" },
            300: { value: "{colors.blue.300}" },
            400: { value: "{colors.blue.400}" },
            500: { value: "{colors.blue.500}" },
            600: { value: "{colors.blue.600}" },
            700: { value: "{colors.blue.700}" },
            800: { value: "{colors.blue.800}" },
            900: { value: "{colors.blue.900}" },
            950: { value: "{colors.blue.950}" },
          },
          $bodyText: {
            value: {
              base: "{colors.slate.700}",
              _osDark: "{colors.slate.50}",
            },
          },
          $page: {
            value: {
              base: "white",
              _osDark: "{colors.gray.900}",
            },
          },
        },
      },
    },
  },

  conditions: {
    extend: {
      print: ["@media print"],
    },
  },

  globalCss: {
    extend: {
      "body, html": {
        color: "$bodyText",
        bg: "$page",
        fontFamily: '"Rubik Variable", sans-serif',
        fontSize: { base: "md", xl: "lg" },
        lineHeight: "1.25",
        textWrap: "pretty",
        a: {
          textDecoration: "underline",
        },
        _print: {
          lineHeight: "1.15",
        },
      },
      ".prose": {
        "& p": {
          marginBottom: "4",
          lineHeight: "1.5",
          fontSize: "lg",
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
