import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRouter } from '../selectors/router';
import styled from '@emotion/styled';
import { postData } from '../api';
import { loadSubscription } from '../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faExternalLinkAlt,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { H1, P } from '../styled/GlobalElements';
import { Error } from '../types/groupInfo';
import { Button } from '../styled/Button';
import { push } from 'connected-react-router';
import PreLoadLink from '../components/PreLoadLink';
import { CONTACT_FORM_PATH } from '../apps/Paths';
import { Container, ExclamationIcon, Star } from './BrokeragesOauthPage';
import { TutorialLink } from '../components/Accounts';
import OnboardingProgress from '../components/Onboarding /OnboardingProgress';
import { updateOnboardingStep } from '../actions/onboarding';
import { selectSettings } from '../selectors';

const Bold = styled.span`
  font-weight: 600;
`;

const AButtonBox = styled.div`
  p {
    padding-top: 30px;
  }
`;

const UpgradeOfferPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [success, setSuccess] = useState(false);
  const router = useSelector(selectRouter);
  const settings = useSelector(selectSettings);
  const isOnboarding = router.location.query.onboarding;

  useEffect(() => {
    postData('/api/v1/offer/', {})
      .then(() => {
        dispatch(loadSubscription());
        setTimeout(() => {
          setLoading(false);
          setSuccess(true);
        }, 2000);
      })
      .catch((error) => {
        dispatch(loadSubscription());
        setTimeout(() => {
          setLoading(false);
          setError(error.response.data);
        }, 2000);
      });
  }, [dispatch]);

  let errorMessage = null;

  if (error) {
    switch (error.code) {
      case '1038':
        errorMessage = (
          <React.Fragment>
            <P>
              This offer is only available to Questrade customers, and you don't
              have a Questrade account linked to Passiv. Just connect your
              account and come back here to claim the offer!
            </P>
            <div>
              <Button onClick={() => dispatch(push('/settings/connect'))}>
                Connect Questrade
              </Button>
            </div>
            <AButtonBox>
              <P>
                Don't have a Questrade account yet? Open one using this link and
                you'll be eligible to claim this offer!
              </P>
              <TutorialLink>
                <a
                  href="https://www.questrade.com/account-selection?oaa_promo=passiv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open a Questrade Account{' '}
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              </TutorialLink>
            </AButtonBox>
          </React.Fragment>
        );
        break;
      case '1039':
        errorMessage = (
          <React.Fragment>
            <P>
              Sorry, this offer is only available to Questrade customers who do
              not already have a Passiv Elite subscription.
            </P>
            <Button onClick={() => dispatch(push('/dashboard'))}>
              Go to Dashboard
            </Button>
          </React.Fragment>
        );
        break;
      default:
        errorMessage = (
          <P>
            We hit a problem while trying to upgrade your account. Please try
            again later or{' '}
            <PreLoadLink path={CONTACT_FORM_PATH}>contact support</PreLoadLink>{' '}
            if this persists.
          </P>
        );
        break;
    }
  }

  let result = null;

  if (loading) {
    result = (
      <H1>
        We're upgrading your account, hang tight!{' '}
        <FontAwesomeIcon icon={faSpinner} spin />
      </H1>
    );
  } else if (success) {
    result = (
      <div>
        <Star></Star>
        <H1>You are now an Elite member</H1>
        <P>
          You're good to go! You will have <Bold>FREE</Bold> access to Passiv
          Elite as long as your Questrade account is connected to Passiv.
        </P>
        <Button
          onClick={() => {
            if (isOnboarding) {
              dispatch(updateOnboardingStep(3, settings));
              setTimeout(() => {
                dispatch(push('/welcome'));
              }, 200);
            } else {
              dispatch(push('/dashboard'));
            }
          }}
        >
          {isOnboarding ? 'Next Step' : 'Go to Dashboard'}
        </Button>
      </div>
    );
  } else {
    result = (
      <React.Fragment>
        <ExclamationIcon>
          <FontAwesomeIcon icon={faExclamationTriangle} color="orange" />
        </ExclamationIcon>
        <H1>Oops, we couldn't apply the offer to your account!</H1>
        {errorMessage}
      </React.Fragment>
    );
  }
  return (
    <Container>
      {isOnboarding && <OnboardingProgress currentStep={2} />}
      {result}
    </Container>
  );
};

export default UpgradeOfferPage;
