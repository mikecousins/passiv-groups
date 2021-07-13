import styled from '@emotion/styled';
import React from 'react';
import { H1, P } from '../../styled/GlobalElements';
import Grid from '../../styled/Grid';
import { TutorialLink } from '../Accounts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import onboardingTrophy from '../../assets/images/onboardingTrophy.png';
import manageAccountsIcon from '../../assets/images/manage-accounts-icon.svg';
import referFriendIcon from '../../assets/images/refer-icon.svg';
import reportsIcon from '../../assets/images/reports-icon.svg';
import shareModelIcon from '../../assets/images/share-model-icon.svg';

const Container = styled.div`
  * {
    text-align: center;
  }
  h1 {
    font-size: 44px;
    line-height: 57px;
    letter-spacing: 0.44px;
    margin-bottom: 20px;
    @media (max-width: 900px) {
      font-size: 34px;
    }
  }
  p {
    font-size: 24px;
    line-height: 150%;
    letter-spacing: 0.2px;
    @media (max-width: 900px) {
      font-size: 22px;
    }
  }
`;

const TrophyImage = styled.div`
  background: url(${onboardingTrophy}) no-repeat;
  background-size: contain;
  width: 150px;
  height: 200px;
  margin: 0 auto;
  margin-bottom: 20px;
  @media (max-width: 900px) {
    width: 100px;
    height: 150px;
  }
`;

const TopFeatures = styled(Grid)`
  margin-top: 40px;
`;

const Feature = styled.div`
  @media (max-width: 900px) {
    margin-bottom: 50px;
  }
`;

type FeatureIconType = {
  image: string;
};
const FeatureIcon = styled.div<FeatureIconType>`
  background: url(${(props) => props.image}) no-repeat;
  background-size: contain;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  margin-bottom: 5px;
  @media (max-width: 900px) {
    width: 100px;
    height: 80px;
  }
`;

const OnboardingFinished = () => {
  return (
    <Container>
      <TrophyImage></TrophyImage>
      <H1>Congratulations, you are ready to go!</H1>
      <P>Some cool things to look forward to using Passiv</P>
      <TopFeatures columns="repeat(4, 1fr)">
        <Feature>
          <FeatureIcon image={shareModelIcon}></FeatureIcon>
          <P>Create & share Model Portfolios</P>
        </Feature>
        <Feature>
          <FeatureIcon image={reportsIcon}></FeatureIcon>
          <P>Detailed & customizable reports </P>
        </Feature>
        <Feature>
          <FeatureIcon image={referFriendIcon}></FeatureIcon>
          <P>Refer a friend & earn money</P>
        </Feature>
        <Feature>
          <FeatureIcon image={manageAccountsIcon}></FeatureIcon>
          <P>Manage multiple accounts</P>
        </Feature>
      </TopFeatures>
      <TutorialLink>
        <a
          href="https://passiv.com/tutorials/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check Tips & Tricks <FontAwesomeIcon icon={faExternalLinkAlt} />
        </a>
      </TutorialLink>
    </Container>
  );
};

export default OnboardingFinished;
