import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { getBearerToken } from './utils/localStorage';
import App from './screens/App';
import './styles.scss';
import { jwtSignIn, logout } from './redux/slices/authSlice';

const container = document.getElementById('main')!;
const root = createRoot(container);

const authToken = getBearerToken();
if (authToken) {
  store.dispatch(jwtSignIn(authToken));
} else {
  store.dispatch(logout({}));
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
