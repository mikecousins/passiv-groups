import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faCheck,
  faTrashAlt,
  faExternalLinkAlt,
  faLongArrowAltRight,
  faLongArrowAltLeft,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import { selectGroupedAccounts, Group } from '../../selectors/groups';
import AccountRow from './AccountRow';
import AccountGroup from './AccountGroup';
import { deleteData, putData, postData } from '../../api';
import { H2, A, Edit, H3, P, H1 } from '../../styled/GlobalElements';
import { selectModelPortfolioFeature } from '../../selectors/features';
import {
  loadAccountList,
  loadGroup,
  loadGroupsList,
  loadSettings,
} from '../../actions';
import { loadPerformanceAll } from '../../actions/performance';
import { selectSelectedAccounts } from '../../selectors/performance';
import { selectRouter } from '../../selectors/router';
import { Continue } from '../../pages/BrokeragesOauthPage';
import { BackBtn } from '../../pages/AuthorizationPage';
import { updateOnboardingStep } from '../../actions/onboarding';
import { selectSettings } from '../../selectors';
import NotAvailable from '../NotAvailable';

export const Header = styled.form`
  h2 {
    display: inline-block;
  }
  a {
    margin-left: 14px;
  }
  svg {
    margin-right: 3px;
  }
`;

export const PaddedP = styled(P)`
  padding-top: 20px;
`;

export const GroupNote = styled(P)`
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 30px;
  display: flex;
  align-items: baseline;
`;

export const TutorialLink = styled.div`
  margin: 50px 0px 60px 0px;
  a {
    color: white;
    background-color: var(--brand-green);
    padding: 10px 20px;
    font-weight: 600;
    font-size: 20px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.25px;
    text-decoration: none;
    svg {
      margin-left: 10px;
    }
    @media (max-width: 900px) {
      padding: 5px;
      font-size: 18px;
    }
  }
`;

const ButtonContainer = styled.div`
  text-align: right;
  margin-top: 50px;
`;

const Back = styled(BackBtn)`
  float: left;
  @media (max-width: 900px) {
    float: none;
    margin-top: 20px;
  }
`;

