import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { LanguageProvider } from './i18n';
import reportWebVitals from './reportWebVitals';
import store from './store/store';
import theme from './theme';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </CssBaseline>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
