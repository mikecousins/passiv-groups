import {
  loadCurrencies,
  loadCurrencyRates,
  loadBrokerages,
  loadSubscriptions,
  loadAuthorizations,
  loadAccounts,
  loadGroups,
  loadSettings,
} from '../actions';
import {
  selectCurrenciesNeedData,
  selectCurrencyRatesNeedData,
  selectBrokeragesNeedData,
  selectSubscriptionsNeedData,
  selectAuthorizationsNeedData,
  selectAccountsNeedData,
  selectGroupsNeedData,
  selectSettingsNeedData,
} from '../selectors';

export { default as reducer } from '../reducers'

export const effects = [
  {
    selector: selectCurrenciesNeedData,
    actionCreator: loadCurrencies,
  },
  {
    selector: selectCurrencyRatesNeedData,
    actionCreator: loadCurrencyRates,
  },
  {
    selector: selectBrokeragesNeedData,
    actionCreator: loadBrokerages,
  },
  {
    selector: selectSubscriptionsNeedData,
    actionCreator: loadSubscriptions,
  },
  {
    selector: selectAuthorizationsNeedData,
    actionCreator: loadAuthorizations,
  },
  {
    selector: selectAccountsNeedData,
    actionCreator: loadAccounts,
  },
  {
    selector: selectGroupsNeedData,
    actionCreator: loadGroups,
  },
  {
    selector: selectSettingsNeedData,
    actionCreator: loadSettings,
  },
]
