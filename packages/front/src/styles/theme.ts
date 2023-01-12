export const theme = {
  spacing: {
    xxs: "4px",
    xs: "8px",
    sm: "12px",
    default: "16px",
    md: "24px",
    lg: "32px",
    xl: "48px",
    xxl: "64px",
  },
  borderRadius: {
    sm: "4px",
    default: "8px",
    lg: "16px",
    full: "9999px",
  },
  colors: {
    primary: "#2b798f",
    primaryDark: "#1f4e5c",
    primaryLight: "#69b9d1",
    white: "#fff",
    black: "#555",
    darkGrey: "#888",
    grey: "#aaa",
    lightGrey: "#ddd",
    lightestGrey: "whitesmoke",
    success: "#32a852",
  },
  shadow: {
    sm: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
    default:
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
    lg: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);",
  },
};

export type Theme = typeof theme;

export type Spacing = keyof Theme["spacing"];
export type Color = keyof Theme["colors"];
