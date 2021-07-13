import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import RebalanceWidget from './RebalanceWidget';
import { H2, H3, Title, P, BulletUL, A } from '../styled/GlobalElements';
import {
  TradesContainer,
  TradeType,
  Symbol,
  ColumnTrades,
} from '../styled/Group';
import {
  selectCurrentGroupSettings,
  selectCurrentGroupId,
  selectNeedToPrioritize,
} from '../selectors/groups';
import Tooltip from './Tooltip';
import Number from './Number';
import { selectAccounts } from '../selectors/accounts';
import { selectAuthorizations } from '../selectors';
import TradesExplanation from './TradesExplanation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';
import Tour from './Tour/Tour';
import { TradesSteps } from './Tour/TourSteps';
import {
  ContextualMessageMultiWrapper,
  Message,
} from '../components/ContextualMessageMultiWrapper';
import { HideButton } from './ContextualMessageWrapper';
import Grid from '../styled/Grid';
import NotificationMessage from './NotificationMessage';

const HideButtonBox = styled.div`
  margin-right: 60px;
`;

type Props = {
  trades: any;
  groupId: string;
  error: any | null;
  onClose?: () => void;
};

const NoTradesNotice = styled.div`
  color: #232225;
  padding-top: 20px;
`;

const SectionHeader = styled(H2)`
  font-size: 20px;
`;

const AccuracyBullets = styled(BulletUL)`
  font-size: 18px;
  padding-top: 10px;
`;

