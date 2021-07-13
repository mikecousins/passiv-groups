import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import OnboardingProgress from './OnboardingProgress';
import Intro from './Intro';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsAuthorized,
  selectOnboardingStep,
  selectSettings,
} from '../../selectors';
import AuthorizationPage from '../../pages/AuthorizationPage';
import { selectRouter } from '../../selectors/router';
import Accounts from '../Accounts/index';
import SetupPortfolios from './SetupPortfolios';
import OnboardingFinished from './OnboardingFinished';
import ChooseMembership from './ChooseMembership';
import { putData } from '../../api';
import { selectDashboardGroups } from '../../selectors/groups';
import { HideButton } from '../ContextualMessageWrapper';
import { updateOnboardingStep } from '../../actions/onboarding';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  padding: 20px 20px 0px 20px;
`;

const Onboarding = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const groups = useSelector(selectDashboardGroups);
  const onboardingStep = useSelector(selectOnboardingStep);
  const router = useSelector(selectRouter);
  const isAuthorized = useSelector(selectIsAuthorized);

  const [step, setStep] = useState(
    onboardingStep !== undefined ? onboardingStep : 0,
  );

  const anySetupRemaining = groups
    .map((group) => group.setupComplete)
    .some((currentValue: any) => currentValue === false);

  useEffect(() => {
    if (step > 1 && !isAuthorized) {
      putData('/api/v1/contextualMessages', {
        name: ['onboarding_dashboard'],
      }).then(() => {
        dispatch(updateOnboardingStep(0, settings));
      });
    }
    if (isAuthorized) {
      //  current step is 4 and when no setup is remaining, change it to be the finished step
      if (step === 4 && !anySetupRemaining) {
        dispatch(updateOnboardingStep(5, settings));
      }
      // if current step is 5 but any setup is remaining, change the step to be 4
      if (step === 5 && anySetupRemaining) {
        dispatch(updateOnboardingStep(4, settings));
      }
    }

    if (onboardingStep !== undefined) {
      setStep(onboardingStep);
    }
    // eslint-disable-next-line
  }, [router.location.query.step, onboardingStep, groups]);

  return (
    <Container>
      {Onboarding === undefined ? (
        <FontAwesomeIcon icon={faSpinner} size="lg" />
      ) : (
        <>
          {step === 5 && (
            <HideButton name={'onboarding_dashboard'} xButton={true} />
          )}
          <OnboardingProgress currentStep={step} />
          <React.Fragment>
            {step === 0 && <Intro />}
            {step === 1 && <AuthorizationPage onboarding={true} />}
            {step === 2 && <ChooseMembership />}
            {step === 3 && <Accounts />}
            {step === 4 && <SetupPortfolios />}
            {step === 5 && <OnboardingFinished />}
          </React.Fragment>
        </>
      )}
    </Container>
  );
};

export default Onboarding;
