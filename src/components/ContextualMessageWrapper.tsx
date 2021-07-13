import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectContextualMessages } from '../selectors';
import { loadSettings } from '../actions';
import { Button } from '../styled/Button';
import styled from '@emotion/styled';
import { postData } from '../api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ButtonContainer = styled.div`
  text-align: right;
  margin-bottom: 20px;
  svg {
    cursor: pointer;
    color: black;
  }
`;

type Props = {
  name: string;
  text?: string;
  xButton: boolean;
  children?: any;
};

export const HideButton = ({ name, text, xButton }: Props) => {
  const dispatch = useDispatch();
  const updateContextualMessages = () => {
    postData(`/api/v1/contextualMessages`, {
      name: [name],
    })
      .then((response) => {
        dispatch(loadSettings());
      })
      .catch((error) => {
        toast.error(`Failed to hide contextual message "${name}".`);
      });
  };

  return (
    <ButtonContainer>
      {xButton ? (
        <FontAwesomeIcon
          icon={faTimes}
          onClick={updateContextualMessages}
          size="2x"
        />
      ) : (
        <Button onClick={updateContextualMessages}>
          {text === undefined ? 'Hide' : text}
        </Button>
      )}
    </ButtonContainer>
  );
};

export const ContextualMessageWrapper = ({ name, children }: Props) => {
  const messages = useSelector(selectContextualMessages);

  if (messages && messages.some((messageName) => messageName === name)) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return null;
};
