import { createSelector } from 'reselect';
import ms from 'milliseconds';
import { AppState } from '../store';
import shouldUpdate from '../reactors/should-update';
import { selectLoggedIn, selectAppTime } from '.';

export const selectFeaturesRaw = (state: AppState) => state.features;

export const selectFeatures = createSelector(
  selectFeaturesRaw,
  (rawFeatures) => {
    if (rawFeatures.data) {
      return rawFeatures.data.map((feature) => feature.name);
    }
    return null;
  },
);

export const selectFeaturesNeedData = createSelector(
  selectLoggedIn,
  selectFeaturesRaw,
  selectAppTime,
  (loggedIn, rawFeatures, time) => {
    if (!loggedIn) {
      return false;
    }
    return shouldUpdate(rawFeatures, {
      staleTime: ms.minutes(30),
      now: time,
    });
  },
);

const createFeatureSelector = (flagName: string) => {
  return createSelector(selectFeatures, (features) => {
    let hasFeature = false;
    if (features != null) {
      features.map((feature) => {
        if (feature === flagName) {
          hasFeature = true;
        }
        return null;
      });
    }
    return hasFeature;
  });
};

export const selectQuestradeOfferFeature = createFeatureSelector(
  'questrade_offer',
);

export const select2FAFeature = createFeatureSelector('2fa');

export const selectSMS2FAFeature = createFeatureSelector('sms_2fa');

export const selectOTP2FAFeature = createFeatureSelector('otp_2fa');

export const selectNewOnboardingFeature = createFeatureSelector(
  'new-onboarding',
);

export const selectLimitOrdersFeature = createFeatureSelector('limit_orders');

export const selectPerformancePageFeature = createFeatureSelector(
  'performance_page',
);

export const selectGoalsPageFeature = createFeatureSelector('goals_page');

export const selectAdjustedCostBasisFeature = createFeatureSelector(
  'adjusted_cost_basis_tab',
);

export const selectCashManagementFeature = createFeatureSelector(
  'cash_management',
);

export const selectConnectInteractiveBrokersFeature = createFeatureSelector(
  'connect_interactive_brokers',
);

export const selectShowInAppTour = createFeatureSelector('in-app-tour');

export const selectModelPortfolioFeature = createFeatureSelector(
  'model_portfolio',
);
export const selectReferralCharity = createFeatureSelector('referral_charity');
