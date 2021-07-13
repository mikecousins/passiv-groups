import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faSort,
  faSortUp,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { Title } from '../styled/GlobalElements';
import Number from './Number';
import { selectCurrencies } from '../selectors/currencies';
import ShadowBox from '../styled/ShadowBox';
import { SymbolDetail } from './SymbolDetail';
import { selectCurrencyRates } from '../selectors';
import {
  AccountHoldings as AccountHoldingsType,
  selectPreferredCurrency,
} from '../selectors/groups';
import { Position } from '../types/account';
import NotAvailable from './NotAvailable';

export const FontAwesomeIconDisabled = styled(FontAwesomeIcon)`
  opacity: 0.4;
`;

export const HoldingsTable = styled.table`
  width: 100%;
  text-align: center;
  margin: 0 0 20px 0;
  th {
    text-align: center;
    border-bottom: 1px solid #e5e5e5;
    padding: 15px 12px 5px;
  }
  th:first-of-type {
    border-bottom: none;
  }
  tr th,
  tr td {
    @media (min-width: 900px) {
      width: 12%;
    }
  }
  tr th:first-of-type,
  tr td:first-of-type {
    text-align: left;
    @media (min-width: 900px) {
      width: 52%;
    }
  }
  tr td:first-of-type {
    font-weight: 700;
  }
  tr th:last-of-type,
  tr td:last-of-type {
    text-align: right;
  }
  td {
    padding: 15px 12px;
    &:first-of-type {
      padding: 15px 0;
    }
  }
  tbody tr:nth-oftype(even) {
    background: #f4f4f4;
  }
  @media (max-width: 900px) {
    thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    tr {
      border-bottom: 3px solid #ddd;
      display: block;
      margin-bottom: 20px;
    }

    tr td {
      display: block;
      text-align: right;
      padding: 15px 0px;
      &:first-of-type {
        text-align: center;
      }
      span {
        display: block;
      }
    }

    td::before {
      /*
      * aria-label has no advantage, it won't be read inside a table
      content: attr(aria-label);
      */
      content: attr(data-label);
      float: left;
      font-weight: bold;
      text-transform: uppercase;
    }

    td:last-of-type {
      border-bottom: 0;
    }
  }
`;

const HoldingsBox = styled.div`
  @media (min-width: 900px) {
    margin-top: 20px;
  }
`;

const CurrencyCodeBox = styled.span``;

type Props = {
  holdings: AccountHoldingsType | null;
};

