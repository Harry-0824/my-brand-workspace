export const theme = {
  background: "#080d14",
  surface: "#101721",
  surfaceElevated: "#182333",
  border: "#2b3748",
  textPrimary: "#f4f7fb",
  textSecondary: "#9aa7b7",
  accent: "#62d6c7",
  success: "#5ccf8d",
  warning: "#f6c85f",
  danger: "#ff6b6b",
  radius: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem"
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem"
  }
} as const;

export type AppTheme = typeof theme;
