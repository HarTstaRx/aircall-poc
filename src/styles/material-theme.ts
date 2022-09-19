import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003580',
    },
    secondary: {
      main: '#495057',
    },
    error: {
      main: '#d46262',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

export default theme;