export const AccountHoldings = ({ holdings }: Props) => {
  const currencies = useSelector(selectCurrencies);
  const preferredCurrency = useSelector(selectPreferredCurrency);
  const currencyRates = useSelector(selectCurrencyRates);
  const [sortKey, setSortKey] = useState<string>('value');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const convertCurrencyToPreferred = (value: number, src: string): number => {
    const conversionRate =
      currencyRates &&
      currencyRates.find(
        (rate) =>
          preferredCurrency &&
          rate.src.id === src &&
          rate.dst.id === preferredCurrency.id,
      );

    return conversionRate ? value * conversionRate.exchange_rate : value;
  };

  if (!holdings) {
    return <FontAwesomeIcon icon={faSpinner} spin />;
  }

  const hasOpenPnl =
    holdings &&
    holdings.positions &&
    holdings.positions.some((position) => position.open_pnl !== null);

  const getCurrencyById = (currencyId: string) => {
    return (
      currencies && currencies.find((currency) => currencyId === currency.id)
    );
  };

  const multiplier = sortAsc ? -1 : 1;

  const headers = [
    {
      id: 'name',
      name: 'Ticker',
      show: true,
      sortable: true,
      sortFunc: (a: Position, b: Position): number => {
        let result = 1;
        if (b.symbol.symbol.symbol < a.symbol.symbol.symbol) {
          result = 1;
        } else {
          result = -1;
        }
        if (sortAsc) {
          return result;
        } else {
          return -result;
        }
      },
    },
    {
      id: 'units',
      name: 'Units',
      show: true,
      sortable: true,
      sortFunc: (a: Position, b: Position): number => {
        if (a.fractional_units && b.fractional_units) {
          return multiplier * (b.fractional_units - a.fractional_units);
        } else if (a.fractional_units) {
          return multiplier * (b.units - a.fractional_units);
        } else if (b.fractional_units) {
          return multiplier * (b.fractional_units - a.units);
        } else {
          return multiplier * (b.units - a.units);
        }
      },
    },
    {
      id: 'price',
      name: 'Price',
      show: true,
      sortable: true,
      sortFunc: (a: Position, b: Position): number => {
        const aPreferred = convertCurrencyToPreferred(
          a.price,
          a.currency ? a.currency.id : a.symbol.symbol.currency,
        );
        const bPreferred = convertCurrencyToPreferred(
          b.price,
          b.currency ? b.currency.id : b.symbol.symbol.currency,
        );
        return multiplier * (bPreferred - aPreferred);
      },
    },
    {
      id: 'value',
      name: 'Value',
      show: true,
      sortable: true,
      sortFunc: (a: Position, b: Position): number => {
        let aPreferred = 0;
        let bPreferred = 0;

        if (a.fractional_units && b.fractional_units) {
          aPreferred =
            convertCurrencyToPreferred(
              a.price,
              a.currency ? a.currency.id : a.symbol.symbol.currency,
            ) * a.fractional_units;
          bPreferred =
            convertCurrencyToPreferred(
              b.price,
              b.currency ? b.currency.id : b.symbol.symbol.currency,
            ) * b.fractional_units;
        } else if (a.fractional_units) {
          aPreferred =
            convertCurrencyToPreferred(
              a.price,
              a.currency ? a.currency.id : a.symbol.symbol.currency,
            ) * a.fractional_units;
          bPreferred =
            convertCurrencyToPreferred(
              b.price,
              b.currency ? b.currency.id : b.symbol.symbol.currency,
            ) * b.units;
        } else if (b.fractional_units) {
          aPreferred =
            convertCurrencyToPreferred(
              a.price,
              a.currency ? a.currency.id : a.symbol.symbol.currency,
            ) * a.units;
          bPreferred =
            convertCurrencyToPreferred(
              b.price,
              b.currency ? b.currency.id : b.symbol.symbol.currency,
            ) * b.fractional_units;
        } else {
          aPreferred =
            convertCurrencyToPreferred(
              a.price,
              a.currency ? a.currency.id : a.symbol.symbol.currency,
            ) * a.units;
          bPreferred =
            convertCurrencyToPreferred(
              b.price,
              b.currency ? b.currency.id : b.symbol.symbol.currency,
            ) * b.units;
        }

        return multiplier * (bPreferred - aPreferred);
      },
    },
    {
      id: 'open_pnl',
      name: 'Open P&L',
      show: hasOpenPnl,
      sortable: true,
      sortFunc: (a: Position, b: Position): number => {
        const aPreferred = convertCurrencyToPreferred(
          a.open_pnl,
          a.currency ? a.currency.id : a.symbol.symbol.currency,
        );
        const bPreferred = convertCurrencyToPreferred(
          b.open_pnl,
          b.currency ? b.currency.id : b.symbol.symbol.currency,
        );
        return multiplier * (bPreferred - aPreferred);
      },
    },
    {
      id: 'currency',
      name: 'Currency',
      show: true,
      sortable: false,
    },
  ];

  const currentHeader = headers.find((header) => header.id === sortKey);

  let sortedPositions = holdings.positions && holdings.positions;

  currentHeader &&
    sortedPositions != null &&
    sortedPositions.sort(currentHeader.sortFunc);

  const triggerSort = (key: string) => {
    if (key !== sortKey) {
      setSortKey(key);
    } else {
      setSortAsc(!sortAsc);
    }
  };

  const renderedPositions = sortedPositions?.map((position: Position) => {
    const currency = getCurrencyById(
      position.currency
        ? position.currency.id
        : position.symbol.symbol.currency,
    );
    return (
      <tr key={position.symbol.id}>
        <td>
          <SymbolDetail symbol={position.symbol.symbol} />
        </td>
        <td data-label="Units">
          {position.fractional_units
            ? position.fractional_units
            : position.units}
        </td>
        <td data-label="Price">
          <Number
            value={position.price}
            currency={currency ? currency.code : undefined}
          />
        </td>
        <td data-label="Value">
          <Number
            value={
              position.price *
              (position.fractional_units
                ? position.fractional_units
                : position.units)
            }
            currency={currency ? currency.code : undefined}
          />
        </td>
        {hasOpenPnl && (
          <td data-label="Open P&L">
            <Number
              value={position.open_pnl}
              currency={currency ? currency.code : undefined}
            />
          </td>
        )}
        <td data-label="Currency">
          <CurrencyCodeBox title={currency ? currency.name : ''}>
            {currency && currency.code}
          </CurrencyCodeBox>
        </td>
      </tr>
    );
  });

  const headersRender = (
    <HoldingsTable>
      <thead>
        <tr>
          {headers.map((header) => {
            if (header.show === false) {
              return null;
            } else {
              const sortIcon =
                sortKey === header.id ? (
                  <FontAwesomeIcon icon={sortAsc ? faSortUp : faSortDown} />
                ) : (
                  <FontAwesomeIconDisabled icon={faSort} />
                );
              if (header.sortable) {
                return (
                  <th key={header.id}>
                    <Title onClick={() => triggerSort(header.id)}>
                      {header.name}&nbsp;{sortIcon}
                    </Title>
                  </th>
                );
              } else {
                return (
                  <th key={header.id}>
                    <Title>{header.name}</Title>
                  </th>
                );
              }
            }
          })}
        </tr>
      </thead>
      <tbody>{renderedPositions}</tbody>
    </HoldingsTable>
  );

  return (
    <ShadowBox>
      <HoldingsBox>
        {holdings.positions && holdings.positions.length > 0 ? (
          headersRender
        ) : (
          <NotAvailable message="There are no open positions in this account." />
        )}
      </HoldingsBox>
    </ShadowBox>
  );
};

export default AccountHoldings;