export const PortfolioGroupTrades = ({
  trades,
  groupId,
  error,
  onClose,
}: Props) => {
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const authorizations = useSelector(selectAuthorizations);
  const settings = useSelector(selectCurrentGroupSettings);
  const [tradesSubmitted, setTradesSubmitted] = useState(false);
  const [tradesCache, setTradesCache] = useState(null);
  const currentGroupId = useSelector(selectCurrentGroupId);
  const needToPrioritize = useSelector(selectNeedToPrioritize);

  const groupAccounts = accounts.filter((a) => a.portfolio_group === groupId);

  let isBlendedAccount = false;

  const brokerages = groupAccounts.map((account) => {
    if (authorizations !== undefined) {
      const authorization =
        authorizations &&
        authorizations.find(
          (authorization) =>
            authorization.id === account.brokerage_authorization,
        );
      return authorization && authorization.brokerage;
    }
    return null;
  });

  isBlendedAccount =
    brokerages.some((brokerage: any) => brokerage.allows_trading === true) &&
    brokerages.some((brokerage: any) => brokerage.allows_trading === false);

  const triggerTradesSubmitted = () => {
    setTradesSubmitted(true);
  };

  const untriggerTradesSubmitted = () => {
    setTradesSubmitted(false);
  };

  useEffect(() => {
    if (tradesSubmitted === false) {
      setTradesCache(trades);
    }
  }, [tradesSubmitted, trades]);

  // for wealthica accounts, if user has set a hide trades for 48 hours, we check to show or hide trades
  let hideTrades = false;
  if (settings && settings.hide_trades_until !== null) {
    hideTrades = Date.parse(settings.hide_trades_until) > Date.now();
  }
  if (needToPrioritize) {
    hideTrades = true;
  }

  let buysListRender = null;
  let sellsListRender = null;

  let tradesToRender = trades;
  if (tradesSubmitted === true) {
    tradesToRender = tradesCache;
  }
  if (
    tradesToRender &&
    tradesToRender.trades.length > 0 &&
    accounts &&
    accounts.length > 0
  ) {
    const tradeRender = (trade: any) => {
      const accountName = trade.account.name;
      const allowsTrading =
        trade.account.brokerage_authorization.brokerage.allows_trading;
      return (
        <Grid columns="100px 100px 100px 2fr 1fr 100px" key={trade.id}>
          <ColumnTrades>
            <Title>Price</Title>
            <div>
              <Number
                value={trade.price}
                currency={
                  trade.account.brokerage_authorization.brokerage.name ===
                  'Unocoin'
                    ? 'INR'
                    : trade.universal_symbol.currency.code
                }
                isTrade={true}
              />
            </div>
          </ColumnTrades>
          <ColumnTrades>
            <Title>Units</Title>
            {trade.fractional_units ? (
              <div>{trade.fractional_units}</div>
            ) : (
              <div>{trade.units}</div>
            )}
          </ColumnTrades>
          <ColumnTrades>
            <Title>Amount</Title>
            <div>
              <Number
                value={parseFloat(
                  (trade.fractional_units
                    ? trade.fractional_units * trade.price
                    : trade.units * trade.price
                  ).toFixed(2),
                )}
                currency={
                  trade.account.brokerage_authorization.brokerage.name ===
                  'Unocoin'
                    ? 'INR'
                    : trade.universal_symbol.currency.code
                }
                isTrade={true}
              />
            </div>
          </ColumnTrades>
          <ColumnTrades>
            <Title>{trade.universal_symbol.description}</Title>
            <Symbol>{trade.universal_symbol.symbol}</Symbol>
          </ColumnTrades>
          <ColumnTrades>
            <Title>Account</Title>
            <div>{accountName}</div>
          </ColumnTrades>
          <div>
            {!trade.symbol_in_target && allowsTrading && (
              <Tooltip
                label={
                  "Passiv is trying to sell all units of a security that is not in the target. If you actually want to keep this security but exclude it from Passiv's calculations, you can edit your target and flag this security as an excluded asset."
                }
              >
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  size="2x"
                  color="var(--brand-orange)"
                />
              </Tooltip>
            )}
            {!allowsTrading && (
              <Tooltip
                label={
                  "Cannot place trade for this security through Passiv because your brokerage's API does not provide the trading functionality."
                }
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  size="2x"
                  color="var(--grey-darker)"
                />
              </Tooltip>
            )}
          </div>
        </Grid>
      );
    };

    const tradeListRender = (type: string, tradeList: any[]) => {
      const renderedTradeList = tradeList.map(tradeRender);
      return (
        <TradeType>
          <H3>{type}</H3>
          {renderedTradeList}
        </TradeType>
      );
    };
    let sortedTrades = tradesToRender.trades.sort(
      (a: any, b: any) => a.sequence > b.sequence,
    );
    const buysList = sortedTrades.filter(
      (trade: any) => trade.action === 'BUY',
    );
    const sellsList = sortedTrades.filter(
      (trade: any) => trade.action === 'SELL',
    );

    if (buysList.length > 0) {
      buysListRender = tradeListRender('BUY', buysList);
    }

    if (sellsList.length > 0) {
      sellsListRender = tradeListRender('SELL', sellsList);
    }
  }

  const messages: Message[] = [
    {
      name: 'route_nontradable_trades',
      content: (
        <NotificationMessage
          error={true}
          title="Important
        information about your blended portfolio"
          alwaysOpen={false}
        >
          <div>
            <P>
              This group contains a mix of tradable and non-tradable accounts.
              By default, Passiv will not recommend trades in your non-tradable
              accounts and instead use your tradable accounts to balance as well
              as possible.
            </P>
            <P>
              If you would rather receive calculated trades for your
              non-tradable accounts so that you can place the trades manually,
              you can{' '}
              <A
                onClick={() =>
                  dispatch(push(`/group/${currentGroupId}/settings`))
                }
              >
                disable this trade-routing feature in your portfolio settings
              </A>
              .
            </P>

            <HideButtonBox>
              <HideButton
                name={'route_nontradable_trades'}
                text={'I Understand'}
                xButton={false}
              />
            </HideButtonBox>
          </div>
        </NotificationMessage>
      ),
      visible:
        settings !== null &&
        settings.prevent_trades_in_non_tradable_accounts === true &&
        isBlendedAccount,
    },
    {
      name: 'no_trades',
      content: (
        <TradesContainer>
          <H2>Trades</H2>
          <NoTradesNotice>
            <P>
              There are currently no trades available on your account. This
              means that this group is as close as possible to your target,
              taking into account the rebalancing rules set for this group.
            </P>
            <SectionHeader>Other ways to increase accuracy</SectionHeader>
            <AccuracyBullets>
              <li>Deposit cash into your brokerage account.</li>
              {settings != null && settings.buy_only && (
                <li>
                  Perform a full rebalance by selling overweight assets.{' '}
                  <A
                    href="https://passiv.com/help/tutorials/how-to-allow-selling-to-rebalance"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn How
                  </A>
                </li>
              )}
            </AccuracyBullets>
          </NoTradesNotice>
          <TradesExplanation
            settings={settings}
            accounts={groupAccounts}
            container={true}
            trades={trades !== null && trades.trades}
          />
        </TradesContainer>
      ),
      visible:
        !(
          tradesSubmitted ||
          (tradesToRender && tradesToRender.trades.length && !hideTrades)
        ) &&
        !error &&
        !hideTrades,
    },
  ];

  if (
    tradesSubmitted ||
    (tradesToRender && tradesToRender.trades.length && !hideTrades)
  ) {
    return (
      <>
        <ContextualMessageMultiWrapper messages={messages} />
        <Tour steps={TradesSteps} name="trades_tour" />
        <TradesContainer className="tour-trades">
          <H2>Trades</H2>
          {sellsListRender}
          {buysListRender}
          <RebalanceWidget
            trades={trades}
            groupId={groupId}
            onClose={onClose}
            tradesTrigger={() => triggerTradesSubmitted()}
            tradesUntrigger={() => untriggerTradesSubmitted()}
          />
          <TradesExplanation
            settings={settings}
            accounts={groupAccounts}
            container={true}
          />
        </TradesContainer>
      </>
    );
  } else {
    if (!error && !hideTrades) {
      return <ContextualMessageMultiWrapper messages={messages} />;
    }
  }
  return null;
};

export default PortfolioGroupTrades;
