import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faLongArrowAltRight,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { push } from 'connected-react-router';
import { postData, putData } from '../api';
import { loadAuthorizations, reloadEverything } from '../actions';
import ShadowBox from '../styled/ShadowBox';
import { A, H1, H2, H3, P } from '../styled/GlobalElements';
import { Button } from '../styled/Button';
import { selectQueryTokens } from '../selectors/router';
import { Error } from '../types/groupInfo';
import PreLoadLink from '../components/PreLoadLink';
import { CONTACT_FORM_PATH } from '../apps/Paths';
import {
  selectBrokerages,
  selectMaintenanceBrokerages,
  selectOnboardingStep,
  selectSettings,
} from '../selectors';
import { selectIsPaid } from '../selectors/subscription';
import { Brokerage as BrokerageType } from '../types/brokerage';
import { toast } from 'react-toastify';
import { Description } from '../components/Onboarding /Intro';
import Grid from '../styled/Grid';
import { Authorization } from '../types/authorization';
import { selectAccounts } from '../selectors/accounts';
import { selectGroupsLoading } from '../selectors/groups';

import goldStar from '../assets/images/gold-star.png';
import OnboardingProgress from '../components/Onboarding /OnboardingProgress';
import { updateOnboardingStep } from '../actions/onboarding';
import NameInputAndEdit from '../components/NameInputAndEdit';

const ActionContainer = styled.div`
  margin-top: 44px;
  @media (max-width: 900px) {
    button {
      margin: 10px auto;
    }
  }
`;

export const Star = styled.div`
  background: url(${goldStar}) no-repeat;
  background-size: contain;
  width: 75px;
  height: 75px;
  margin: 0 auto;
  margin-bottom: 20px;
  transform: rotate(18deg);
  @media (max-width: 900px) {
    width: 60px;
    height: 60px;
  }
`;

export const Continue = styled(Button)`
  svg {
    margin-left: 10px;
  }
`;

export const ConnectMore = styled(Button)`
  background-color: var(--brand-green);
  margin-right: 35px;
`;

export const Container = styled(ShadowBox)`
  background-color: var(--brand-light-green);
  padding: 50px;
  * {
    text-align: center;
  }
`;

export const ExclamationIcon = styled.div`
  font-size: 75px;
`;

const NewConnectionContainer = styled(ShadowBox)`
  margin-top: 20px;
  padding: 50px;
`;

const NewConnection = styled(Grid)`
  margin-top: 35px;
  * {
    text-align: left;
  }
`;

const NewConnectionDetails = styled.div`
  margin-bottom: 20px;
  h3 {
    font-size: 22px;
    line-height: 29px;
    letter-spacing: 0.2px;
    span {
      font-weight: 400;
    }
  }
`;

const EditNameContainer = styled.div`
  button {
    font-size: 18px;
    margin: 0 5px;
    min-width: 70px;
    @media (min-width: 900px) {
      top: 0;
    }
  }
`;

type Props = {
  brokerageName: string;
};

