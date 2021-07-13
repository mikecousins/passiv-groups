import styled from '@emotion/styled';
import { push } from 'connected-react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectHasQuestradeConnection, selectSettings } from '../../selectors';
import { selectIsPaid } from '../../selectors/subscription';
import { Button } from '../../styled/Button';
import { H1, H2, P } from '../../styled/GlobalElements';
import Grid from '../../styled/Grid';
import ShadowBox from '../../styled/ShadowBox';
import { Description } from './Intro';
import { BackBtn } from '../../pages/AuthorizationPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { updateOnboardingStep } from '../../actions/onboarding';

const Cards = styled(Grid)`
  margin-top: 40px;
`;

const Card = styled(ShadowBox)`
  padding: 0;
  @media (max-width: 900px) {
    padding: 0px;
  }
`;

type HeaderProps = {
  type: string;
};

const Header = styled.div<HeaderProps>`
  background-color: ${(props) =>
    props.type === 'elite' ? 'var(--brand-green)' : '#2a2d34'};
  color: white;
  text-align: center;
  padding: 15px 10px 20px;
  border-radius: 4px 4px 0px 0px;
  h2 {
    color: white;
    text-align: center;
    margin-bottom: 10px;
  }
  span {
    font-size: 20px;
    font-weight: bold;
  }
  p {
    margin-top: 10px;
    font-size: 18px;
  }
`;

const PlanDetails = styled.ul`
  padding: 40px 32px;
  line-height: 3em;
  li {
    position: relative;
    padding-left: 20px;
    ::after {
      content: '✓';
      position: absolute;
      left: 0;
    }
  }
  .not-active {
    color: grey;
    ::after {
      display: none;
    }
  }
`;

const ButtonContainer = styled.div`
  text-align: center;
  button {
    margin: 20px 0px;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.02em;
    padding: 17px 62px 15px;
  }
`;

const Skip = styled.div`
  text-align: right;
  button {
    color: var(--brand-blue);
    font-weight: 600;
  }
`;

const ChooseMembership = () => {
  const dispatch = useDispatch();
  const hasQuestradeConnection = useSelector(selectHasQuestradeConnection);
  const isPaid = useSelector(selectIsPaid);
  const settings = useSelector(selectSettings);

  const questradeOffer = hasQuestradeConnection && !isPaid;

  const Features = [
    'Automated calculations',
    'Cash & dividend notifications',
    'Keep stock picks separate',
    'Multi-account portfolios',
    'Connect multiple brokerage logins',
    'One-click trades',
    'Advanced currency handling',
    'Create tax-efficient portfolios',
  ];

  return (
    <div>
      <H1>
        {questradeOffer ? 'Congratulations!!' : 'Choose your membership level'}
      </H1>
      <Description>
        {questradeOffer ? (
          <div>
            You are eligible for a <strong>FREE</strong> upgrade to Passiv Elite
            with your Questrade account!
          </div>
        ) : (
          'As a Passiv user you can choose between two membership options, Passiv Community and Passiv Elite. Community users can access Passiv for free whereas, Elite users get access to one-click trades as well as all of the other Passiv Elite features.'
        )}
      </Description>
      <Cards columns="3fr 3fr">
        <Card>
          <Header type="community">
            <H2> Community User </H2>
            <span>$0/month</span>
            <P>Free Forever </P>
          </Header>
          <PlanDetails>
            {Features.map((feature, index) => {
              return (
                <li className={index > 4 ? 'not-active' : ''}>{feature}</li>
              );
            })}
          </PlanDetails>
        </Card>
        <Card>
          <Header type="elite">
            <H2>Elite Member</H2>
            <span>$99/year</span>
            <P>$0 for Questrade Clients*</P>
          </Header>
          <PlanDetails>
            {Features.map((feature) => {
              return <li>{feature}</li>;
            })}
          </PlanDetails>
          {!isPaid && (
            <ButtonContainer>
              <Button
                onClick={() =>
                  dispatch(
                    push(
                      questradeOffer
                        ? '/questrade-offer?onboarding=true'
                        : '/settings',
                    ),
                  )
                }
              >
                {questradeOffer ? 'Get Elite For Free' : 'Get Elite'}
              </Button>
            </ButtonContainer>
          )}
        </Card>
      </Cards>
      <BackBtn onClick={() => dispatch(updateOnboardingStep(1, settings))}>
        <FontAwesomeIcon icon={faLongArrowAltLeft} /> Go Back
      </BackBtn>
      <Skip>
        <button onClick={() => dispatch(updateOnboardingStep(3, settings))}>
          Skip for now
        </button>
      </Skip>
    </div>
  );
};

export default ChooseMembership;
