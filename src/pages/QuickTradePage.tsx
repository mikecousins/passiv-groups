import React, { useState } from 'react';
import { Button, SmallButton } from '../styled/Button';

import { A, P, H1, H2, H3 } from '../styled/GlobalElements';
import ShadowBox from '../styled/ShadowBox';

import QuestradeLogo from '../assets/images/questrade-logo.png';
import AlpacaLogo from '../assets/images/alpaca-logo.png';
import InteractiveBrokersLogo from '../assets/images/ibkr-logo.png';
import TDAmeritradeLogo from '../assets/images/tda-logo.png';
import Grid from '../styled/Grid';
import { LogoContainer } from '../pages/AuthorizationPage';
import styled from '@emotion/styled';
import { faAngleLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PortfolioGroupCash from '../components/PortfolioGroupDetails/PortfolioGroupCash';
import SymbolSelector from '../components/PortfolioGroupTargets/TargetBar/SymbolSelector';
import { Form, Formik } from 'formik';
import { StyledSelect } from '../components/PortfolioGroupSettings/OrderTargetAllocations';
import AccountHoldings from '../components/AccountHoldings';
import { TransparentButton } from './MyModelPortfoliosPage';
import { BackButton } from '../components/ModelPortfolio';

const MainContainer = styled(ShadowBox)`
  input[type='password'] {
    background-color: white;
    padding: 5px;
    border: 1px solid;
    margin: 10px 0px 25px 0px;
    display: block;
  }
  input[type='number'] {
    background-color: white;
    padding: 5px;
    border: 1px solid;
    margin-bottom: 20px;
  }
  input[type='radio'] {
    background-color: white;
    padding: 5px;
    margin-bottom: 20px;
    margin-right: 5px;
    label {
      font-size: 15px;
    }
  }
`;

const Broker = styled(ShadowBox)`
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 30px;
`;
const Accounts = styled.ul`
  button {
    border: 1px solid var(--brand-blue);
    background-color: transparent;
    color: var(--brand-blue);
    padding: 2px 30px;
  }
  li {
    display: grid;
    grid-template-columns: 200px 150px;
    margin-bottom: 20px;
  }
`;

const Steps = styled(Grid)`
  grid-gap: 0 !important;
  margin-top: 20px;
`;

type StepProps = {
  active: boolean;
};
const Step = styled.div<StepProps>`
  cursor: pointer;
  text-align: center;
  padding: 10px 0px;
  background-color: white;
  border-bottom: ${(props) => props.active && '3px solid var(--brand-green)'};
  border-right: ${(props) =>
    props.active && '3px solid rgba(100, 100, 111, 0.08)'};
  h2 {
    font-weight: 400;
  }
  div {
    font-size: 30px;
    text-align: center;
    color: white;
  }
`;

const TransparentButtonSmaller = styled(TransparentButton)`
  border: 1px solid;
  font-weight: normal;
`;

const FormField = styled(Grid)`
  display: grid;
  grid-template-columns: 150px 200px;
  margin-bottom: 20px;
`;

const Order = styled(Grid)`
  padding: 15px 0px;
  border-bottom: 0.5px solid #bfb6b6;
`;

const BackButtonTransparent = styled(TransparentButtonSmaller)`
  padding: 7px 40px 9px;
`;

const QuickTradePage = () => {
  const [status, setStatus] = useState('none');
  const [accountSelected, setAccountSelected] = useState('');
  const [activeTab, setActiveTab] = useState(1);
  const [newUser, setNewUser] = useState(false);
  const [preview, setPreview] = useState(false);

  const orders = [
    {
      symbol: 'VAB.TO',
      status: 'Executed',
      action: 'Buy',
      qty: '1',
      fill: '25.91',
      duration: 'Day',
      type: 'Market',
      time: '06/07/21 11:12:54AM',
    },
    {
      symbol: 'SITI.TO',
      status: 'Executed',
      action: 'Buy',
      qty: '3',
      fill: '24.23',
      duration: 'Day',
      type: 'Limit',
      time: '5/27/21 12:12:58PM',
    },
    {
      symbol: 'HMMJ.TO',
      status: 'Executed',
      action: 'Buy',
      qty: '6',
      fill: '10.39',
      duration: 'Day',
      type: 'Limit',
      time: '06/01/21 10:06:25AM',
    },
  ];

  let result = (
    <div>
      <Button
        onClick={() => {
          setStatus('pin');
          setNewUser(false);
        }}
        style={{ marginRight: '10px' }}
      >
        Login with your PIN
      </Button>
      <TransparentButtonSmaller
        onClick={() => {
          setStatus('new');
          setNewUser(true);
        }}
      >
        Create an account
      </TransparentButtonSmaller>
    </div>
  );

  switch (status) {
    case 'pin':
      result = (
        <div>
          <form>
            <input type="password" placeholder="Enter your PIN" />
            <SmallButton onClick={() => setStatus('4')}>Enter</SmallButton>
          </form>
        </div>
      );
      break;
    case 'new':
      result = (
        <div>
          <H2 style={{ margin: '30px 0px' }}>
            Start by creating a Trading PIN
          </H2>
          <div>
            <label htmlFor="PIN1">Enter your PIN:</label>
            <input type="password" name="PIN1" />
            <label htmlFor="PIN2">Confirm your PIN:</label>
            <input type="password" name="PIN2" />
            <small>
              *Note: Don't forget your PIN or you will need to reconnect your
              accounts.
            </small>
            <br />
            <SmallButton
              onClick={() => setStatus('2')}
              style={{ marginTop: '10px' }}
              type="button"
            >
              Register
            </SmallButton>
          </div>
        </div>
      );
      break;
    case '2':
      result = (
        <div>
          <P style={{ marginBottom: '10px' }}>
            Would you like to share your holdings data with X?
          </P>

          <div>
            <div style={{ marginBottom: '10px' }}>
              <input type="radio" id="yes" name="share-data" value="yes" />
              <label htmlFor="yes">Yes</label>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input type="radio" id="no" name="share-data" value="no" />
              <label htmlFor="no">No</label>
            </div>
            <small>
              *Note: This will allow X to read your account positions and
              balances to provide you with addition of functionality.
            </small>
            <br />
            <BackButtonTransparent onClick={() => setStatus('new')}>
              Go Back
            </BackButtonTransparent>
            <SmallButton
              onClick={() => setStatus('3')}
              style={{ marginTop: '10px' }}
            >
              Continue
            </SmallButton>
          </div>
        </div>
      );
      break;
    case '3':
      result = (
        <div>
          <H3 style={{ marginBottom: '10px' }}>Select your broker: </H3>
          <Grid columns="repeat(4,1fr)">
            <Broker onClick={() => setStatus('4')}>
              <LogoContainer>
                {' '}
                <img alt="QuestradeLogo" src={QuestradeLogo} />
              </LogoContainer>
            </Broker>
            <Broker onClick={() => setStatus('4')}>
              <LogoContainer>
                {' '}
                <img alt="TDAmeritradeLogo" src={TDAmeritradeLogo} />
              </LogoContainer>
            </Broker>
            <Broker onClick={() => setStatus('4')}>
              <LogoContainer>
                {' '}
                <img
                  alt="InteractiveBrokersLogo"
                  src={InteractiveBrokersLogo}
                />
              </LogoContainer>
            </Broker>
            <Broker onClick={() => setStatus('4')}>
              <LogoContainer>
                {' '}
                <img alt="AlpacaLogo" src={AlpacaLogo} />
              </LogoContainer>
            </Broker>{' '}
          </Grid>
          <BackButtonTransparent onClick={() => setStatus(newUser ? '2' : '4')}>
            Go Back
          </BackButtonTransparent>
        </div>
      );
      break;
    case '4':
      result = (
        <div>
          <H3 style={{ marginBottom: '10px' }}>Your Accounts: </H3>
          <Accounts>
            <li>
              Margin - TDA{' '}
              <SmallButton
                onClick={() => {
                  setStatus('5');
                  setAccountSelected('Margin - TDA');
                }}
                style={{ marginLeft: '10px' }}
              >
                Trade
              </SmallButton>
            </li>
            <li>
              Margin - IBKR{' '}
              <SmallButton
                onClick={() => {
                  setStatus('5');
                  setAccountSelected('Margin - IBKR');
                }}
                style={{ marginLeft: '10px' }}
              >
                Trade
              </SmallButton>
            </li>
            <li>
              TFSA - Questrade{' '}
              <SmallButton
                onClick={() => {
                  setStatus('5');
                  setAccountSelected('TFSA - Questrade');
                }}
                style={{ marginLeft: '10px' }}
              >
                Trade
              </SmallButton>
            </li>
          </Accounts>
          <Button onClick={() => setStatus('3')}>
            Connect Another Account{' '}
          </Button>
        </div>
      );
      break;
    case '5':
      result = (
        <div>
          <BackButton>
            <A onClick={() => setStatus('4')}>
              <FontAwesomeIcon icon={faAngleLeft} size="lg" /> Back to Accounts
            </A>
          </BackButton>
          <H2>{accountSelected}</H2>
          <Steps columns="1fr 1fr 1fr 1fr">
            <Step
              active={activeTab === 1 && true}
              onClick={() => setActiveTab(1)}
            >
              Trade
            </Step>

            <Step
              active={activeTab === 2 && true}
              onClick={() => setActiveTab(2)}
            >
              Positions
            </Step>
            <Step
              active={activeTab === 3 && true}
              onClick={() => setActiveTab(3)}
            >
              Orders
            </Step>
          </Steps>
        </div>
      );
      break;
    default:
      break;
  }

  return (
    <MainContainer>
      <H1>Quick Trade</H1>
      {result}
      <div
        style={{
          maxWidth: '75%',
          borderTopRightRadius: '0',
          borderTopLeftRadius: '0',
        }}
      >
        {status === '5' && (
          <div>
            {activeTab === 1 && (
              <ShadowBox>
                {preview ? (
                  <div>
                    <H1>
                      Order Executed Successfully{' '}
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        size="lg"
                        color="var(--brand-green)"
                      />
                    </H1>
                    <Button onClick={() => setPreview(false)}>OK</Button>
                  </div>
                ) : (
                  <div>
                    {' '}
                    <PortfolioGroupCash
                      balances={[
                        {
                          currency: { id: 'x', code: 'CAD', name: 'cad' },
                          cash: 120000,
                        },
                        {
                          currency: { id: 'y', code: 'USD', name: 'cad' },
                          cash: 5000,
                        },
                      ]}
                      error={null}
                    />
                    <FormField>
                      <div>
                        <input type="radio" id="buy" name="trade" value="buy" />
                        <label htmlFor="buy">Buy</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="sell"
                          name="trade"
                          value="sell"
                        />
                        <label htmlFor="sell">Sell</label>
                      </div>
                    </FormField>
                    <div>
                      <div>
                        <FormField>
                          <span>Symbol: </span>
                          <SymbolSelector
                            value={undefined}
                            onSelect={(selected) => console.log(selected)}
                          />
                        </FormField>
                        <div>
                          <Formik initialValues={{}} onSubmit={() => {}}>
                            <Form onChange={() => console.log('selected')}>
                              <FormField>
                                <span>Order Type:</span>
                                <StyledSelect as="select" name="type">
                                  <option value={'Market'} key={0}>
                                    Market
                                  </option>
                                  <option value={'Limit'} key={1}>
                                    Limit
                                  </option>
                                </StyledSelect>
                              </FormField>
                              <FormField>
                                <span>Quantity:</span> <input type="number" />
                              </FormField>
                              <FormField>
                                <span>Price:</span> <input type="number" />
                              </FormField>
                              <FormField>
                                <span>Time to Force:</span>
                                <StyledSelect as="select" name="time">
                                  <option value={'Day'} key={0}>
                                    Day
                                  </option>
                                  <option value={'GTC'} key={1}>
                                    GTC
                                  </option>
                                  <option value={'FOK'} key={2}>
                                    FOK
                                  </option>
                                </StyledSelect>
                              </FormField>
                            </Form>
                          </Formik>
                        </div>
                      </div>
                    </div>
                    <SmallButton
                      onClick={() => {
                        setPreview(true);
                        setStatus('5');
                      }}
                      type="button"
                    >
                      Preview Order
                    </SmallButton>
                  </div>
                )}
              </ShadowBox>
            )}

            {activeTab === 2 && (
              <div>
                <AccountHoldings
                  holdings={{
                    id: 'bb875eac-8698-4f01-ab0e-eb8993e93e13',
                    name: 'Alpaca Margin',
                    number: '870903896',
                    type: 'Margin',
                    positions: [
                      {
                        symbol: {
                          id: '888060b2-946e-42da-9959-bbd94e1a6190',
                          description: '',
                          symbol: {
                            id: '2b9ec7c2-a075-49ee-ba43-a82ab9877237',
                            symbol: 'AMD',
                            security_type: 'Stock',
                            name: 'Advanced Micro Devices Inc.',
                            exchange: 'ff4b2ffc-5a0e-4471-9cf5-95c0c30cdedd',
                            currency: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                            type: '515c27d1-8471-4dec-a234-af12184c51d4',
                          },
                          local_id: '03fb07bb-5db1-4077-8dea-5d711b272625',
                          security_type: '',
                          listing_exchange: '',
                          is_quotable: true,
                          is_tradable: true,
                        },
                        price: 80.71,
                        units: 6,
                        open_pnl: 13.48,
                        fractional_units: 2.3,
                        currency: {
                          id: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                          code: 'USD',
                          name: 'USD',
                        },
                      },
                      {
                        symbol: {
                          id: 'ee5bbc99-0685-4586-a584-b915615c7eed',
                          description: '',
                          symbol: {
                            id: '66a5d081-4dbf-40d3-93bf-a592487c7219',
                            symbol: 'BUG',
                            security_type: null,
                            name: 'Global X Funds - Global X Cybersecurity ETF',
                            exchange: 'ff4b2ffc-5a0e-4471-9cf5-95c0c30cdedd',
                            currency: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                            type: '8057ceb7-e073-4c77-8635-a1c9bc6442cb',
                          },
                          local_id: 'cecf1229-db59-44bb-9951-04c90d220b17',
                          security_type: '',
                          listing_exchange: '',
                          is_quotable: true,
                          is_tradable: true,
                        },
                        price: 28.58,
                        units: 3,
                        open_pnl: 11.1,
                        fractional_units: 2.3,
                        currency: {
                          id: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                          code: 'USD',
                          name: 'USD',
                        },
                      },
                      {
                        symbol: {
                          id: '8f38d0f9-caa7-46db-8c92-f458c0d5a386',
                          description: '',
                          symbol: {
                            id: 'bc4fec4c-b28e-4a7e-8377-3876e7c2b0aa',
                            symbol: 'HEXO',
                            security_type: 'Stock',
                            name: 'HEXO Corp',
                            exchange: 'ebd63029-461e-4bed-bd4a-d0595f880b52',
                            currency: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                            type: '515c27d1-8471-4dec-a234-af12184c51d4',
                          },
                          local_id: '5adbd678-25a6-4327-8abf-10a787ddcf1e',
                          security_type: '',
                          listing_exchange: '',
                          is_quotable: true,
                          is_tradable: true,
                        },
                        price: 6.04,
                        units: 4,
                        open_pnl: 56.25,
                        fractional_units: 2.3,
                        currency: {
                          id: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                          code: 'USD',
                          name: 'USD',
                        },
                      },
                      {
                        symbol: {
                          id: '7761fb21-deab-4d42-8ad5-4d09ade8105f',
                          description: '',
                          symbol: {
                            id: '9370a512-e2fd-44e3-91cf-e2714d6b287d',
                            symbol: 'SAN',
                            security_type: 'Stock',
                            name: 'Banco Santander S.A. - ADR',
                            exchange: 'ebd63029-461e-4bed-bd4a-d0595f880b52',
                            currency: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                            type: '24482255-2c04-46f3-baed-7d7d452a1a83',
                          },
                          local_id: '480ac4ce-b91e-4a9a-8945-dc514aec0bf8',
                          security_type: '',
                          listing_exchange: '',
                          is_quotable: true,
                          is_tradable: true,
                        },
                        price: 4.22,
                        units: 1,
                        open_pnl: 1.09,
                        fractional_units: 2.3,
                        currency: {
                          id: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                          code: 'USD',
                          name: 'USD',
                        },
                      },
                      {
                        symbol: {
                          id: 'cbd4dfba-e7d0-4d65-bfa4-48384202b821',
                          description: '',
                          symbol: {
                            id: 'c15a817e-7171-4940-9ae7-f7b4a95408ee',
                            symbol: 'AAPL',
                            security_type: 'Stock',
                            name: 'Apple Inc',
                            exchange: 'ff4b2ffc-5a0e-4471-9cf5-95c0c30cdedd',
                            currency: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                            type: '515c27d1-8471-4dec-a234-af12184c51d4',
                          },
                          local_id: 'b0b6dd9d-8b9b-48a9-ba46-b9d54906e415',
                          security_type: '',
                          listing_exchange: '',
                          is_quotable: true,
                          is_tradable: true,
                        },
                        price: 129.13,
                        units: 0,
                        open_pnl: 5.9,
                        fractional_units: 2.3,
                        currency: {
                          id: '57f81c53-bdda-45a7-a51f-032afd1ae41b',
                          code: 'USD',
                          name: 'USD',
                        },
                      },
                    ],
                  }}
                />
              </div>
            )}
            {activeTab === 3 && (
              <ShadowBox>
                <Order columns="repeat(8, 1fr)">
                  <H3>Symbol</H3>
                  <H3>Status</H3>
                  <H3>Action</H3>
                  <H3>Qty</H3>
                  <H3>Fill price</H3>
                  <H3>Duration</H3>
                  <H3>Order type</H3>
                  <H3>Time Placed</H3>
                </Order>
                {orders.map((order) => {
                  return (
                    <Order columns="repeat(8, 1fr)">
                      <div>{order.symbol}</div>
                      <div>{order.status}</div>
                      <div>{order.action}</div>
                      <div>{order.qty}</div>
                      <div>{order.fill}</div>
                      <div>{order.duration}</div>
                      <div>{order.type}</div>
                      <div>{order.time}</div>
                    </Order>
                  );
                })}
              </ShadowBox>
            )}
          </div>
        )}
      </div>
    </MainContainer>
  );
};

export default QuickTradePage;
