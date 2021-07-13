import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllBrokerages, selectAuthorizations } from '../../selectors';
import { selectGroups } from '../../selectors/groups';
import { loadAccounts, loadGroups } from '../../actions';
import { putData } from '../../api';
import { Table, H3, P, A } from '../../styled/GlobalElements';
import { Button } from '../../styled/Button';
import { AccountContainer, Brokerage, Name, Number, Type } from './styles';
import { Account } from '../../types/account';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { selectIsMobile } from '../../selectors/browser';

type Props = {
  account: Account;
  editing: boolean;
};

export const AccountRow = ({ account, editing }: Props) => {
  const [groupEditing, setGroupEditing] = useState(false);
  const [newGroupId, setNewGroupId] = useState('');
  const brokerages = useSelector(selectAllBrokerages);
  const authorizations = useSelector(selectAuthorizations);
  const groups = useSelector(selectGroups);
  const onMobile = useSelector(selectIsMobile);
  const dispatch = useDispatch();

  if (!groups) {
    return null;
  }

  const group = groups.find((group) => group.id === account.portfolio_group);
  if (group && !newGroupId) {
    setNewGroupId(group.id);
  }

  const setPortfolioGroup = () => {
    const newAccount = {
      ...account,
      portfolio_group: newGroupId,
    };
    putData(`/api/v1/accounts/${account.id}`, newAccount)
      .then(() => {
        dispatch(loadAccounts());
        dispatch(loadGroups());
      })
      .catch(() => {
        dispatch(loadAccounts());
        dispatch(loadGroups());
      });
    setGroupEditing(false);
  };

  let brokerageName = '';
  if (authorizations && brokerages) {
    if (authorizations.length === 0) {
      return null;
    }

    const authorization = authorizations.find(
      (authorization) => authorization.id === account.brokerage_authorization,
    );

    if (!authorization) {
      return null;
    }

    const brokerage = brokerages.find(
      (brokerage) => brokerage.id === authorization.brokerage.id,
    );

    if (brokerage) {
      brokerageName = brokerage.name;
    }
  }

  const formatAccountType = (account: Account, brokerageName: string) => {
    let accountType = '';
    if (brokerageName === 'Questrade') {
      accountType = account.meta.client_account_type + ' ' + account.meta.type;
    } else {
      accountType = account.meta.type;
    }
    return accountType;
  };

  let editingFooter = (
    <React.Fragment>
      <H3>
        &nbsp; You're about to change the portfolio group your account is linked
        to. Do you want to continue? &nbsp;
      </H3>
      <Button onClick={() => setPortfolioGroup()}>Update</Button>
      <A onClick={() => setGroupEditing(false)}>Cancel</A>
    </React.Fragment>
  );

  return (
    <AccountContainer>
      {editing && onMobile && (
        <div style={{ float: 'right' }}>
          <FontAwesomeIcon icon={faGripVertical} size="lg" />
        </div>
      )}
      <Table>
        <Brokerage>
          <H3>Brokerage</H3>
          <P>{brokerageName}</P>
        </Brokerage>
        <Name>
          <H3>Name</H3>
          <P>{account.name}</P>
        </Name>
        <Number>
          <H3>Number</H3>

          <P>
            {account.institution_name === 'Wealthica'
              ? account.number.split(':')[0].replace(/.(?=..)/g, 'x')
              : account.number.slice(0).replace(/.(?=..)/g, 'x')}{' '}
          </P>
        </Number>
        <Type>
          <H3>Type</H3>
          <P> {formatAccountType(account, brokerageName)} </P>
        </Type>
        {editing && !onMobile && <FontAwesomeIcon icon={faGripVertical} />}
      </Table>
      {groupEditing && editingFooter}
    </AccountContainer>
  );
};

export default AccountRow;
