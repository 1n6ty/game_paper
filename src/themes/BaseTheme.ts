import { Theme } from "./Theme";

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
  radii: {
    small: "2px",
    medium: "4px",
    large: "8px",
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
  },
};
