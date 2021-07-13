import { createSelector } from 'reselect';
import ms from 'milliseconds';
import shouldUpdate from '../reactors/should-update';
import { AppState } from '../store';

// have to require this for Typescript to work properly.....
// hopefully we can import this in the future
var jwtDecode = require('jwt-decode');

export const selectState = (state: AppState) => state;

export const selectAppTime = (state: AppState) => state.appTime;

export const selectLoggedIn = (state: AppState) => !!state.auth.token;

export const selectToken = (state: AppState) => state.auth.token;

export const selectReferral = (state: AppState) => state.referral;

export const selectTracking = (state: AppState) => state.tracking;

export const selectDevice = (state: AppState) => state.auth.device;

export const selectReferralCode = createSelector(selectReferral, (referral) => {
  if (referral !== null) {
    return referral.referralCode;
  }
  return null;
});

export const selectTrackingId = createSelector(selectTracking, (tracking) => {
  if (tracking !== null) {
    return tracking.trackingId;
  }
  return null;
});

export const selectTokenMinutesRemaining = createSelector(
  selectToken,
  selectAppTime,
  (token, now) => {
    if (!token) {
      return 0;
    }
    const decodedToken = jwtDecode(token);
    const expiry = ms.seconds(decodedToken.exp);
    return (expiry - now) / (1000 * 60);
  },
);

export const selectTokenIsExpired = createSelector(
  selectToken,
  selectAppTime,
  (token, now) => {
    if (!token) {
      return false;
    }
    const decodedToken = jwtDecode(token);
    const expiry = ms.seconds(decodedToken.exp);
    if (now < expiry) {
      return false;
    }
    return true;
  },
);

export const selectIncentivesRaw = (state: AppState) => state.incentives;

export const selectBrokeragesRaw = (state: AppState) => state.brokerages;

export const selectAuthorizationsRaw = (state: AppState) =>
  state.authorizations;

export const selectIncentives = createSelector(
  selectIncentivesRaw,
  (rawIncentives) => {
    if (rawIncentives.data) {
      return rawIncentives.data;
    }
    return null;
  },
);

export const selectIncentivesNeedData = createSelector(
  selectLoggedIn,
  selectIncentivesRaw,
  selectAppTime,
  (loggedIn, rawIncentives, time) => {
    if (!loggedIn) {
      return false;
    }
    return shouldUpdate(rawIncentives, {
      staleTime: ms.minutes(30),
      now: time,
    });
  },
);

export const selectSettingsRaw = (state: AppState) => state.settings;

export const selectSettings = createSelector(
  selectSettingsRaw,
  (rawSettings) => {
    if (rawSettings.data) {
      return rawSettings.data;
    }
  },
);

export const selectOnboardingStep = createSelector(
  selectSettings,
  (settings) => {
    if (settings) {
      return settings.onboarding_status;
    }
  },
);

export const selectIsAffiliate = createSelector(selectSettings, (settings) => {
  if (settings) {
    return settings.is_affiliate;
  }
  return false;
});

export const selectContextualMessages = createSelector(
  selectSettings,
  (settings) => {
    if (settings && settings.contextual_messages) {
      return settings.contextual_messages.map((message) => message.name);
    }
  },
);

export const selectTakeTour = createSelector(selectSettings, (settings) => {
  if (settings) {
    return settings.take_passiv_tour;
  }
});

export const selectSMS2FAEnabled = createSelector(
  selectSettings,
  (settings) => {
    if (settings) {
      return settings.sms_2fa_enabled;
    }
  },
);

export const selectOTP2FAEnabled = createSelector(
  selectSettings,
  (settings) => {
    if (settings) {
      return settings.otp_2fa_enabled;
    }
  },
);

export const selectPhoneNumber = createSelector(selectSettings, (settings) => {
  if (settings) {
    return settings.phone_number;
  }
});

export const selectIsDemo = createSelector(selectSettings, (settings) => {
  if (settings) {
    return settings.demo;
  }
  return false;
});

export const selectBrokerages = createSelector(
  selectBrokeragesRaw,
  selectIsDemo,
  (rawBrokerages, isDemo) => {
    if (rawBrokerages.data) {
      let brokerages = rawBrokerages.data;
      if (!isDemo) {
        brokerages = brokerages.filter((b) => b.enabled === true);
      }
      return brokerages;
    }
  },
);

export const selectAllBrokerages = createSelector(
  selectBrokeragesRaw,
  (rawBrokerages) => {
    return rawBrokerages.data;
  },
);

export const selectBrokeragesNeedData = createSelector(
  selectLoggedIn,
  selectBrokeragesRaw,
  selectAppTime,
  (loggedIn, rawBrokerages, time) => {
    if (!loggedIn) {
      return false;
    }
    return shouldUpdate(rawBrokerages, {
      staleTime: ms.minutes(5),
      now: time,
    });
  },
);

export const selectAuthorizations = createSelector(
  selectAuthorizationsRaw,
  (rawAuthorizations) => {
    if (rawAuthorizations.data) {
      return rawAuthorizations.data;
    }
  },
);

export const selectDisplayQuestradeConnectPrompt = createSelector(
  selectAuthorizations,
  (authorizations) => {
    let result = false;
    if (authorizations) {
      const hasQuestradeConnection: boolean = authorizations.some(
        (a) => a.brokerage.slug === 'QUESTRADE',
      );
      const skippedQuestradeConnection: boolean = authorizations.some(
        (a) => a.meta.has_questrade === true,
      );
      if (!hasQuestradeConnection && skippedQuestradeConnection) {
        result = true;
      }
    }
    return result;
  },
);

