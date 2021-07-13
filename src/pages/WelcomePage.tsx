import React from 'react';
import ShadowBox from '../styled/ShadowBox';
import Onboarding from '../components/Onboarding ';

const WelcomePage = () => {
  return (
    <ShadowBox background="var(--brand-light-green)">
      <Onboarding />
    </ShadowBox>
  );
};

export default WelcomePage;
