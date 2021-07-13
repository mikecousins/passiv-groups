import React from 'react';
import ShadowBox from '../../styled/ShadowBox';
import { H1, P, A } from '../../styled/GlobalElements';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HideButton } from '../ContextualMessageWrapper';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledP = styled(P)`
  font-size: 22px;
  font-weight: 600;
`;

const SetupPrompt = () => {
  return (
    <React.Fragment>
      <ShadowBox background="#DBFCF6">
        <HideButton name={'setup_prompt'} xButton={true} />
        <H1>Setup Portfolios</H1>
        <StyledP>
          Now it's time to set targets for your portfolios. Here's how:
        </StyledP>
        <P>
          <A
            href="https://passiv.com/help/tutorials/how-to-set-up-a-target-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Guide to set up a target portfolio{' '}
            <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
          </A>
        </P>
        <P>
          <A
            href="https://player.vimeo.com/video/547476267"
            target="_blank"
            rel="noopener noreferrer"
          >
            Re-watch the Getting Started video{' '}
            <FontAwesomeIcon icon={faExternalLinkAlt} size="sm" />
          </A>
        </P>
        <P>
          If you want to make Passiv ignore one of your accounts, go to{' '}
          <Link to="/settings">Settings</Link>, scroll down to Accounts, and
          move the account to the Hidden Account section.
        </P>
      </ShadowBox>
    </React.Fragment>
  );
};

export default SetupPrompt;
