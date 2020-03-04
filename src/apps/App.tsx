import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import qs from 'qs';
import { StripeProvider } from 'react-stripe-elements';
import '@reach/menu-button/styles.css';
import { selectLoggedIn } from '../selectors';
import {
  selectShowInsecureApp,
  selectShowOnboardingApp,
  selectShowSecureApp,
  selectShowLoginLoading,
} from '../selectors/app';
import { selectQueryTokens } from '../selectors/router';
import { prefixPath } from '../common';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// code splitting to lazy load our pages
const LoginPage = React.lazy(() =>
  import(/* webpackChunkName: "login" */ '../pages/LoginPage'),
);
const RegistrationPage = React.lazy(() =>
  import(/* webpackChunkName: "registration" */ '../pages/RegistrationPage'),
);
const DemoLoginPage = React.lazy(() =>
  import(/* webpackChunkName: "demo-login" */ '../pages/DemoLoginPage'),
);
const HelpArticlePage = React.lazy(() =>
  import(/* webpackChunkName: "help-article" */ '../pages/HelpArticlePage'),
);
const HelpPage = React.lazy(() =>
  import(/* webpackChunkName: "help" */ '../pages/HelpPage'),
);
const ResetPasswordPage = React.lazy(() =>
  import(/* webpackChunkName: "reset-password" */ '../pages/ResetPasswordPage'),
);
const ResetPasswordConfirmPage = React.lazy(() =>
  import(
    /* webpackChunkName: "reset-password-confirm" */ '../pages/ResetPasswordConfirmPage'
  ),
);
const QuestradeOauthPage = React.lazy(() =>
  import(
    /* webpackChunkName: "questrade-oauth" */ '../pages/QuestradeOauthPage'
  ),
);
const AlpacaOauthPage = React.lazy(() =>
  import(/* webpackChunkName: "alpaca-oauth" */ '../pages/AlpacaOauthPage'),
);
const InteractiveBrokersOauthPage = React.lazy(() =>
  import(
    /* webpackChunkName: "interactive-brokers-oauth" */ '../pages/InteractiveBrokersOauthPage'
  ),
);
const UpgradeOfferPage = React.lazy(() =>
  import(/* webpackChunkName: "upgrade-offer" */ '../pages/UpgradeOfferPage'),
);
const LoginLoadingPage = React.lazy(() =>
  import(/* webpackChunkName: "login-loading" */ '../pages/LoginLoadingPage'),
);
const DashboardPage = React.lazy(() =>
  import(/* webpackChunkName: "dashboard" */ '../pages/DashboardPage'),
);
const GroupPage = React.lazy(() =>
  import(/* webpackChunkName: "group" */ '../pages/GroupPage'),
);
const CouponPage = React.lazy(() =>
  import(/* webpackChunkName: "coupon" */ '../pages/CouponPage'),
);
const SharePage = React.lazy(() =>
  import(/* webpackChunkName: "share" */ '../pages/SharePage'),
);
const AuthorizationPage = React.lazy(() =>
  import(/* webpackChunkName: "authorization" */ '../pages/AuthorizationPage'),
);
const WelcomePage = React.lazy(() =>
  import(/* webpackChunkName: "welcome" */ '../pages/WelcomePage'),
);
const SettingsPage = React.lazy(() =>
  import(/* webpackChunkName: "settings" */ '../pages/SettingsPage'),
);

declare global {
  interface Window {
    Stripe: any;
  }
}

// use the stripe test key unless we're in prod
const stripePublicKey =
  process.env.REACT_APP_BASE_URL_OVERRIDE &&
  process.env.REACT_APP_BASE_URL_OVERRIDE === 'getpassiv.com'
    ? 'pk_live_LTLbjcwtt6gUmBleYqVVhMFX'
    : 'pk_test_UEivjUoJpfSDWq5i4xc64YNK';

const questradeOauthRedirect = () => {
  let urlParams = new URLSearchParams(window.location.search);
  let newPath = '/app/oauth/questrade?' + urlParams;
  return <Redirect to={newPath} />;
};

const alpacaOauthRedirect = () => {
  let urlParams = new URLSearchParams(window.location.search);
  let newPath = '/app/oauth/alpaca?' + urlParams;
  return <Redirect to={newPath} />;
};

const interactiveBrokersOauthRedirect = () => {
  let urlParams = new URLSearchParams(window.location.search);
  let newPath = '/app/oauth/interactivebrokers?' + urlParams;
  return <Redirect to={newPath} />;
};