const Accounts = () => {
  const accounts = useSelector(selectGroupedAccounts);
  const router = useSelector(selectRouter);
  const settings = useSelector(selectSettings);
  const isOnboarding = !router.location.pathname.includes('settings');
  const [localAccounts, setLocalAccounts] = useState(accounts);
  const [isEditing, setIsEditing] = useState(isOnboarding ? true : false);
  const modelPortfolioFeature = useSelector(selectModelPortfolioFeature);
  const dispatch = useDispatch();
  const [numHidden, setNumHidden] = useState(
    accounts?.find((a) => a.groupId === 'hidden')?.accounts.length,
  );

  // when we get new accounts back from the server, reset our accounts
  useEffect(() => setLocalAccounts(accounts), [accounts]);

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: `1px 20px 7px`,
    margin: `0 0 8px 0`,

    // change background colour if dragging
    background: isDragging ? '#b5f3e8' : '#F1F1F1',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean, fake: boolean = false) => ({
    padding: 8,
    marginBottom: 20,
    border: fake
      ? '1px dashed #2a2d34'
      : isDraggingOver
      ? '2px solid #2a2d34'
      : '1px solid #2a2d34',
    marginTop: 40,
  });

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (!localAccounts) {
      return;
    }

    const newList: Group[] = Array.from(localAccounts);
    const sourceList = newList.find(
      (group) => group.groupId === result.source.droppableId,
    );
    const destList = newList.find(
      (group) => group.groupId === result.destination!.droppableId,
    );

    if (sourceList) {
      const [moved] = sourceList.accounts.splice(result.source.index, 1);
      const newAccount = {
        ...moved,
        portfolio_group: result.destination!.droppableId,
      };

      let affectedGroupIds = [
        moved.portfolio_group,
        newAccount.portfolio_group,
      ].filter(
        (groupId) =>
          groupId !== 'hidden' && groupId !== 'new' && groupId !== null,
      );

      if (destList) {
        destList.accounts.splice(result.destination.index, 0, moved);
        putData(`/api/v1/accounts/${moved.id}`, newAccount)
          .then(() => {
            dispatch(loadSettings());
            dispatch(loadAccountList());
            dispatch(loadGroupsList());
            dispatch(loadGroup({ ids: affectedGroupIds }));
            toast.success('Moved account successfully');
          })
          .catch(() => {
            dispatch(loadSettings());
            dispatch(loadAccountList());
            dispatch(loadGroupsList());
            dispatch(loadGroup({ ids: affectedGroupIds }));
            toast.error('Failed to move the account');
          });
      } else if (result.destination.droppableId === 'new') {
        postData('/api/v1/portfolioGroups', { name: 'New Group' }).then(
          (newGroup) => {
            affectedGroupIds.push(newGroup.data[0].id);
            newAccount.portfolio_group = newGroup.data[0].id;
            putData(`/api/v1/accounts/${moved.id}`, newAccount)
              .then(() => {
                dispatch(loadSettings());
                dispatch(loadAccountList());
                dispatch(loadGroupsList());
                dispatch(loadGroup({ ids: affectedGroupIds }));
                toast.success('Moved account successfully');
              })
              .catch(() => {
                dispatch(loadSettings());
                dispatch(loadAccountList());
                dispatch(loadGroupsList());
                dispatch(loadGroup({ ids: affectedGroupIds }));
                toast.error('Failed to move account');
              });
          },
        );
      }
    }

    setLocalAccounts(newList);
  };

  if (!localAccounts) {
    return null;
  }

  const finishEditing = () => {
    setIsEditing(false);
    const newNumHidden = accounts?.find((a) => a.groupId === 'hidden')?.accounts
      .length;
    if (newNumHidden !== numHidden) {
      const selectedAccounts = dispatch(selectSelectedAccounts);
      setNumHidden(newNumHidden);
      dispatch(loadPerformanceAll(selectedAccounts));
    }
  };

  return (
    <React.Fragment>
      <Header>
        {isOnboarding ? (
          <H1>Group your Accounts in Porfolios</H1>
        ) : (
          <H2>Accounts</H2>
        )}

        {!isOnboarding ? (
          isEditing ? (
            <A onClick={() => finishEditing()}>
              <FontAwesomeIcon icon={faCheck} />
              Done
            </A>
          ) : (
            <React.Fragment>
              <Edit onClick={() => setIsEditing(true)}>
                <FontAwesomeIcon icon={faPen} />
                Edit Groups
              </Edit>
            </React.Fragment>
          )
        ) : null}
      </Header>
      <PaddedP>
        Passiv lets you organize your investment accounts into groups, where
        each group has its own{' '}
        {modelPortfolioFeature ? 'model portfolio' : 'target portfolio'}. By
        default, each account gets its own group. Drag and drop to reorganize.
      </PaddedP>
      {isOnboarding && (
        <TutorialLink>
          <a
            href="https://passiv.com/help/tutorials/how-to-set-up-multi-account-portfolios/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn How to Set Up Multi-Account Portfolios{' '}
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </TutorialLink>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        {localAccounts.map((group) => (
          <Droppable droppableId={group.groupId} key={group.groupId}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                <AccountGroup
                  id={group.groupId}
                  name={group.name}
                  isOnboarding={isOnboarding}
                  editing={isEditing}
                >
                  {group.accounts.length > 0 ? (
                    <div>
                      {group.accounts.map((account, index) => (
                        <Draggable
                          key={account.id}
                          draggableId={account.id}
                          index={index}
                          isDragDisabled={!isEditing}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                              )}
                            >
                              <AccountRow
                                account={account}
                                editing={isEditing}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {group.accounts.length === 0 &&
                        !snapshot.isDraggingOver && <H3>Empty group</H3>}
                    </div>
                  ) : (
                    <React.Fragment>
                      {group.groupId === 'hidden' ? (
                        <React.Fragment>
                          {isEditing ? (
                            <GroupNote>
                              Drag accounts here to hide them in Passiv.
                            </GroupNote>
                          ) : (
                            <GroupNote>
                              <Edit onClick={() => setIsEditing(true)}>
                                <FontAwesomeIcon icon={faPen} />
                                Edit Groups
                              </Edit>{' '}
                              and drag accounts here to hide them in Passiv.
                            </GroupNote>
                          )}
                        </React.Fragment>
                      ) : (
                        <GroupNote>
                          <NotAvailable message="There are no accounts in this group." />
                          <Edit
                            onClick={() => {
                              deleteData(
                                `/api/v1/portfolioGroups/${group.groupId}`,
                              )
                                .then(() => {
                                  dispatch(loadGroupsList());
                                })
                                .catch(() => {
                                  dispatch(loadGroupsList());
                                });
                            }}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                            Delete
                          </Edit>
                        </GroupNote>
                      )}
                    </React.Fragment>
                  )}
                </AccountGroup>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
        {isEditing && (
          <Droppable droppableId="new" key="new">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, true)}
              >
                <AccountGroup
                  name="New Group"
                  isOnboarding={isOnboarding}
                  editing={isEditing}
                >
                  <GroupNote>
                    Drag accounts here to place them in a new group.
                  </GroupNote>
                </AccountGroup>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </DragDropContext>
      {isOnboarding && (
        <>
          <ButtonContainer>
            <Continue
              onClick={() => dispatch(updateOnboardingStep(4, settings))}
            >
              Next Step
              <FontAwesomeIcon icon={faLongArrowAltRight} size="lg" />
            </Continue>
            <Back onClick={() => dispatch(updateOnboardingStep(2, settings))}>
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Go Back
            </Back>
          </ButtonContainer>
        </>
      )}
    </React.Fragment>
  );
};

export default Accounts;
