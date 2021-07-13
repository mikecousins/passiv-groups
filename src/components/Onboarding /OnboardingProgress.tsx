import React from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';
import { H2, H3 } from '../../styled/GlobalElements';
import Grid from '../../styled/Grid';
import { steps } from './Intro';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsMobile } from '../../selectors/browser';
import { updateOnboardingStep } from '../../actions/onboarding';
import { selectSettings } from '../../selectors';

const Container = styled.div`
  margin-bottom: 50px;
  width: 100%;
`;

const Steps = styled(Grid)`
  grid-gap: 0 !important;
  @media (max-width: 900px) {
    display: grid;
  }
`;

type StepProps = {
  active: boolean;
  done: boolean;
};

const Step = styled.div<StepProps>`
  padding: 5px 0px;
  background-color: ${(props) => (props.done ? 'var(--brand-green)' : 'white')};
  border-bottom: ${(props) => props.active && '5px solid var(--brand-green)'};
  border-right: ${(props) =>
    props.active && '5px solid rgba(100, 100, 111, 0.08)'};
  cursor: ${(props) => props.done && 'pointer'};
  h2 {
    font-weight: ${(props) => (props.active ? '900' : '400')};
    text-align: center;
  }
  div {
    font-size: 30px;
    text-align: center;
    color: white;
  }
  @media (max-width: 900px) {
    padding: 5px 15px;
  }
`;
type StepNameProps = {
  active: boolean;
};
const StepName = styled(H3)<StepNameProps>`
  font-weight: ${(props) => (props.active ? '900' : '400')};
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  letter-spacing: 1px;
  margin-top: 5px;
  @media (max-width: 900px) {
    font-size: 13px;
  }
`;

type Props = {
  currentStep: number;
};
const OnboardingProgress = ({ currentStep }: Props) => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const isMobile = useSelector(selectIsMobile);

  return (
    <Container>
      <Steps columns="1fr 1fr 1fr 1fr">
        {steps.map((step, index) => {
          const active = index + 1 === currentStep;
          const done = index + 1 < currentStep;
          return (
            <div>
              <Step
                active={active}
                done={done}
                onClick={() => {
                  if (done) {
                    dispatch(updateOnboardingStep(index + 1, settings));
                  }
                }}
              >
                {done ? (
                  <div>
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                ) : (
                  <H2>{index + 1}</H2>
                )}
              </Step>
              <StepName active={active}>
                {isMobile ? step.mobile : step.name}
              </StepName>
            </div>
          );
        })}
      </Steps>
    </Container>
  );
};

export default OnboardingProgress;
