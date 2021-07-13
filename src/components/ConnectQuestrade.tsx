import React from 'react';
import { useSelector } from 'react-redux';
import { selectBrokerages } from '../selectors';
import ShadowBox from '../styled/ShadowBox';
import {
  H1DarkStyle,
  H2DarkStyle,
  PDarkStyle,
} from '../pages/AuthorizationPage';
import { HideButton } from './ContextualMessageWrapper';
import AuthorizationPicker from './AuthorizationPicker';
import { H3 } from '../styled/GlobalElements';
import styled from '@emotion/styled';
import { Brokerage } from '../types/brokerage';

export const Order = styled.div`
  text-align: center;
  select {
    padding: 10px;
    margin: 12px 0;
  }
`;

export const LeftOrder = styled(Order)`
  text-align: left;
`;

type Props = {
  type?: string;
  brokerage?: Brokerage;
  align?: string;
  isDemo?: boolean;
  name?: string;
  hideTitle?: boolean;
};

const NewConnection = ({
  type,
  brokerage,
  align,
  isDemo,
  name,
  hideTitle,
}: Props) => {
  const picker = (
    <React.Fragment>
      {!hideTitle && <H3>Update/Refresh Connection</H3>}
      <AuthorizationPicker
        allowSelectBrokerage={false}
        brokerage={brokerage && brokerage.id}
        allowSelectType={false}
        type={type}
        name={name}
        isDemo={isDemo}
      />
    </React.Fragment>
  );
  if (align && align === 'left') {
    return <LeftOrder>{picker}</LeftOrder>;
  } else {
    return <Order>{picker}</Order>;
  }
};

const ConnectQuestrade = () => {
  const brokerages = useSelector(selectBrokerages);
  const questrade =
    brokerages &&
    brokerages.find((brokerage) => brokerage.slug === 'QUESTRADE');

  return (
    <React.Fragment>
      <ShadowBox background="#2a2d34">
        <H1DarkStyle>Connect your Questrade account</H1DarkStyle>
        <H2DarkStyle>
          Passiv offers a real-time data connection to Questrade.
        </H2DarkStyle>
        <PDarkStyle>
          By linking your Questrade account to Passiv, you will receive Passiv
          Elite at no cost and gain the ability to place trades with a single
          click.
        </PDarkStyle>
        <NewConnection
          brokerage={questrade}
          type={'read'}
          hideTitle={true}
          name="Connect"
          align="left"
        />
        <HideButton name={'connect_questrade'} xButton={false} />
      </ShadowBox>
    </React.Fragment>
  );
};

export default ConnectQuestrade;
