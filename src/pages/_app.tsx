import '../styles/globals.css';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appWithTranslation } from 'next-i18next';
import { HydrationProvider, Client } from 'react-hydration-provider';

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <HydrationProvider>
      <Client>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
          <ToastContainer
            style={{
              fontFamily: 'Montserrat',
            }}
          />
        </ThemeProvider>
      </Client>
    </HydrationProvider>
  );
}

export default appWithTranslation(App);
