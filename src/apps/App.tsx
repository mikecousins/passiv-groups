import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import {
  Route,
  Redirect,
  Switch,
  useLocation,
  matchPath,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import qs from 'qs';
import { StripeProvider } from 'react-stripe-elements';
import '@reach/menu-button/styles.css';
import '@reach/dialog/styles.css';
import {
  selectLoggedIn,
  selectReferralCode,
  selectTrackingId,
} from '../selectors';
import { selectShowInsecureApp, selectShowSecureApp } from '../selectors/app';
import { generateTrackingCode } from '../seo';
import { setReferralCode, setTrackingId } from '../actions';
import { selectQueryTokens } from '../selectors/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  selectGoalsPageFeature,
  selectModelPortfolioFeature,
} from '../selectors/features';
import {
  LOGIN_PATH,
  REGISTER_PATH,
  HELP_PATH,
  RESET_PASSWORD_PATH,
  DASHBOARD_PATH,
  GROUP_PATH,
  SETTINGS_PATH,
  REFERRALS_PATH,
  REPORTING_PATH,
  GOALS_PATH,
  MY_MODELS_PATH,
  CONTACT_FORM_PATH,
} from './Paths';
import { selectIsPaid } from '../selectors/subscription';

// preload pages
const ReactLazyPreload = (importStatement: any) => {
  const Component = React.lazy(importStatement);
  //@ts-ignore
  Component.preload = importStatement;
  return Component;
};

// code splitting to load our pages
const LoginPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "login" */ '../pages/LoginPage'),
);

const RegistrationPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "registration" */ '../pages/RegistrationPage'),
);

const DemoLoginPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "demo-login" */ '../pages/DemoLoginPage'),
);

const HelpPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "help" */ '../pages/HelpPage'),
);

const ContactFormPage = ReactLazyPreload(() =>
  import(
    /* webpackChunkName: "contact-form" */ '../components/Help/ContactForm'
  ),
);

const ResetPasswordPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "reset-password" */ '../pages/ResetPasswordPage'),
);

const ResetPasswordConfirmPage = ReactLazyPreload(() =>
  import(
    /* webpackChunkName: "reset-password-confirm" */ '../pages/ResetPasswordConfirmPage'
  ),
);

const SetNewPasswordPage = ReactLazyPreload(() =>
  import(
    /* webpackChunkName: "set-new-password" */ '../pages/SetNewPasswordPage'
  ),
);
const BrokeragesOauthPage = ReactLazyPreload(() =>
  import(
    /* webpackChunkName: "brokerage-oauth" */ '../pages/BrokeragesOauthPage'
  ),
);
const BrokeragesAuthPage = ReactLazyPreload(() =>
  import(
    /* webpackChunkName: "brokerage-auth" */ '../pages/BrokeragesAuthPage'
  ),
);

const WelcomePage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "settings" */ '../pages/WelcomePage'),
);

const UpgradeOfferPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "upgrade-offer" */ '../pages/UpgradeOfferPage'),
);

const LoginLoadingPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "login-loading" */ '../pages/LoginLoadingPage'),
);

const DashboardPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "dashboard" */ '../pages/DashboardPage'),
);

const GroupPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "group" */ '../pages/GroupPage'),
);

const CouponPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "coupon" */ '../pages/CouponPage'),
);

const SharePage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "share" */ '../pages/SharePage'),
);

const AuthorizationPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "authorization" */ '../pages/AuthorizationPage'),
);

const SettingsPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "settings" */ '../pages/SettingsPage'),
);

const ReferralPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "referrals" */ '../pages/ReferralPage'),
);

const UpgradePage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "upgrade" */ '../pages/UpgradePage'),
);

const PerformancePage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "performance" */ '../pages/PerformancePage'),
);

const GoalsPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "goals" */ '../pages/GoalsPage'),
);

const GoalDetailPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "goals-detail" */ '../pages/GoalDetailPage'),
);

