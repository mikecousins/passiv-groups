import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from '@emotion/styled';
import PortfolioGroupAccuracy from './PortfolioGroupAccuracy';
import PortfolioGroupHoldings from './PortfolioGroupHoldings';
import PortfolioGroupMetadata from './PortfolioGroupMetadata';
import PortfolioGroupTargets from './PortfolioGroupTargets';
import PortfolioGroupTrades from './PortfolioGroupTrades';
import PortfolioGroupAccounts from './PortfolioGroupAccounts';
import PortfolioGroupErrors from './PortfolioGroupErrors';
import {
  selectCurrentGroupTotalEquity,
  selectCurrentGroupCash,
  selectCurrentGroup,
  selectCurrentGroupAccuracy,
  selectCurrentGroupPositions,
  selectCurrentGroupBalances,
  selectCurrentGroupTrades,
  selectCurrentGroupInfoError,
  selectCurrentGroupSetupComplete,
  selectGroupsLoading,
  selectCurrentGroupAccountHoldings,
  selectCurrentGroupId,
} from '../selectors/groups';
import Tooltip from './Tooltip';

export const Container2Column = styled.div`
  @media (min-width: 900px) {
    display: flex;
    justify-content: space-between;
    > div:first-of-type {
      width: 75%;
      margin-right: 30px;
    }
    > div:last-of-type {
      width: 25%;
    }
  }
`;

export const Container6040Column = styled.div`
  @media (min-width: 900px) {
    display: flex;
    justify-content: space-between;
    > div:first-of-type {
      width: 60%;
      margin-right: 30px;
    }
    > div:last-of-type {
      width: 40%;
    }
  }
`;

const OverviewTab = () => {
  const group = useSelector(selectCurrentGroup);
  const positions = useSelector(selectCurrentGroupPositions);
  const balances = useSelector(selectCurrentGroupBalances);
  const cash = useSelector(selectCurrentGroupCash);
  const equity = useSelector(selectCurrentGroupTotalEquity);
  const accuracy = useSelector(selectCurrentGroupAccuracy);
  const trades = useSelector(selectCurrentGroupTrades);
  const setupComplete = useSelector(selectCurrentGroupSetupComplete);
  const loading = useSelector(selectGroupsLoading);
  const accounts = useSelector(selectCurrentGroupAccountHoldings);
  const error = useSelector(selectCurrentGroupInfoError);
  const groupId = useSelector(selectCurrentGroupId);
  const [tradeInProgress, setTradeInProgress] = useState(false);

  // reset our trade in progress flag when the group changes
  useEffect(() => {
    setTradeInProgress(false);
  }, [groupId]);

  // if we have trades set a trade in progress until it's over
  useEffect(() => {
    if (
      trades &&
      trades.trades &&
      trades.trades.length > 0 &&
      !tradeInProgress
    ) {
      setTradeInProgress(true);
    }
  }, [trades, tradeInProgress]);

  // if we don't have our group yet, show a spinner
  if (group === undefined) {
    return <FontAwesomeIcon icon={faSpinner} spin />;
  }

  // if the group is null that means it's not found, redirect to the dashboard
  if (group === null) {
    return <Redirect to="/" />;
  }

  const name = group.name || 'No Name Provided';

  // see if we have any accounts in this group
  if (!group.accounts) {
    return (
      <React.Fragment>
        <Container2Column>
          <PortfolioGroupMetadata
            name={name}
            balances={null}
            cash={null}
            equity={null}
            error={null}
            accounts={null}
          />
          <PortfolioGroupAccuracy accuracy={null} loading={loading} />
        </Container2Column>
        <PortfolioGroupAccounts
          group={group}
          accounts={accounts}
          loading={loading}
          error={error}
        />
      </React.Fragment>
    );
  }

  // see if we have any suggested trades to display
  let tradeDisplay = null;
  if (setupComplete && ((trades && trades.trades.length) || tradeInProgress)) {
    tradeDisplay = (
      <PortfolioGroupTrades
        trades={trades}
        groupId={group.id}
        onClose={() => setTradeInProgress(false)}
      />
    );
  }
  return (
    <React.Fragment>
      <Container2Column>
        <PortfolioGroupMetadata
          name={name}
          balances={balances}
          cash={cash}
          equity={equity}
          error={error}
          accounts={accounts}
        />
        <PortfolioGroupAccuracy accuracy={accuracy} loading={loading} />
      </Container2Column>

      {error ? <PortfolioGroupErrors error={error} /> : null}
      {tradeDisplay}

      <PortfolioGroupTargets positions={positions} />

      <Container6040Column>
        <PortfolioGroupHoldings positions={positions} loading={loading} />
      </Container6040Column>

      <PortfolioGroupAccounts
        group={group}
        accounts={accounts}
        loading={loading}
        error={error}
      />
      <Tooltip />
    </React.Fragment>
  );
};

export default OverviewTab;
