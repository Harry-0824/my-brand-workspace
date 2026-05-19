import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html {
    min-height: 100%;
    background: ${({ theme }) => theme.background};
    color-scheme: dark;
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    background:
      radial-gradient(circle at 20% 20%, rgb(98 214 199 / 0.14), transparent 28rem),
      linear-gradient(135deg, ${({ theme }) => theme.background}, ${({ theme }) => theme.surface});
    color: ${({ theme }) => theme.textPrimary};
    font-family: "Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button {
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  input,
  textarea,
  select {
    border: 0;
    background: transparent;
    outline: none;
  }

  select {
    color-scheme: dark;
  }

  select option {
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.textPrimary};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  #root {
    min-height: 100vh;
  }
`;