const MyModelPortfoliosPage = ReactLazyPreload(() =>
  import(
    /* webpackChunkName: "my-model-portfolios" */ '../pages/MyModelPortfoliosPage'
  ),
);
const ModelAssetClassPage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "asset-class" */ '../pages/ModelAssetClassPage'),
);
const ModelPortfolioPage = ReactLazyPreload(() =>
  import(
    /* webpackChunkName: "model-portfolio" */ '../pages/ModelPortfolioPage'
  ),
);
const SharedModelPortfolio = ReactLazyPreload(() =>
  import(
    /* webpackChunkName: "shared-model-portfolio" */ '../components/ModelPortfolio/SharedModelPortfolio'
  ),
);
const Prioritization = ReactLazyPreload(() =>
  import(
    /* webpackChunkName: "prioritization" */ '../components/ModelPortfolio/Prioritization'
  ),
);

const QuickTradePage = ReactLazyPreload(() =>
  import(/* webpackChunkName: "quick-trade" */ '../pages/QuickTradePage'),
);

// declare global {
//   interface Window {
//     Stripe: any;
//   }
// }

// list of all the routes that has any link associate with them in the app
type RouteType = {
  path: string;
  exact: boolean;
  component: any;
};
const routes = [
  { path: LOGIN_PATH, exact: true, component: LoginPage },
  { path: REGISTER_PATH, exact: true, component: RegistrationPage },
  { path: HELP_PATH, exact: true, component: HelpPage },
  { path: CONTACT_FORM_PATH, exact: true, component: ContactFormPage },
  { path: RESET_PASSWORD_PATH, exact: true, component: ResetPasswordPage },
  { path: DASHBOARD_PATH, exact: true, component: DashboardPage },
  { path: GROUP_PATH, exact: false, component: GroupPage },
  { path: SETTINGS_PATH, exact: true, component: SettingsPage },
  { path: REFERRALS_PATH, exact: true, component: ReferralPage },
  { path: REPORTING_PATH, exact: true, component: PerformancePage },
  { path: GOALS_PATH, exact: true, component: GoalsPage },
  { path: MY_MODELS_PATH, exact: true, component: MyModelPortfoliosPage },
];

const findComponentForRoute = (path: string, routes: RouteType[]) => {
  const matchingRoute = routes.find((route) =>
    matchPath(path, {
      path: route.path,
      exact: route.exact,
    }),
  );
  return matchingRoute ? matchingRoute.component : null;
};
export const preloadRouteComponent = (to: string) => {
  const component = findComponentForRoute(to, routes);
  if (component && component.preload) {
    component.preload();
  }
};

// use the stripe test key unless we're in prod
const stripePublicKey =
  process.env.REACT_APP_BASE_URL_OVERRIDE &&
  process.env.REACT_APP_BASE_URL_OVERRIDE === 'api.passiv.com'
    ? 'pk_live_LTLbjcwtt6gUmBleYqVVhMFX'
    : 'pk_test_UEivjUoJpfSDWq5i4xc64YNK';

const questradeOauthRedirect = () => {
  let urlParams = new URLSearchParams(window.location.search);
  let newPath = '/oauth/questrade?' + urlParams;
  return <Redirect to={newPath} />;
};

const sharedModelRedirect = () => {
  let newPath = '/shared-model-portfolio?share=';
  return <Redirect to={newPath} />;
};

