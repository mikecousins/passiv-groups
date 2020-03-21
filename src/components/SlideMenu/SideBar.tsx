import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { selectLoggedIn } from '../../selectors';
import { selectGroups } from '../../selectors/groups';
import SideBarLink from './SideBarLink';
import SideBarLinkAlt from './SideBarLinkAlt';
import SideBarFooter from './SideBarFooter';
import styled from '@emotion/styled';

const StyledAside = styled.aside`
  background-color: var(--brand-grey);
  color: #fff;
  width: 212px;
  height: calc(100% - 150px);
  padding-top: 12px;
  font-weight: 700;
  position: fixed;
  transition: 0.25s all;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 136px;
  a {
    color: #fff;
    text-decoration: none;
    padding: 20px 15px 20px 25px;
    display: block;
    font-size: 1.125rem;
    position: relative;
    strong {
      font-weight: 600;
    }
    svg {
      float: right;
    }
  }
  .active {
    background: var(--brand-green);
    box-shadow: -1px 2px 3px 0 rgba(0, 0, 0, 0.27);
    margin-right: -5px;
    padding-right: 5px;
  }
`;
const GroupContainer = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.23);
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.23);
  text-transform: none;
  font-weight: 500;
  a {
    font-size: 16px;
    padding: 17px 15px 17px 25px;
  }
`;

const SideBar = () => {
  const loggedIn = useSelector(selectLoggedIn);
  const groups = useSelector(selectGroups);

  let groupList: JSX.Element | JSX.Element[] = (
    <FontAwesomeIcon icon={faSpinner} spin />
  );

  if (groups) {
    groupList = groups.map(group => {
      return (
        <React.Fragment key={group.id}>
          <SideBarLink
            key={group.id}
            name={group.name}
            linkPath={`/app/group/${group.id}`}
            rebalance={!!group.rebalance}
            hasAccounts={group.hasAccounts}
            loading={group.loading}
            setupComplete={group.setupComplete}
            spinnerLoading={true}
            hideArrow={true}
          />
          {group.hasAccounts &&
            group.accounts.map(account => (
              <SideBarLink
                key={account.id}
                name={account.name}
                linkPath={`/app/group/${group.id}/account/${account.id}`}
                hideArrow={true}
                indent={true}
              />
            ))}
        </React.Fragment>
      );
    });
  }
  if (loggedIn) {
    return (
      <StyledAside>
        <SideBarLink name="Dashboard" linkPath="/app/dashboard" />
        <SideBarLink name="Performance" linkPath="/app/performance" />
        {groups && groups.length > 0 && (
          <GroupContainer>{groupList}</GroupContainer>
        )}
        <SideBarLink name="Settings" linkPath="/app/settings" />
        <SideBarFooter />
      </StyledAside>
    );
  }
  return (
    <StyledAside>
      <SideBarLink name="Login" linkPath="/app/login" />
      <SideBarLink name="Sign Up" linkPath="/app/register" />
      <SideBarLinkAlt name="Reset Password" linkPath="/app/reset-password" />
      <SideBarFooter />
    </StyledAside>
  );
};

export default SideBar;
