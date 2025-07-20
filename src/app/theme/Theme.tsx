import { createTheme, ThemeOptions, ThemeProvider, styled } from '@mui/material/styles';

const theme = createTheme ({
  palette: {
    mode: 'light',
    primary: {
      main: '#920000',
    },
    secondary: {
      main: '#b31717',
    },
    background: {
      default: '#f1f1f1',
      paper: '#ffffff',
    },
    info: {
      main: '#f1e9d2',
    },
  },
});

export default theme