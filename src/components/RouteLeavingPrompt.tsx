import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  faExclamationTriangle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dialog from '@reach/dialog';
import { Location } from 'history';
import { Prompt } from 'react-router-dom';
import { Button } from '../styled/Button';
import { H1 } from '../styled/GlobalElements';
import {
  ActionContainer,
  DeleteBtn,
  H2Margin,
} from './ModelAssetClass/AssetClass';

const Warning = styled.div`
  margin: 5px 0px;
  h1 {
    text-align: center;
  }
  svg {
    color: var(--brand-orange);
  }
`;
interface Props {
  when?: boolean | undefined;
  navigate: (path: string) => void;
  prioritiesPage?: boolean;
}

const RouteLeavingPrompt = ({ when, navigate, prioritiesPage }: Props) => {
  const [dialog, setDialog] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (confirm && lastLocation) {
      // Navigate to the previous blocked location
      navigate(lastLocation.pathname);
    }
    // eslint-disable-next-line
  }, [confirm, lastLocation]);

  const handleBlockedNavigation = (nextLocation: any, action: any) => {
    if (!confirm && action !== 'REPLACE') {
      setDialog(true);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  };
  const handleConfirmNavigationClick = () => {
    setDialog(false);
    setConfirm(true);
  };

  const warningMessage =
    'You have unsaved changes. Are you sure you want to leave this page without saving?';

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />{' '}
      <Dialog
        isOpen={dialog}
        onDismiss={() => setDialog(false)}
        aria-labelledby="dialog1Title"
        aria-describedby="dialog1Desc"
      >
        <button
          onClick={() => {
            setDialog(false);
          }}
          style={{ float: 'right' }}
        >
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
        <br />
        {prioritiesPage && (
          <Warning>
            <H1>
              <FontAwesomeIcon icon={faExclamationTriangle} /> Warning
            </H1>
          </Warning>
        )}
        <H2Margin>
          {prioritiesPage
            ? 'You have to set priorities for asset classes in order for Passiv to show you trades calculations!'
            : warningMessage}{' '}
        </H2Margin>
        {!prioritiesPage && (
          <ActionContainer>
            <DeleteBtn onClick={handleConfirmNavigationClick}>
              Confirm
            </DeleteBtn>
            <Button onClick={() => setDialog(false)}>Cancel</Button>
          </ActionContainer>
        )}
      </Dialog>
    </>
  );
};
export default RouteLeavingPrompt;
