import styled from '@emotion/styled';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { push } from 'connected-react-router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPathname } from '../../selectors/router';
import { Button } from '../../styled/Button';
import { H1, P } from '../../styled/GlobalElements';
import { TutorialLink } from '../Accounts/index';

const AlmostDone = styled(P)`
  font-weight: bold;
  font-size: 24px;
  line-height: 150%;
  letter-spacing: 0.2px;
`;

const Tutorial = styled(TutorialLink)`
  margin-top: 20px;
`;

const SetupPortfolios = () => {
  const dispatch = useDispatch();
  const pathName = useSelector(selectPathname);

  return (
    <div>
      <H1>Setup Portfolios</H1>
      {pathName.includes('welcome') ? (
        <>
          <AlmostDone>
            You’re almost there! Let's take you to dashboard now to setup your
            targets.
          </AlmostDone>
          <Button onClick={() => dispatch(push('/dashboard'))}>
            Take me to dashboard
          </Button>
        </>
      ) : (
        <>
          <AlmostDone>
            To start using Passiv, setup your target porfolios by click on the
            orange Setup button.
          </AlmostDone>
          <P>Not sure how? Follow our tutorials to get the ball rolling!</P>
          <Tutorial>
            <a
              href="https://passiv.com/help/tutorials/how-to-set-up-a-target-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              Learn How to Set up a Target Portfolio{' '}
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </Tutorial>
        </>
      )}
    </div>
  );
};

export default SetupPortfolios;
