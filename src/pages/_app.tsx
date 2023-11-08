import '../styles/globals.css';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appWithTranslation } from 'next-i18next';
import { HydrationProvider, Client } from 'react-hydration-provider';
import { SessionProvider } from "next-auth/react"

function App({ Component, pageProps: { session, ...pageProps }, }) {
  return (
    <HydrationProvider>
      <Client>
        <SessionProvider session={session}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
            <ToastContainer
              style={{
               fontFamily: 'Montserrat',
             }}
            />
          </ThemeProvider>
        </SessionProvider>
      </Client>
    </HydrationProvider>
  );
}

export default appWithTranslation(App);