const App = () => {
  const showInsecureApp = useSelector(selectShowInsecureApp);
  const showOnboardingApp = useSelector(selectShowOnboardingApp);
  const showSecureApp = useSelector(selectShowSecureApp);
  const showLoginLoading = useSelector(selectShowLoginLoading);
  const loggedIn = useSelector(selectLoggedIn);
  const location = useLocation();

  // include query params in deep link redirect for insecure app
  const queryParams = useSelector(selectQueryTokens);
  if (queryParams.next) {
    delete queryParams.next;
  }
  let appendParams = '';
  if (Object.keys(queryParams).length > 0) {
    const pieces = Object.entries(queryParams).map(([k, v]) => {
      return `${k}%3D${v}`;
    });
    appendParams = '%3F' + pieces.join('%26');
  }

  // redirect path for secure app
  let redirectPath = prefixPath('/dashboard');
  if (location && location.search) {
    const params = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    if (params.next) {
      redirectPath = params.next;
    }
  }

  // stripe provider
  const [stripe, setStripe] = useState<any>(null);
  useEffect(() => {
    if (window.Stripe) {
      setStripe(window.Stripe(stripePublicKey));
    } else {
      document.querySelector('#stripe-js')!.addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        setStripe(window.Stripe(stripePublicKey));
      });
    }
  }, []);

  return (
    <Layout>
      <StripeProvider stripe={stripe}>
        <React.Suspense fallback={<FontAwesomeIcon icon={faSpinner} spin />}>
          <Switch>
            // common routes
            <Route
              path={prefixPath('/help/topic/:slug')}
              component={HelpArticlePage}
            />
            <Route path={prefixPath('/help')} component={HelpPage} />
            <Route
              path={prefixPath('/reset-password')}
              component={ResetPasswordPage}
            />
            <Route
              path={prefixPath('/reset-password-confirm/:token')}
              component={ResetPasswordConfirmPage}
            />
            <Route path={prefixPath('/demo')} component={DemoLoginPage} />
            // oauth routes
            {loggedIn && (
              <Route
                path={prefixPath('/oauth/questrade')}
                component={QuestradeOauthPage}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/oauth/questrade"
                render={() => questradeOauthRedirect()}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/oauth/questrade-trade"
                render={() => questradeOauthRedirect()}
              />
            )}
            <Route path={prefixPath('/demo')} component={DemoLoginPage} />
            // oauth routes
            {loggedIn && (
              <Route
                path={prefixPath('/oauth/questrade')}
                component={QuestradeOauthPage}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/oauth/questrade"
                render={() => questradeOauthRedirect()}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/oauth/questrade-trade"
                render={() => questradeOauthRedirect()}
              />
            )}
            {loggedIn && (
              <Route
                path={prefixPath('/oauth/alpaca')}
                component={AlpacaOauthPage}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/oauth/alpaca"
                render={() => alpacaOauthRedirect()}
              />
            )}
            {loggedIn && (
              <Route
                path={prefixPath('/oauth/interactivebrokers')}
                component={InteractiveBrokersOauthPage}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/oauth/interactivebrokers"
                render={() => interactiveBrokersOauthRedirect()}
              />
            )}
            //
            {loggedIn && (
              <Route
                exact
                path={prefixPath('/questrade-offer')}
                component={UpgradeOfferPage}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path={prefixPath('/loading')}
                render={props => (
                  <LoginLoadingPage {...props} redirectPath={redirectPath} />
                )}
              />
            )}
            {showLoginLoading && (
              <Route path="*">
                <Redirect
                  to={prefixPath(
                    `/loading?next=${location.pathname}${appendParams}`,
                  )}
                />
              </Route>
            )}
            // onboarding app
            {showOnboardingApp && (
              <Route path={prefixPath('/connect/:brokerage?')}>
                <AuthorizationPage onboarding={true} />
              </Route>
            )}
            {showOnboardingApp && (
              <Route path={prefixPath('/welcome')}>
                <WelcomePage />
              </Route>
            )}
            {(showSecureApp || showOnboardingApp) && (
              <Route path={prefixPath('/settings/connect/:brokerage?')}>
                <AuthorizationPage onboarding={false} />
              </Route>
            )}
            {(showSecureApp || showOnboardingApp) && (
              <Route path={prefixPath('/settings')} component={SettingsPage} />
            )}
            {showOnboardingApp && (
              <Route path="*">
                <Redirect to={prefixPath('/welcome')} />
              </Route>
            )}
            // secure app
            {showSecureApp && (
              <Route path="/" exact>
                <Redirect to={prefixPath('/dashboard')} />
              </Route>
            )}
            {showSecureApp && (
              <Route path={prefixPath('/')} exact>
                <Redirect to={prefixPath('/dashboard')} />
              </Route>
            )}
            {showSecureApp && (
              <Route
                path={prefixPath('/dashboard')}
                component={DashboardPage}
              />
            )}
            {showSecureApp && (
              <Route
                path={prefixPath('/group/:groupId')}
                component={GroupPage}
              />
            )}
            {showSecureApp && (
              <Route path={prefixPath('/coupon')} component={CouponPage} />
            )}
            {showSecureApp && (
              <Route path={prefixPath('/share')} component={SharePage} />
            )}
            // insecure app
            {showInsecureApp && (
              <Route path={prefixPath('/login')} component={LoginPage} />
            )}
            {showInsecureApp && (
              <Route
                path={prefixPath('/register')}
                component={RegistrationPage}
              />
            )}
            // catchalls // when logged in, catch unknown URLs and redirect to
            // dashboard or 'next' query param if defined
            {showSecureApp && (
              <Route path="*">
                <Redirect to={redirectPath} />
              </Route>
            )}
            // when not logged in, catch unknown URLs (such as secure paths) and
            // login with redirect
            {showInsecureApp && (
              <Route path="*">
                <Redirect
                  to={prefixPath(
                    `/login?next=${location.pathname}${appendParams}`,
                  )}
                />
              </Route>
            )}
          </Switch>
        </React.Suspense>
      </StripeProvider>
    </Layout>
  );
};

export default App;
