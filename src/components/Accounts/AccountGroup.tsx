import React, { useState } from 'react';
import styled from '@emotion/styled';
import HiddenAccountsTooltip from '../HiddenAccountsTooltip';
import NameInputAndEdit from '../NameInputAndEdit';
import { selectGroups } from '../../selectors/groups';
import { useDispatch, useSelector } from 'react-redux';
import { patchData } from '../../api';
import { loadGroupsList } from '../../actions';
import { toast } from 'react-toastify';
import { GroupData } from '../../types/group';

type GroupHeadingProps = {
  isOnboarding: boolean;
};

const Container = styled.div`
  button {
    font-size: 18px;
    margin: 0 5px;
    min-width: 70px;
    @media (min-width: 900px) {
      top: 0;
    }
  }
`;

export const GroupHeading = styled.h3<GroupHeadingProps>`
  background: ${(props) =>
    props.isOnboarding ? 'var(--brand-light-green)' : 'white'};
  display: inline-block;
  position: relative;
  top: -24px;
  padding: 0 15px;
  margin-bottom: -7px;
  font-size: 26px;
`;

type Props = {
  id?: string;
  name: string;
  isOnboarding: boolean;
  editing: boolean;
  children?: JSX.Element;
};

const AccountGroup = ({ id, name, children, isOnboarding, editing }: Props) => {
  const dispatch = useDispatch();
  const groups = useSelector(selectGroups);

  const [edit, setEdit] = useState(false);
  const [groupName, setGroupName] = useState(name);

  const saveName = () => {
    const group = groups?.find((group) => group.id === id);
    if (group && groupName !== name && groupName.trim().length > 0) {
      const newGroup: GroupData = { ...group };
      newGroup.name = groupName;
      patchData(`/api/v1/portfolioGroups/${newGroup.id}/`, newGroup)
        .then(() => {
          dispatch(loadGroupsList());
        })
        .catch(() => {
          toast.error('Failed to edit the group name');
          setGroupName(name);
        });
    } else if (groupName.trim().length === 0) {
      toast.error('Failed to edit the group name');
      setGroupName(name);
    }

    setEdit(false);
  };

  return (
    <>
      <GroupHeading isOnboarding={isOnboarding}>
        {!id || name === 'Hidden Accounts' ? (
          name
        ) : (
          <NameInputAndEdit
            value={groupName}
            edit={edit}
            cancelButton
            allowEdit={editing}
            onChange={(e) => setGroupName(e.target.value)}
            onKeyPress={(e: any) => e.key === 'Enter' && saveName()}
            onClickDone={saveName}
            onClickEdit={() => setEdit(!edit)}
            onClickCancel={() => {
              setEdit(false);
              setGroupName(name);
            }}
            StyledContainer={Container}
          />
        )}

        {name === 'Hidden Accounts' && <HiddenAccountsTooltip />}
      </GroupHeading>
      {children}
    </>
  );
};

export default AccountGroup;
