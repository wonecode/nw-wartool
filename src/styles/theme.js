import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffe031',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
  },
});

export { theme };
