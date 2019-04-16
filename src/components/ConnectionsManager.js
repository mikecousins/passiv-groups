import React from 'react';
import { connect } from 'react-redux';
import {
  selectBrokerages,
  selectAuthorizations,
  selectAccounts,
  selectIsFree,
} from '../selectors';
import { initialLoad, loadBrokerages } from '../actions';
import AuthorizationPicker from '../components/AuthorizationPicker';
import Connections from './Connections';
import { Button } from '../styled/Button';
import { push } from 'connected-react-router';

import ShadowBox from '../styled/ShadowBox';
import { H2 } from '../styled/GlobalElements';

export class ConnectionsManager extends React.Component {
  state = {
    creatingNewConnection: false,
  };

  startCreatingNewConnection() {
    this.setState({ creatingNewConnection: true });
  }

  cancelCreatingNewConnection() {
    this.setState({ creatingNewConnection: false });
  }

  render() {
    return (
      <ShadowBox>
        <H2>Connections</H2>
        <Connections />

        {this.state.creatingNewConnection ? (
          <div>
            <Button
              onClick={() => {
                this.cancelCreatingNewConnection();
              }}
            >
              Cancel
            </Button>
            {this.props.isFree && this.props.authorizations.length > 0 ? (
              <React.Fragment>
                Upgrade your account to add multiple connections!
              </React.Fragment>
            ) : (
              <AuthorizationPicker />
            )}
          </div>
        ) : (
          <div>
            <Button
              onClick={() => {
                this.startCreatingNewConnection();
              }}
            >
              {this.props.authorizations.length > 0
                ? 'Add Another Connection'
                : 'Add a Connection'}
            </Button>
          </div>
        )}
      </ShadowBox>
    );
  }
}

const select = state => ({
  brokerages: selectBrokerages(state),
  authorizations: selectAuthorizations(state),
  accounts: selectAccounts(state),
  isFree: selectIsFree(state),
});
const actions = {
  reloadAllState: initialLoad,
  reloadBrokerages: loadBrokerages,
  push: push,
};

export default connect(
  select,
  actions,
)(ConnectionsManager);