export const selectDisabledAuthorizations = createSelector(
  selectAuthorizations,
  (authorizations) => {
    const disabledAuthorizations =
      authorizations !== undefined &&
      authorizations.filter((a) => a.disabled === true);
    return disabledAuthorizations;
  },
);

export const selectAuthorizationBrokerages = createSelector(
  selectBrokerages,
  selectAuthorizations,
  (brokerages, authorizations) => {
    if (authorizations) {
      const authorizedBrokerageIds = authorizations.map((a) => a.brokerage.id);
      if (brokerages) {
        return brokerages.filter(
          (b) => authorizedBrokerageIds.indexOf(b.id) >= 0,
        );
      }
    }
    return null;
  },
);

export const selectMaintenanceBrokerages = createSelector(
  selectAppTime,
  selectAuthorizationBrokerages,
  selectBrokerages,
  (appTime, brokerages, allBrokerages) => {
    if (brokerages !== null) {
      const maintenanceBrokerages: any = [];
      let testBrokerages = brokerages;
      if (allBrokerages !== undefined && brokerages.length === 0) {
        testBrokerages = allBrokerages;
      }
      testBrokerages.map((b: any) => {
        let maintenance = b.maintenance_mode;
        if (maintenance === false) {
          const now = new Date();
          const weekDay = now.getDay();

          b.maintenance_windows.map((w: any) => {
            let start = new Date(w.start);
            let end = new Date(w.end);
            let weekdays = w.weekdays.split(',').map((d: string) => Number(d));
            if (weekdays.indexOf(weekDay) >= 0) {
              if (now >= start && now < end) {
                maintenance = true;
              }
            }
            return null;
          });
        }
        if (maintenance === true) {
          maintenanceBrokerages.push(b);
        }
        return null;
      });
      return maintenanceBrokerages;
    }
    return null;
  },
);

export const selectHasQuestradeConnection = createSelector(
  selectAuthorizations,
  (authorizations) => {
    if (authorizations) {
      return authorizations.some((a) => a.brokerage.name === 'Questrade');
    } else {
      return false;
    }
  },
);

export const selectHasWealthicaConnection = createSelector(
  selectAuthorizations,
  (authorizations) => {
    if (authorizations) {
      return authorizations.some((a) => a.brokerage.name === 'Wealthica');
    } else {
      return false;
    }
  },
);

export const selectAuthorizationsNeedData = createSelector(
  selectLoggedIn,
  selectAuthorizationsRaw,
  selectAppTime,
  (loggedIn, rawAuthorizations, time) => {
    if (!loggedIn) {
      return false;
    }
    return shouldUpdate(rawAuthorizations, {
      staleTime: ms.minutes(10),
      now: time,
    });
  },
);

export const selectSettingsNeedData = createSelector(
  selectLoggedIn,
  selectSettingsRaw,
  selectAppTime,
  (loggedIn, rawSettings, time) => {
    if (!loggedIn) {
      return false;
    }
    return shouldUpdate(rawSettings, {
      staleTime: ms.minutes(10),
      now: time,
    });
  },
);

export const selectPlansRaw = (state: AppState) => state.plans;

export const selectPlans = createSelector(selectPlansRaw, (rawPlans) => {
  if (rawPlans.data) {
    return rawPlans.data;
  }
});

export const selectPlansNeedData = createSelector(
  selectLoggedIn,
  selectPlansRaw,
  selectAppTime,
  (loggedIn, rawPlans, time) => {
    if (!loggedIn) {
      return false;
    }
    return shouldUpdate(rawPlans, {
      staleTime: ms.days(1),
      now: time,
    });
  },
);

export const selectIsDemoMode = (state: AppState) => state.demo;

export const selectRouter = (state: AppState) => state.router;

export const selectCurrencyRatesRaw = (state: AppState) => state.currencyRates;

export const selectCurrencyRates = createSelector(
  selectCurrencyRatesRaw,
  (rawCurrencyRates) => {
    if (rawCurrencyRates.data) {
      return rawCurrencyRates.data;
    } else {
      return null;
    }
  },
);

export const selectCurrencyRatesNeedData = createSelector(
  selectLoggedIn,
  selectCurrencyRatesRaw,
  selectAppTime,
  (loggedIn, rawCurrencyRates, time) => {
    if (!loggedIn) {
      return false;
    }
    return shouldUpdate(rawCurrencyRates, {
      staleTime: ms.minutes(10),
      now: time,
    });
  },
);

export const selectPasswordResetToken = createSelector(
  selectRouter,
  (router) => {
    let token = null;
    if (
      router &&
      router.location &&
      router.location.pathname &&
      router.location.pathname.split('/').length === 3
    ) {
      token = router.location.pathname.split('/')[2];
    }
    return token;
  },
);

export const selectIsAuthorized = createSelector(
  selectAuthorizations,
  (authorizations) => {
    if (authorizations === undefined) {
      return true;
    }
    if (authorizations.length > 0) {
      return true;
    }
    return false;
  },
);

export const selectShowInsecureApp = createSelector(
  selectLoggedIn,
  (loggedIn) => {
    return loggedIn === false;
  },
);

export const selectName = createSelector(selectSettings, (settings) => {
  if (settings) {
    return settings.name;
  }
  return '';
});

export const selectIsUpdateServiceWorker = (state: AppState) =>
  state.updateServiceWorker;
