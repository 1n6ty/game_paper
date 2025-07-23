import { Theme } from "@/app/themes/Theme";

export const baseTheme: Theme = {
  color: {
    primary: "#007BFF",
    secondary: "#6c757d",
    background: "#F8F9FA",
    surface: "#FFFFFF",
    surfaceSecondary: "#E9ECEF",
    text: "#212529",
    textSecondary: "#6c757d",
    border: "#DEE2E6",
    error: "#D8000C",
  },
  spacing: {
    small: "4px",
    medium: "8px",
    large: "16px",
    xlarge: "24px",
  },
  radius: {
    small: "2px",
    medium: "4px",
    large: "8px",
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontUrl:
      "'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap'",
  },
  shadows: {
    medium: {
      offsetX: "0px",
      offsetY: "0px",
      blurRadius: "4px",
      spreadRadius: "0px",
      color: "rgba(151, 194, 236, 0.21)", // #97c2ec с прозрачностью
    },
  },
};
