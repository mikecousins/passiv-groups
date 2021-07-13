import { toast } from 'react-toastify';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { loadSettings } from '.';
import { putData } from '../api';
import { Settings } from '../types/settings';

export const updateOnboardingStep: ActionCreator<ThunkAction<
  void,
  any,
  any,
  Action<any>
>> = (newStep: number, settings: Settings) => {
  return (dispatch) => {
    let newSettings = { ...settings };
    newSettings.onboarding_status = newStep;
    putData('/api/v1/settings/', newSettings)
      .then((res) => {
        dispatch(loadSettings());
      })
      .catch(() => {
        toast.error('Unable to update onboarding status. Please try again.');
      });
  };
};
