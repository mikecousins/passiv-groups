import React from 'react';
import styled from '@emotion/styled';
import { Button } from '../../styled/Button';
import { H1, H3, P } from '../../styled/GlobalElements';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingStep } from '../../actions/onboarding';
import { selectSettings } from '../../selectors';

const Container = styled.div`
  > h1 {
    line-height: 57px;
  }

  iframe {
    padding: 30px 0px;
  }
`;

export const Description = styled(P)`
  font-size: 20px;
`;

const Steps = styled.div`
  margin: 50px 0px;
`;

const Step = styled.div`
  margin-bottom: 28px;
  span {
    margin-right: 20px;
    background-color: white;
    padding: 2px 8px;
    border-radius: 3rem;
  }
  p {
    margin-left: 46px;
  }
`;

const Intro = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  return (
    <Container>
      <H1>Welcome to Passiv</H1>
      <Description>Let's get you set up!</Description>
      <Steps>
        {steps.map((step, index) => {
          return (
            <Step>
              <H3>
                <span>{index + 1}</span>
                {step.name}
              </H3>
              <P>{step.description}</P>
            </Step>
          );
        })}
      </Steps>
      <Description>That’s all! Start growing your nest egg now!</Description>
      <Button onClick={() => dispatch(updateOnboardingStep(1, settings))}>
          Get Started
      </Button>

      {/* <ScalingIFrame
        title="Passiv Basics"
        width="995"
        height="627"
        src="https://player.vimeo.com/video/547476267"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      ></ScalingIFrame> */}
    </Container>
  );
};

export default Intro;

export const steps = [
  {
    name: 'Connect Brokerage',
    mobile: 'Connect',
    description:
      'It’s easy! You will be redirected to login to your brokerage of choice.',
  },
  {
    name: 'Choose Membership',
    mobile: 'Membership',
    description:
      'Starting at $0 for Life, choose the package that is right for you!',
  },
  {
    name: 'Organize Accounts',
    mobile: 'Organize',
    description:
      'Group your investment accounts by dragging and dropping them into portfolios.',
  },
  {
    name: 'Set Targets',
    mobile: 'Setup',
    description: 'Not sure how? That’s ok! We will guide you.',
  },
];