const App = () => {
  const showInsecureApp = useSelector(selectShowInsecureApp);
  const showSecureApp = useSelector(selectShowSecureApp);
  const referralCode = useSelector(selectReferralCode);
  const trackingId = useSelector(selectTrackingId);
  const loggedIn = useSelector(selectLoggedIn);
  const location = useLocation();
  const goalsPageFeatureActive = useSelector(selectGoalsPageFeature);
  const dispatch = useDispatch();
  const isPaid = useSelector(selectIsPaid);
  const queryParams = useSelector(selectQueryTokens);
  const modelPortfolioFeature = useSelector(selectModelPortfolioFeature);
  let updateQuery = false;

  // redirect the old path name with '/app'
  if (location.pathname.includes('/app')) {
    let newPath = location.pathname.replace('/app', '');
    if (newPath.length === 0) {
      newPath = '/';
    }

    if (Object.keys(queryParams).length > 0) {
      const newQuery = qs.stringify(queryParams);
      newPath += '?' + newQuery;
    }

    window.location.replace(newPath);
  }

  // extract referral code (if any) and make available on registration page
  if (queryParams.ref) {
    if (queryParams.ref !== referralCode) {
      dispatch(setReferralCode({ referralCode: queryParams.ref }));
    }
    delete queryParams.ref;
    updateQuery = true;
  }

  // extract tracking id (if any) and make available on registration page
  if (queryParams.uid) {
    if (queryParams.uid !== trackingId) {
      dispatch(setTrackingId({ trackingId: queryParams.uid }));
    }
    delete queryParams.uid;
    updateQuery = true;
  } else {
    if (trackingId === '') {
      dispatch(setTrackingId({ trackingId: generateTrackingCode() }));
    }
  }

  // include query params in deep link redirect for insecure app
  if (queryParams.next) {
    delete queryParams.next;
    updateQuery = true;
  }
  let appendParams = '';
  if (Object.keys(queryParams).length > 0) {
    const pieces = Object.entries(queryParams).map(([k, v]) => {
      return `${k}%3D${v}`;
    });
    appendParams = '%3F' + pieces.join('%26');
  }

  // redirect path for secure app
  let redirectPath = '/dashboard';
  if (location && location.search) {
    const params = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    if (params.next) {
      redirectPath = params.next as string;
      queryParams.next = redirectPath;
    }
    if (params.code) {
      queryParams.code = params.code;
    }
  }

  if (updateQuery) {
    const newQuery = qs.stringify(queryParams);
    let newPath = location.pathname;
    if (newQuery) {
      newPath += '?' + newQuery;
    }
    window.history.replaceState({}, '', newPath);
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
            {/* common routes */}
            <Route path="/help" component={HelpPage} />
            <Route path="/contact-form" component={ContactFormPage} />
            <Route path="/reset-password" component={ResetPasswordPage} />
            <Route
              path="/reset-password-confirm/:token"
              component={ResetPasswordConfirmPage}
            />
            <Route
              path="/set-new-password/:token"
              component={SetNewPasswordPage}
            />
            <Route path="/demo" component={DemoLoginPage} />
            <Route
              path="/shared-model-portfolio"
              component={SharedModelPortfolio}
              render={() => sharedModelRedirect()}
            />
            <Route path="/quick-trade" component={QuickTradePage} />
            {/* oauth routes */}
            {loggedIn && (
              <Route
                exact
                path="/oauth/questrade-trade"
                render={() => questradeOauthRedirect()}
              />
            )}
            {loggedIn && (
              <Route
                path="/oauth/questrade"
                component={() => (
                  <BrokeragesOauthPage brokerageName="Questrade" />
                )}
              />
            )}
            {loggedIn && (
              <Route
                path="/oauth/tradier"
                component={() => (
                  <BrokeragesOauthPage brokerageName="Tradier" />
                )}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/connect/kraken"
                component={() => <BrokeragesAuthPage brokerageName="Kraken" />}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/connect/bitbuy"
                component={() => <BrokeragesAuthPage brokerageName="BitBuy" />}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/connect/unocoin"
                component={() => <BrokeragesAuthPage brokerageName="UnoCoin" />}
              />
            )}
            {loggedIn && (
              <Route
                path="/oauth/alpaca"
                component={() => <BrokeragesOauthPage brokerageName="Alpaca" />}
              />
            )}
            {loggedIn && (
              <Route
                path="/oauth/interactivebrokers"
                component={() => (
                  <BrokeragesOauthPage brokerageName="Interactive Brokers" />
                )}
              />
            )}
            {loggedIn && (
              <Route
                path="/oauth/td"
                component={() => (
                  <BrokeragesOauthPage brokerageName="TD Ameritrade" />
                )}
              />
            )}
            {loggedIn && (
              <Route
                path="/oauth/zerodha"
                component={() => (
                  <BrokeragesOauthPage brokerageName="Zerodha" />
                )}
              />
            )}
            {loggedIn && (
              <Route
                path="/oauth/wealthica"
                component={() => (
                  <BrokeragesOauthPage brokerageName="Wealthica" />
                )}
              />
            )}
            {loggedIn && (
              <Route
                path="/oauth/ally"
                component={() => (
                  <BrokeragesOauthPage brokerageName="Ally Invest" />
                )}
              />
            )}
            {/* onboarding app */}
            {showSecureApp && (
              <Route path="/welcome">
                <WelcomePage />
              </Route>
            )}
            {showSecureApp && (
              <Route path="/connect/:openBrokerage?">
                <AuthorizationPage onboarding={true} />
              </Route>
            )}
            {showSecureApp && (
              <Route path="/settings/connect/:openBrokerage?">
                <AuthorizationPage onboarding={false} />
              </Route>
            )}
            {showSecureApp && (
              <Route path="/settings" component={SettingsPage} />
            )}
            {showSecureApp && (
              <Route path="/referrals" component={ReferralPage} />
            )}
            {showSecureApp && <Route path="/upgrade" component={UpgradePage} />}
            {showSecureApp && <Route path="/coupon" component={CouponPage} />}
            {/* secure app */}
            {showSecureApp && (
              <Route path="/reporting" component={PerformancePage} />
            )}
            {showSecureApp && goalsPageFeatureActive && (
              <Route path="/goals" component={GoalsPage} />
            )}
            {showSecureApp && goalsPageFeatureActive && (
              <Route path="/goal/:goalId" component={GoalDetailPage} />
            )}
            {showSecureApp && (
              <Route path="/performance">
                <Redirect to="/reporting" />
              </Route>
            )}
            {showSecureApp && (
              <Route
                exact
                path="/questrade-offer"
                component={UpgradeOfferPage}
              />
            )}
            {loggedIn && (
              <Route
                exact
                path="/loading"
                render={(props) => (
                  <LoginLoadingPage {...props} redirectPath={redirectPath} />
                )}
              />
            )}
            {showSecureApp && (
              <Route path="/" exact>
                <Redirect to="/dashboard" />
              </Route>
            )}
            {showSecureApp && (
              <Route path="/dashboard" component={DashboardPage} />
            )}
            {showSecureApp && (
              <Route path="/group/:groupId" component={GroupPage} />
            )}
            {showSecureApp && <Route path="/share" component={SharePage} />}
            {showSecureApp && isPaid && (
              <Route path="/asset-class" component={ModelAssetClassPage} />
            )}
            {showSecureApp && modelPortfolioFeature && (
              <Route path="/models" component={MyModelPortfoliosPage} />
            )}
            {showSecureApp && (
              <Route
                exact
                path="/model-portfolio/:modelId"
                component={ModelPortfolioPage}
              />
            )}
            {showSecureApp && (
              <Route
                exact
                path="/model-portfolio/:modelId/group/:groupId"
                component={ModelPortfolioPage}
              />
            )}
            {showSecureApp && isPaid && (
              <Route
                exact
                path="/priorities/:groupId"
                component={() => <Prioritization onSettingsPage={false} />}
              />
            )}
            {/* insecure app */}
            {showInsecureApp && <Route path="/login" component={LoginPage} />}
            {showInsecureApp && (
              <Route path="/register" component={RegistrationPage} />
            )}
            {/* catchalls // when logged in, catch unknown URLs and redirect to
            dashboard or 'next' query param if defined */}
            {showSecureApp && (
              <Route path="*">
                <Redirect to={redirectPath} />
              </Route>
            )}
            {/* when not logged in, catch unknown URLs (such as secure paths) and
            login with redirect */}
            {showInsecureApp && (
              <Route path="*">
                <Redirect
                  to={`/login?next=${location.pathname}${appendParams}`}
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
