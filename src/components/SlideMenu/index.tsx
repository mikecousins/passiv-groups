import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import MenuButton from './MenuButton';
import Menu from './Menu';
import { selectIsMobile } from '../../selectors/browser';
import { selectPathname } from '../../selectors/router';
import { selectOnboardingStep } from '../../selectors';

const StyledSlideMenu = styled.div`
  position: relative;
  top: 0;
  left: 0;
  z-index: 5;
  min-height: 100vh;
`;

export const SlideMenu = () => {
  const isMobile = useSelector(selectIsMobile);
  const pathname = useSelector(selectPathname);
  const onboardingStep = useSelector(selectOnboardingStep);
  const [visible, setVisible] = useState(!isMobile);
  const [oldPath, setPath] = useState(pathname);

  useEffect(() => {
    if (!isMobile) {
      // hide side bar if user is on the onboarding process
      if (
        ((pathname === '/welcome' ||
          pathname === '/connect/open' ||
          pathname.includes('oauth') ||
          pathname === '/questrade-offer') &&
          onboardingStep !== undefined &&
          onboardingStep <= 4) ||
        pathname.includes('shared-model-portfolio')
      ) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    }
  }, [pathname, onboardingStep, isMobile]);

  if (pathname === '/quick-trade') {
    return <></>;
  }

  // check our path to see if it's changed
  // if it has and we're on mobile, close the menu
  if (isMobile && oldPath !== pathname) {
    setPath(pathname);
    setVisible(false);
  }

  if (oldPath !== pathname && pathname === '/demo') {
    setPath(pathname);
    setVisible(false);
  }

  return (
    <StyledSlideMenu>
      <MenuButton
        menuVisibility={visible}
        handleMouseDown={() => setVisible(!visible)}
      />
      <Menu menuVisibility={visible} />
    </StyledSlideMenu>
  );
};

export default SlideMenu;
