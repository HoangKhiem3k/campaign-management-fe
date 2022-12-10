import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store, {persistor} from './store';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles/GlobalStyles';
import { PersistGate } from 'redux-persist/integration/react'
// import 'bootstrap/dist/css/bootstrap.min.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>

      <GlobalStyles>
        <App />
      </GlobalStyles>
    </PersistGate>

  </Provider>
);
reportWebVitals();
