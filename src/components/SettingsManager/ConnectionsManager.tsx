import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { selectAuthorizations, selectIsDemo } from '../../selectors';
import Connections from './../Connections';
import { Button } from '../../styled/Button';
import ShadowBox from '../../styled/ShadowBox';
import { H2 } from '../../styled/GlobalElements';
import styled from '@emotion/styled';

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const ConnectionsManager = () => {
  const authorizations = useSelector(selectAuthorizations);
  const isDemo = useSelector(selectIsDemo);
  const dispatch = useDispatch();

  return (
    <ShadowBox className="tour-edit-connections">
      <H2>Connections</H2>
      <Connections />
      <ButtonContainer>
        <Button
          onClick={() => {
            dispatch(push('/settings/connect'));
          }}
          disabled={isDemo}
          className="tour-add-more-connections"
        >
          {authorizations && authorizations.length > 0
            ? 'Add Another Connection'
            : 'Add a Connection'}
        </Button>
      </ButtonContainer>
    </ShadowBox>
  );
};

export default ConnectionsManager;
