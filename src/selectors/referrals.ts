import { createSelector } from 'reselect';
import { selectSettings } from './index';

export const selectReferralCode = createSelector(selectSettings, settings => {
  if (settings) {
    return settings.referral_code;
  }
});