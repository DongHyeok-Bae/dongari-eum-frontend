// src/styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  
  :root {
    --main-blue: #5D5FEF;
    --dark-blue: #2A2A7D;
    --background-grey: #F0F2F5;
    --text-primary: #1c1e21;
    --text-secondary: #606770;
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--background-grey);
    color: var(--text-primary);
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;