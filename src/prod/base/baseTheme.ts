import { Theme } from "@/app/themes/Theme";

export const baseTheme: Theme = {
  color: {
    primary: "#4e82b5",
    primaryVariant: "#67aaeb",
    background: "#f8fbff",
    surface: "#ffffff",
    surfaceSecondary: "#d1e8ff",
    textPrimary: "#325374",
    textSecondary: "#3e6891",
    textOnPrimary: "#ffffff",
    border: "#c7cfd6",
    success: "#2f7a2e",
    onSuccess: "#9ad9a6",
    error: "#db6971",
    onError: "#f7cdce",
    overlay: "rgba(0, 0, 0, 0.5)",
  },
  spacing: {
    xs: "4px",
    s: "8px",
    m: "16px",
    l: "24px",
    xl: "32px",
    xxl: "40px",
  },
  radius: {
    small: "4px",
    medium: "8px",
    large: "16px",
    full: "50%",
  },
  shadows: {
    medium: {
      offsetX: "0px",
      offsetY: "0px",
      blurRadius: "4px",
      spreadRadius: "0px",
      color: "rgba(151, 194, 236, 0.21)",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap",
  },
  font: {
    h1: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "24px",
      fontWeight: "600",
      lineHeight: "32px",
    },
    h2: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "28px",
    },
    body1: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "16px",
      fontWeight: "400",
      lineHeight: "24px",
    },
    body2: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "16px",
      fontWeight: "600",
      lineHeight: "24px",
    },
    button: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "17px",
      fontWeight: "500",
      lineHeight: "26px",
    },
    caption: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "10px",
      fontWeight: "600",
      lineHeight: "14px",
    },
  },
};
