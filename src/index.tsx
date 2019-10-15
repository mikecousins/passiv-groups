import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import * as Sentry from '@sentry/browser';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import ReactGA from 'react-ga';
import App from './apps/App';
import ErrorBoundary from './components/ErrorBoundary';
import createRunLoop from './reactors/init-runloop';
import { effects } from './reactors/effects';
import store, { history } from './store';

// TODO change to an import when we have Typescript typings
const ReactPiwik = require('react-piwik');

// setup Matomo
const piwik = new ReactPiwik({
  url: 'matomo.getpassiv.com',
  siteId: process.env.NODE_ENV === 'production' ? 1 : 2,
  trackErrors: true,
});

if (
  process.env.REACT_APP_BASE_URL_OVERRIDE &&
  process.env.REACT_APP_BASE_URL_OVERRIDE === 'getpassiv.com'
) {
  Sentry.init({
    dsn: 'https://196371422ff74ef38c3e0f9632fd1710@sentry.io/1517518',
  });
} else {
  Sentry.init({
    dsn: 'https://e99a74aaa38a4a9f8a21329d9cb34d76@sentry.io/1517512',
  });
}

// initialize GA and fire first pageview
ReactGA.initialize(
  [
    {
      trackingId:
        process.env.NODE_ENV === 'production'
          ? 'UA-113321962-1'
          : 'UA-113321962-2',
      gaOptions: {},
    },
  ],
  {
    debug: process.env.NODE_ENV === 'production' ? false : true,
  },
);
ReactGA.pageview(window.location.pathname + window.location.search);

// get GA to listen for path changes
history.listen(location => {
  ReactGA.pageview(location.pathname + location.search);
});

const persistor = persistStore(store);

// create our run loop that loads our data
const runLoop = createRunLoop();
runLoop.start(store, effects);

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedRouter history={piwik.connectToHistory(history)}>
            <App />
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);

// TODO enable when we have our semver updates figured out
/*
const onUpdate = () => {
  store.dispatch(updateServiceWorker());
};

registerServiceWorker(onUpdate);
*/
