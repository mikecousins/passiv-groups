import React from 'react';
import {
  faEyeSlash,
  faTimes,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';
import SymbolSelector from './SymbolSelector';
import Number from '../../Number';
import { SymbolDetail } from '../../SymbolDetail';
import {
  BarsContainer,
  InputContainer,
  Symbol,
  TargetRow,
  Actual,
  Target,
  Bar,
  BarTarget,
  BarActual,
  Container,
  Close,
} from '../../../styled/Target';
import { ToggleButton } from '../../../styled/ToggleButton';
import Tooltip from '../../Tooltip';

const Disabled = styled.div`
  opacity: 0.5;
`;

const ToggleBox = styled.div`
  padding-left: 30px;
  padding-right: 30px;
`;

const ActualBox = styled.div`
  padding-right: 30px;
`;

type Props = {
  target: any;
  children: JSX.Element;
  setSymbol: (symbol: any) => void;
  edit: boolean;
  onDelete: (key: string) => void;
  onExclude: (key: string) => void;
};

const TargetBar = ({
  target,
  children,
  setSymbol,
  edit,
  onDelete,
  onExclude,
}: Props) => {
  const {
    key,
    is_excluded,
    is_supported,
    fullSymbol,
    actualPercentage,
    percent,
    symbol,
  } = target;

  let renderActualPercentage = null;
  if (actualPercentage === undefined) {
    renderActualPercentage = 0;
  } else {
    renderActualPercentage = actualPercentage;
  }

  let renderTargetPercentage = null;
  if (percent === undefined) {
    renderTargetPercentage = 0;
  } else {
    renderTargetPercentage = percent;
  }

  const deleteButton = (
    <Close type="button" onClick={() => onDelete(key)}>
      <FontAwesomeIcon icon={faTimes} />{' '}
    </Close>
  );

  let excludedBar = null;
  if (is_supported) {
    excludedBar = (
      <React.Fragment>
        {edit && deleteButton}
        <FontAwesomeIcon icon={faEyeSlash} />
      </React.Fragment>
    );
  } else {
    excludedBar = (
      <React.Fragment>
        <Disabled>
          <FontAwesomeIcon icon={faEyeSlash} />
        </Disabled>
      </React.Fragment>
    );
  }

  return (
    <Container>
      {!is_excluded ? (
        <React.Fragment>
          <BarsContainer>
            <BarActual>
              {percent > 100 ? (
                <Bar style={{ width: '100%', backgroundColor: 'red' }}>
                  Warning: allocation cannot be over 100%
                </Bar>
              ) : percent < 0 ? (
                <Bar style={{ width: '100%', backgroundColor: 'red' }}>
                  Warning: allocation cannot be negative!
                </Bar>
              ) : (
                <Bar style={{ width: `${renderActualPercentage}%` }}> </Bar>
              )}
            </BarActual>
            {!(actualPercentage === undefined) && (
              <BarTarget>
                <Bar style={{ width: `${percent}%` }}> </Bar>
              </BarTarget>
            )}
          </BarsContainer>
          {edit && deleteButton}
        </React.Fragment>
      ) : (
        excludedBar
      )}
      <TargetRow style={{ flexWrap: 'wrap' }}>
        <Symbol>
          {!(typeof symbol == 'string') && !is_excluded ? (
            <SymbolSelector value={fullSymbol} onSelect={setSymbol} />
          ) : is_supported ? (
            <SymbolDetail symbol={fullSymbol} />
          ) : (
            <Disabled>{fullSymbol.symbol}</Disabled>
          )}
        </Symbol>
        {!is_excluded && (
          <React.Fragment>
            {edit ? (
              <Target>
                <InputContainer>{children}%</InputContainer>
              </Target>
            ) : (
              <Target>
                <Number
                  value={renderTargetPercentage}
                  percentage
                  decimalPlaces={1}
                />
              </Target>
            )}

            <ActualBox>
              <Actual>
                <Number
                  value={renderActualPercentage}
                  percentage
                  decimalPlaces={1}
                />
              </Actual>
            </ActualBox>
          </React.Fragment>
        )}

        {edit && (
          <ToggleBox>
            <ToggleButton
              disabled={!is_supported}
              type="button"
              onClick={() => onExclude(key)}
            >
              <Tooltip
                label={
                  is_supported
                    ? 'Exclude this asset from your portfolio calculations'
                    : 'This security is not supported by Passiv'
                }
              >
                {is_excluded ? (
                  <FontAwesomeIcon icon={faToggleOn} />
                ) : (
                  <FontAwesomeIcon icon={faToggleOff} />
                )}
              </Tooltip>
            </ToggleButton>
          </ToggleBox>
        )}
      </TargetRow>
    </Container>
  );
};

export default TargetBar;