const BrokeragesOauthPage = ({ brokerageName }: Props) => {
  const dispatch = useDispatch();
  const queryParams = useSelector(selectQueryTokens);
  const isPaid = useSelector(selectIsPaid);
  const onboardingStep = useSelector(selectOnboardingStep);
  const brokerages = useSelector(selectBrokerages);
  const maintenanceBrokerages = useSelector(selectMaintenanceBrokerages);
  const accounts = useSelector(selectAccounts);
  const groupLoading = useSelector(selectGroupsLoading);
  const settings = useSelector(selectSettings);

  const [loading, setLoading] = useState(false);
  const [showUpgradeOffer, setShowUpgradeOffer] = useState(false);
  const [error, setError] = useState<Error>();
  const [token, setToken] = useState<any>(null);
  const [tokenConfirmed, setTokenConfirmed] = useState<boolean>(false);
  const [requestStarted, setRequestStarted] = useState<boolean>(false);
  const [connectedSuccessfully, setConnectedSuccessfully] = useState(false);
  const [newConnectionDetails, setNewConnectionDetails] = useState<
    Authorization
  >();
  const [connectionName, setConnectionName] = useState('');
  const [editingConnectionName, setEditingConnectionName] = useState(false);

  const isOnboarding = onboardingStep && onboardingStep <= 3;

  if (tokenConfirmed === false) {
    if (
      brokerageName === 'Interactive Brokers' ||
      brokerageName === 'Ally Invest'
    ) {
      setToken({
        oauth_token: queryParams.oauth_token,
        oauth_verifier: queryParams.oauth_verifier,
      });
    } else if (brokerageName === 'Zerodha') {
      setToken({
        token: queryParams.request_token,
      });
    } else {
      setToken({
        token: queryParams.code,
      });
    }
    setTokenConfirmed(true);
  }

  if (brokerageName === 'Zerodha') {
    postData('/api/v1/tradesinprogress/', queryParams).then((response) => {
      if (response.data.portfolio_group) {
        dispatch(push(`/group/${response.data.portfolio_group}`));
        dispatch(reloadEverything());
      }
    });
  }
  useEffect(() => {
    if (newConnectionDetails) {
      setConnectionName(newConnectionDetails.name);
    }
  }, [newConnectionDetails]);

  useEffect(() => {
    if (
      loading === false &&
      tokenConfirmed === true &&
      requestStarted === false &&
      showUpgradeOffer === false
    ) {
      setRequestStarted(true);
      setLoading(true);
      postData('/api/v1/brokerages/authComplete/', token)
        .then((res) => {
          setNewConnectionDetails(res.data);
          setLoading(false);
          dispatch(reloadEverything());
          setConnectedSuccessfully(true);
          if (brokerageName === 'Questrade' && !isPaid) {
            setShowUpgradeOffer(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          setError(error.response.data);
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkBrokerageMaintenance = (brokerage: BrokerageType) => {
    if (
      maintenanceBrokerages.find((b: BrokerageType) => b.id === brokerage.id)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const startConnection = () => {
    const brokerage =
      brokerages &&
      brokerages.find((brokerage) => brokerage.name === 'Questrade');
    if (brokerage) {
      if (checkBrokerageMaintenance(brokerage) === true) {
        toast.error(
          `${brokerage.name} is currently undergoing maintenance and cannot establish new connections at this time. Please try again later.`,
        );
      } else {
        postData(`/api/v1/brokerages/${brokerage.id}/authorize/`, {
          type: 'read',
        }).then((response) => {
          window.location = response.data.url;
        });
      }
    }
  };

  let errorDisplay = null;
  let overrideError = false; // IBKR

  if (error) {
    switch (error.code) {
      case '1006':
        errorDisplay = (
          <P>This connection code is invalid, please try again.</P>
        );
        break;
      case '1007':
        errorDisplay = (
          <P>This connection code has expired, please try again.</P>
        );
        break;
      case '1017':
        if (brokerageName === 'Questrade') {
          errorDisplay = (
            <React.Fragment>
              <P>
                The brokerage account you tried to link is already connected
                with Passiv.
              </P>
              <P>
                If you are trying to add a new connection for another account,
                please make sure that you are logged out of Questrade's
                dashboard.{' '}
                <A
                  href="https://my.questrade.com/clients/signout.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Logout Questrade
                </A>
              </P>
              <P>
                If you are trying to change your connection type (for example,
                switching from read-access to trade-access), check out our
                tutorial on{' '}
                <A
                  href="https://passiv.com/help/tutorials/how-to-manage-your-brokerage-connections/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Managing your Brokerage Connections
                </A>
                .
              </P>
              <Button onClick={() => startConnection()}>Try Again</Button>
            </React.Fragment>
          );
        } else {
          errorDisplay = (
            <P>
              An identical connection already exists, please update or delete
              the existing connection.
            </P>
          );
        }
        break;
      case '1023':
        errorDisplay = (
          <P>
            The brokerage account linked to this connection is different from
            the account you're trying to link. This is not allowed because it
            would leave existing portfolios without a functional connection.
            Instead, create a new connection and delete this one if desired.
          </P>
        );
        break;
      case '1046':
        errorDisplay = (
          <P>
            Passiv is not presently available to Canadian accounts at
            Interactive Brokers. We apologize for the inconvenience, but this is
            a business decision by Interactive Brokers Canada and not something
            we can resolve without their approval.
          </P>
        );
        break;
      case '1049':
        overrideError = true;
        errorDisplay = (
          <React.Fragment>
            <P>
              We have successfully connected your Interactive Brokers account,
              but there is a 24-hour delay before your account information will
              be available. You will receive an email letting you know when your
              account data has been successfully synced.
            </P>
            <P>
              If you don't receive an email within 2 days, please try again or{' '}
              <PreLoadLink path={CONTACT_FORM_PATH}>
                contact support
              </PreLoadLink>
              .
            </P>
          </React.Fragment>
        );
        break;
      case '1053':
        errorDisplay = (
          <React.Fragment>
            <P>
              Interactive Brokers Canada is not supported by Passiv due to our
              exclusivity agreement with Questrade. Please consider transferring
              this account to Questrade in order to use it with Passiv.
            </P>
            <P>
              If you believe you have received this message in error, please{' '}
              <PreLoadLink path={CONTACT_FORM_PATH}>
                contact support
              </PreLoadLink>{' '}
              and describe your situation.
            </P>
          </React.Fragment>
        );
        break;
      case '0000':
        errorDisplay = (
          <P>
            No access code was provided by {brokerageName}. Did you approve the
            connection request?
          </P>
        );
        break;
      default:
        errorDisplay = (
          <React.Fragment>
            <P>
              We encountered an unexpected error while attempting to establish a
              connection. Please try again later or{' '}
              <PreLoadLink path={CONTACT_FORM_PATH}>
                contact support
              </PreLoadLink>{' '}
              if this persists.
            </P>
            <P>
              Note that in order for a connection to be established, you must
              make sure that your brokerage account is fully opened and funded.
              If your brokerage account is new or the initial funding has not
              been finalized by the brokerage, then you may not be able to link
              your account to Passiv until it is fully opened.
            </P>
          </React.Fragment>
        );
        break;
    }
  }
  let result = null;

  if (loading) {
    result = (
      <H1>
        Establishing connection to {brokerageName}...{' '}
        <FontAwesomeIcon icon={faSpinner} spin />
      </H1>
    );
  } else if (connectedSuccessfully || overrideError) {
    if (showUpgradeOffer) {
      result = (
        <div>
          <Star></Star>
          <P>
            Congratulations!! You are eligible for a <strong>FREE</strong>{' '}
            upgrade to Passiv Elite with your Questrade account!
          </P>
          <P>
            <A
              href="https://www.questrade.com/self-directed-investing/tools/partners/passiv"
              target="_blank"
              rel="noopener noreferrer"
            >
              Questrade
            </A>{' '}
            offers Passiv Elite as a free tool for Questrade customers. It's
            available for free as long as you keep your Questrade account
            connected to Passiv.
          </P>
          <P>
            You’ll get access to all basic features plus the option to{' '}
            <A
              href="https://passiv.com/help/tutorials/how-to-use-one-click-trades/"
              target="_blank"
              rel="noopener noreferrer"
            >
              place orders through Passiv
            </A>{' '}
            in just one click.
          </P>
          <Button onClick={() => dispatch(push('/questrade-offer'))}>
            Upgrade Now
          </Button>
        </div>
      );
    }

    const saveConnectionName = () => {
      if (
        newConnectionDetails &&
        newConnectionDetails?.name !== connectionName
      ) {
        let newAuthorization = Object.assign({}, newConnectionDetails);
        newAuthorization.name = connectionName;
        putData(
          `/api/v1/authorizations/${newConnectionDetails.id}`,
          newAuthorization,
        )
          .then(() => {
            dispatch(loadAuthorizations());
          })
          .catch(() => {
            dispatch(loadAuthorizations());
          });
      }
      setEditingConnectionName(false);
    };

    result = (
      <>
        <Star></Star>
        <H1>Connection Complete</H1>
        <Description>
          Thanks for connecting your {brokerageName} account! Connect another
          brokerage or move on to the next step!
        </Description>
        {newConnectionDetails && (
          <NewConnectionContainer>
            {groupLoading ? (
              <H2>
                Loading new connection details{' '}
                <FontAwesomeIcon icon={faSpinner} spin />
              </H2>
            ) : (
              <>
                <H2>Your New Connection Details</H2>
                <NewConnection columns="1fr 1fr">
                  <div>
                    <NewConnectionDetails>
                      <H3>
                        Brokerage: <span>{brokerageName}</span>
                      </H3>
                    </NewConnectionDetails>
                    <NewConnectionDetails>
                      <H3>
                        Name:
                        <NameInputAndEdit
                          value={connectionName}
                          edit={editingConnectionName}
                          allowEdit={true}
                          onChange={(e: any) =>
                            setConnectionName(e.target.value)
                          }
                          onClickDone={saveConnectionName}
                          onClickEdit={() => setEditingConnectionName(true)}
                          onClickCancel={() => {
                            setConnectionName(newConnectionDetails.name);
                            setEditingConnectionName(false);
                          }}
                          cancelButton={true}
                          StyledContainer={EditNameContainer}
                        />
                      </H3>
                    </NewConnectionDetails>
                    <NewConnectionDetails>
                      <H3>
                        Status: <span>{newConnectionDetails.type}</span>
                      </H3>
                    </NewConnectionDetails>
                  </div>
                  <div>
                    <NewConnectionDetails>
                      <H3>Accounts: </H3>
                    </NewConnectionDetails>
                    <ul>
                      {accounts
                        .filter(
                          (a) =>
                            a.brokerage_authorization ===
                            newConnectionDetails.id,
                        )
                        .map((account) => (
                          <P key={account.id}>
                            {account.name} ({account.number})
                          </P>
                        ))}
                    </ul>
                  </div>
                </NewConnection>
              </>
            )}
          </NewConnectionContainer>
        )}

        <ActionContainer>
          {isOnboarding ? (
            <>
              <ConnectMore
                onClick={() => dispatch(updateOnboardingStep(1, settings))}
              >
                Connect Another Account
              </ConnectMore>
              <Continue
                onClick={() => {
                  dispatch(push('/welcome'));
                  dispatch(updateOnboardingStep(2, settings));
                }}
              >
                Continue to Next Step
                <FontAwesomeIcon icon={faLongArrowAltRight} size="lg" />
              </Continue>
            </>
          ) : (
            <ConnectMore onClick={() => dispatch(push('/welcome'))}>
              Connect Another Account
            </ConnectMore>
          )}
        </ActionContainer>
      </>
    );
  } else if (error && !overrideError) {
    result = (
      <React.Fragment>
        <ExclamationIcon>
          <FontAwesomeIcon icon={faExclamationTriangle} color="orange" />
        </ExclamationIcon>
        <H1>Failed to establish a connection</H1>
        {errorDisplay}
        <ActionContainer>
          {isOnboarding ? (
            <Continue onClick={() => dispatch(push('/welcome'))}>
              Go Back
            </Continue>
          ) : (
            <Continue onClick={() => dispatch(push('/settings'))}>
              Go to Settings
            </Continue>
          )}
        </ActionContainer>
      </React.Fragment>
    );
  }

  return (
    <Container>
      {isOnboarding && <OnboardingProgress currentStep={1} />}
      {result}
    </Container>
  );
};

export default BrokeragesOauthPage;
