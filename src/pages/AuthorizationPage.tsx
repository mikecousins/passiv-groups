import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push, replace } from 'connected-react-router';
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faSpinner,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  selectIsAuthorized,
  selectBrokerages,
  selectMaintenanceBrokerages,
  selectSettings,
} from '../selectors';
import { useParams } from 'react-router';
import { A, P, BulletUL, Li, H1, H2 } from '../styled/GlobalElements';
import { postData } from '../api';
import ShadowBox from '../styled/ShadowBox';
import styled from '@emotion/styled';
import QuestradeLogo from '../assets/images/questrade-logo.png';
import AllyLogo from '../assets/images/ally-logo.png';
import AlpacaLogo from '../assets/images/alpaca-logo.png';
import InteractiveBrokersLogo from '../assets/images/ibkr-logo.png';
import TDAmeritradeLogo from '../assets/images/tda-logo.png';
import TradierLogo from '../assets/images/tradier-logo.png';
import KrakenLogo from '../assets/images/kraken-logo.png';
import BitbuyLogo from '../assets/images/bitbuy-logo.png';
import UnocoinLogo from '../assets/images/unocoin-logo.png';
import WealthicaLogo from '../assets/images/wealthica-logo.png';
import ZerodhaLogo from '../assets/images/zerodha-logo.png';
import { Brokerage as BrokerageType } from '../types/brokerage';
import { toast } from 'react-toastify';
import { Button } from '../styled/Button';
import { CONTACT_FORM_PATH } from '../apps/Paths';
import PreLoadLink from '../components/PreLoadLink';
import { Description } from '../components/Onboarding /Intro';
import Grid from '../styled/Grid';
import { Continue } from './BrokeragesOauthPage';
import OnboardingProgress from '../components/Onboarding /OnboardingProgress';
import { updateOnboardingStep } from '../actions/onboarding';

const VerticalPadding = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Container3Column = styled(Grid)`
  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }
`;

const GrowBox = styled.div`
  margin: 50px 0px;
  height: 150px;
`;

const BiggerLogoContainer = styled.div`
  padding: 20px;
  max-height: 100px;
  img {
    max-width: 100%;
    max-height: 100px;
  }
  @media (max-width: 900px) {
    max-height: 200px;
  }
`;

export const LogoContainer = styled.div`
  padding: 30px;
  img {
    max-width: 100%;
  }
`;

const LinkContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
`;

const AuthBox = styled(ShadowBox)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 30px;
  cursor: pointer;
`;

const OpenBox = styled(ShadowBox)`
  min-width: 400px;
  text-align: center;
  padding-bottom: 30px;
  height: 100%;
  @media (max-width: 900px) {
    min-width: 100%;
  }
`;

const AuthLink = styled(A)`
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 0;
`;

const AuthP = styled(P)`
  max-width: 715px;
  margin: 50px 0px 25px 0px;
`;

export const H1DarkStyle = styled(H1)`
  color: #fff;
`;

export const H2DarkStyle = styled(H2)`
  color: #04a287;
  font-size: 22px;
  padding-bottom: 20px;
`;

export const PDarkStyle = styled(P)`
  color: #04a287;
  font-size: 18px;
  padding-bottom: 10px;

  &:last-of-type {
    padding-bottom: 0;
  }
`;

const Note = styled(P)`
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.2px;
  span {
    font-weight: 600;
  }
`;

const Brokerage = styled(H2)`
  margin: 40px 0px 20px 0px;
`;

export const BackBtn = styled(Button)`
  background-color: var(--brand-green);
  svg {
    margin-right: 5px;
  }
`;

const BrokerageOptions = styled(Grid)`
  grid-auto-flow: row;
  overflow: hidden;
`;

const OpenAccountBtn = styled(Button)`
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  letter-spacing: 0.25px;
  @media (max-width: 900px) {
    margin-top: 30px;
  }
`;

type RibbonType = {
  teamPick: boolean;
};

const Ribbon = styled.div<RibbonType>`
  width: 50px;
  height: 70px;
  background-color: ${(props) =>
    props.teamPick ? '#fdbc00' : 'var(--brand-green)'};
  position: absolute;
  text-align: center;
  margin-left: 10px;
  padding: 5px;
  p {
    font-size: 12px;
    line-height: 15px;
    text-align: center;
    letter-spacing: 0.2px;
    font-weight: 600;
  }
  svg {
    font-size: 15px;
    margin-bottom: 5px;
  }
  &:before {
    content: '';
    position: absolute;
    z-index: 2;
    right: 0px;
    bottom: -15px;
    border-left: 24px solid
      ${(props) => (props.teamPick ? '#fdbc00' : 'var(--brand-green)')};
    border-right: 26px solid
      ${(props) => (props.teamPick ? '#fdbc00' : 'var(--brand-green)')};
    border-bottom: 15px solid transparent;
    border-bottom-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 15px;
  }
  &:after {
    content: '';
    width: 50px;
    height: 55px;
    position: absolute;
    z-index: -1;
    left: 0;
    bottom: -120px;
    background-color: white;
  }
`;

const NextStep = styled.span`
  float: right;
`;

type Props = {
  onboarding?: boolean;
};

const ConnectBrokerage = ({ onboarding }: Props) => {
  const authorized = useSelector(selectIsAuthorized);
  const brokerages = useSelector(selectBrokerages);
  const settings = useSelector(selectSettings);
  const maintenanceBrokerages = useSelector(selectMaintenanceBrokerages);
  const { openBrokerage } = useParams();
  const dispatch = useDispatch();
  const [confirmConnection, setConfirmConnection] = useState('');

  const checkBrokerageMaintenance = (brokerage: BrokerageType) => {
    if (
      maintenanceBrokerages.find((b: BrokerageType) => b.id === brokerage.id)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getBrokerageOptions = (brokerageName: string) => {
    return (
      brokerageOptions &&
      brokerageOptions.find((brokerage) => brokerage.name === brokerageName)
    );
  };

  const startConfirmConnection = (brokerageName: string) => {
    const options = getBrokerageOptions(brokerageName);

    const brokerage =
      brokerages &&
      brokerages.find((brokerage) => brokerage.name === brokerageName);
    if (options) {
      if (
        brokerage !== undefined &&
        checkBrokerageMaintenance(brokerage) === true
      ) {
        toast.error(
          `${brokerage.name} is currently undergoing maintenance and cannot establish new connections at this time. Please try again later.`,
        );
      } else {
        if (options.confirmPrompt !== null) {
          setConfirmConnection(brokerageName);
        } else {
          startConnection(brokerageName, options.defaultConnectionType);
        }
      }
    }
  };

  const startConnection = (brokerageName: string, connectionType: string) => {
    const brokerage =
      brokerages &&
      brokerages.find((brokerage) => brokerage.name === brokerageName);
    if (brokerage) {
      if (checkBrokerageMaintenance(brokerage) === true) {
        toast.error(
          `${brokerage.name} is currently undergoing maintenance and cannot establish new connections at this time. Please try again later.`,
        );
      } else if (brokerage.authorization_types[0].auth_type === 'TOKEN') {
        postData(`/api/v1/brokerages/${brokerage.id}/authorize/`, {
          type: connectionType,
        }).then((response) => {
          dispatch(replace(`/connect/${brokerage.name.toLowerCase()}`));
        });
      } else {
        postData(`/api/v1/brokerages/${brokerage.id}/authorize/`, {
          type: connectionType,
        })
          .then((response) => {
            window.location = response.data.url;
          })
          .catch((error) => {
            toast.error(
              `${brokerage.name} is currently experiencing connection issues and cannot establish new connections at this time. Please try again later.`,
            );
          });
      }
    }
  };

  const brokerageOptions: any[] = [
    {
      id: 'questrade',
      name: 'Questrade',
      displayName: 'Questrade',
      connect: () => {
        startConnection('Questrade', 'read');
      },
      defaultConnectionType: 'read',
      openURL: 'https://www.questrade.com/account-selection?oaa_promo=passiv',
      major: true,
      logo: QuestradeLogo,
      confirmPrompt: null,
      description: (
        <P>
          Rated as Canada's best online brokerage by MoneySense in 2019,
          Questrade is a great choice for Canadians to manage their wealth.
          Questrade has low fees, excellent customer support, and will even
          cover your account transfer costs up to $150.
        </P>
      ),
      type: 'traditional',
      teamPick: true,
    },
    {
      id: 'alpaca',
      name: 'Alpaca',
      displayName: 'Alpaca',
      connect: () => {
        startConnection('Alpaca', 'trade');
      },
      defaultConnectionType: 'trade',
      openURL: 'https://app.alpaca.markets/signup',
      major: true,
      logo: AlpacaLogo,
      confirmPrompt: null,
      description: (
        <P>
          Alpaca is a commission-free API-first brokerage servicing the USA and
          beyond.
        </P>
      ),
      type: 'traditional',
      teamPick: false,
    },
    {
      id: 'allyinvest',
      name: 'Ally Invest',
      displayName: 'Ally Invest',
      connect: () => {
        startConnection('Ally Invest', 'trade');
      },
      defaultConnectionType: 'trade',
      openURL: 'https://www.ally.com/invest/',
      major: true,
      logo: AllyLogo,
      confirmPrompt: null,
      description: (
        <P>
          Ally aims to change the online banking landscape with innovative
          digital experiences. It offers securities-brokerage and
          investment-advisory services through Ally Invest.
        </P>
      ),
      type: 'traditional',
    },
    {
      id: 'interactivebrokers',
      name: 'Interactive Brokers',
      displayName: 'IBKR',
      connect: () => {
        startConnection('Interactive Brokers', 'trade');
      },
      defaultConnectionType: 'trade',
      openURL: 'https://www.interactivebrokers.com/en/home.php',
      major: true,
      logo: InteractiveBrokersLogo,
      confirmPrompt: (
        <ShadowBox>
          <P>
            Due to the nature of Interactive Broker's API, some features are
            limited when connecting.
          </P>
          <P>These features include:</P>
          <VerticalPadding>
            <BulletUL>
              <Li>
                IBKR takes between 24 to 48 hours to fully connect and load in
                data to Passiv. If you have still not loaded in data after 48
                hours then please{' '}
                <PreLoadLink path={CONTACT_FORM_PATH}>
                  contact support
                </PreLoadLink>
                .
              </Li>
              <Li>Only IBKR Pro accounts are supported by Passiv.</Li>
              <Li>
                Due to limitations in IBKR's API, Passiv is unable to support
                fractional share units.
              </Li>
              <Li>
                Certain features, such as One-Click Trades, are not available
                through IBKR Canada. Other countries should work fine.
              </Li>
              <Li>
                Certain assets, such as mutual funds and GICs, are not supported
                by Passiv and may not appear in your account positions.
                Non-investment accounts, such as credit cards or chequing
                accounts, will also not be shown.
              </Li>
              <Li>
                Interactive Brokers is an international brokerage and thus has
                limited time to do maintenance. If you are trying to connect
                outside of standard market hours (9:30am ET to 5:30pm ET) please
                wait and attempt to connect during market hours. Many brokerages
                typically do maintenance in the evenings and weekends, making it
                difficult to successfully connect during those times. If you
                find you are having issues connecting during this time frame,
                please{' '}
                <PreLoadLink path={CONTACT_FORM_PATH}>
                  contact support
                </PreLoadLink>
                .
              </Li>
            </BulletUL>
          </VerticalPadding>

          <P>By connecting, I understand and agree to these limitations.</P>
        </ShadowBox>
      ),
      description: (
        <P>
          Interactive Brokers is a brokerage that operates in 200+ countries.
          IBKR's low fees and advanced features will delight traders old and
          new.
        </P>
      ),
      type: 'traditional',
      teamPick: false,
    },
    {
      id: 'bitbuy',
      name: 'Bitbuy',
      displayName: 'Bitbuy',
      connect: () => {
        startConnection('Bitbuy', 'trade');
      },
      confirmPrompt: null,
      defaultConnectionType: 'trade',
      openURL: 'https://bitbuy.ca/en/getstarted',
      major: true,
      logo: BitbuyLogo,
      description: <P>Bitbuy is a Canadian cryptocurrency exchange.</P>,
      type: 'crypto',
      teamPick: false,
    },
    {
      id: 'tdameritrade',
      name: 'TD Ameritrade',
      displayName: 'TD Ameritrade',
      connect: () => {
        startConnection('TD Ameritrade', 'trade');
      },
      defaultConnectionType: 'trade',
      openURL: 'https://www.tdameritrade.com/home.page',
      major: true,
      logo: TDAmeritradeLogo,
      confirmPrompt: null,
      description: (
        <P>
          TD Ameritrade is one of the largest discount brokerages in the U.S.
          with over $1.3 trillion in client assets.
        </P>
      ),
      type: 'traditional',
      teamPick: false,
    },
    {
      id: 'tradier',
      name: 'Tradier',
      displayName: 'Tradier',
      connect: () => {
        startConnection('Tradier', 'trade');
      },
      defaultConnectionType: 'trade',
      openURL: 'https://brokerage.tradier.com/signup?platform=109',
      major: true,
      logo: TradierLogo,
      confirmPrompt: null,
      description: (
        <P>
          Tradier is a REST-based, open, and secure API for investors, advisors,
          and traders.
        </P>
      ),
      type: 'traditional',
      teamPick: false,
    },

    {
      id: 'kraken',
      name: 'Kraken',
      displayName: 'Kraken',
      connect: () => {
        startConnection('Kraken', 'trade');
      },
      openURL: 'https://www.kraken.com/sign-up',
      major: true,
      logo: KrakenLogo,
      defaultConnectionType: 'trade',
      confirmPrompt: null,
      description: (
        <P>
          Kraken is a US-based cryptocurrency exchange that allows users to
          trade more than 40 cryptocurrencies.
        </P>
      ),
      type: 'crypto',
      teamPick: false,
    },
    {
      id: 'unocoin',
      name: 'Unocoin',
      displayName: 'Unocoin',
      connect: () => {
        startConnection('Unocoin', 'trade');
      },
      openURL: 'https://www.unocoin.com/in',
      major: true,
      logo: UnocoinLogo,
      defaultConnectionType: 'trade',
      confirmPrompt: null,
      description: (
        <P>
          Unocoin is India's most trusted place to trade Bitcoin (BTC), Ether
          (ETH) and Tether (USDT) and the largest ecosystem of traders in the
          country.
        </P>
      ),
      type: 'crypto',
      teamPick: false,
    },
    {
      id: 'wealthica',
      name: 'Wealthica',
      displayName: 'Wealthica',
      connect: () => {
        startConnection('Wealthica', 'read');
      },
      defaultConnectionType: 'read',
      openURL: 'https://wealthica.com/',
      major: true,
      logo: WealthicaLogo,
      confirmPrompt: (
        <ShadowBox>
          <P>
            Due to the nature of Wealthica's aggregation service, certain Passiv
            features will be limited on accounts linked through Wealthica.
          </P>
          <P>These features include:</P>
          <VerticalPadding>
            <BulletUL>
              <Li>
                Data from Wealthica is not a real-time representation of your
                investment account. This may affect the accuracy of your
                calculated trades, account balances, and positions in Passiv.
              </Li>
              <Li>
                Certain features, such as One-Click Trades, are not available
                through Wealthica. To get the best Passiv experience, move your
                investments to one of our brokerage partners.
              </Li>
              <Li>
                Certain assets, such as mutual funds and GICs, are not supported
                by Passiv and may not appear in your account positions.
                Non-investment accounts, such as credit cards or chequing
                accounts, will also not be shown.
              </Li>
            </BulletUL>
          </VerticalPadding>
          <P>
            Read more about these limitations in our{' '}
            <A
              href="https://passiv.com/help/tutorials/how-to-view-holdings-outside-passiv-brokerage-partners/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wealthica Guide
            </A>
            .
          </P>
          <P>By connecting, I understand and agree to these limitations.</P>
        </ShadowBox>
      ),
      description: (
        <P>
          Wealthica is a 3rd party account aggregator for your brokerage
          account.
        </P>
      ),
      type: 'aggregator',
      teamPick: false,
    },
    {
      id: 'zerodha',
      name: 'Zerodha',
      displayName: 'Zerodha',
      connect: () => {
        startConnection('Zerodha', 'trade');
      },
      confirmPrompt: null,
      defaultConnectionType: 'trade',
      openURL: 'https://zerodha.com/open-account/',
      major: true,
      logo: ZerodhaLogo,
      description: (
        <P>
          Zerodha is the largest stock brokerage firm in India with more than 4
          million clients.
        </P>
      ),
      type: 'traditional',
      teamPick: false,
    },
  ];

  if (authorized === undefined || !brokerages) {
    return <FontAwesomeIcon icon={faSpinner} spin />;
  }

  let contents = (
    <React.Fragment>
      <H1>Connect Your Brokerage</H1>
      <Description>
        In order to help you manage your portfolio, Passiv needs to connect to
        your brokerage account.
      </Description>
      <Note>
        <span>Important:</span> Your login details are secure with your
        brokerage. Connecting your account does not allow Passiv to see your
        login information.
      </Note>

      <Brokerage>Traditional</Brokerage>
      <React.Fragment>
        <Container3Column columns="1fr 1fr 1fr">
          {brokerageOptions.map((brokerage: any) => {
            let contents = null;
            if (brokerages.some((b) => b.name === brokerage.name)) {
              contents = (
                <>
                  {brokerage.name === 'Questrade' && (
                    <Ribbon teamPick={false}>
                      <FontAwesomeIcon icon={faStar} color="white" />
                      <P>Free Elite</P>
                    </Ribbon>
                  )}
                  <AuthBox
                    key={brokerage.id}
                    onClick={() => startConfirmConnection(brokerage.name)}
                  >
                    <LogoContainer>
                      <img
                        src={brokerage.logo}
                        alt={`${brokerage.name} Logo`}
                      />
                    </LogoContainer>
                    <AuthLink>Connect {brokerage.displayName}</AuthLink>
                  </AuthBox>
                </>
              );
            }
            if (brokerage.type === 'traditional') {
              return contents;
            } else {
              return null;
            }
          })}
        </Container3Column>
        <Brokerage>Crypto</Brokerage>
        <Container3Column columns="1fr 1fr 1fr">
          {brokerageOptions.map((brokerage: any) => {
            let contents = null;
            if (brokerages.some((b) => b.name === brokerage.name)) {
              contents = (
                <AuthBox
                  key={brokerage.id}
                  onClick={() => startConfirmConnection(brokerage.name)}
                >
                  <LogoContainer>
                    <img src={brokerage.logo} alt={`${brokerage.name} Logo`} />
                  </LogoContainer>
                  <AuthLink>Connect {brokerage.displayName}</AuthLink>
                </AuthBox>
              );
            }
            if (brokerage.type === 'crypto') {
              return contents;
            } else {
              return null;
            }
          })}
        </Container3Column>
        <Brokerage>Aggregators</Brokerage>
        <Container3Column columns="1fr 1fr 1fr">
          {brokerageOptions.map((brokerage: any) => {
            let contents = null;
            if (brokerages.some((b) => b.name === brokerage.name)) {
              contents = (
                <AuthBox
                  key={brokerage.id}
                  onClick={() => startConfirmConnection(brokerage.name)}
                >
                  <LogoContainer>
                    <img src={brokerage.logo} alt={`${brokerage.name} Logo`} />
                  </LogoContainer>
                  <AuthLink>Connect {brokerage.displayName}</AuthLink>
                </AuthBox>
              );
            }
            if (brokerage.type === 'aggregator') {
              return contents;
            } else {
              return null;
            }
          })}
        </Container3Column>
      </React.Fragment>
    </React.Fragment>
  );

  var output = null;
  if (confirmConnection) {
    const options = getBrokerageOptions(confirmConnection);
    output = (
      <React.Fragment>
        <Brokerage>Connect {options.name}</Brokerage>
        <Description>
          Please read and understand the following information before connecting
          to {options.name}.
        </Description>
        {options.confirmPrompt}
        <LinkContainer>
          <Button
            onClick={() =>
              startConnection(options.name, options.defaultConnectionType)
            }
          >
            Connect
          </Button>
          <Button onClick={() => setConfirmConnection('')}>Cancel</Button>
        </LinkContainer>
      </React.Fragment>
    );
  } else {
    if (openBrokerage === 'open') {
      output = (
        <ShadowBox background="var(--brand-light-green)">
          {onboarding && <OnboardingProgress currentStep={1} />}
          <H1>Open a brokerage account</H1>
          <Description>
            Passiv is a service that helps you manage your portfolio in a
            brokerage account. Since Passiv is not a brokerage firm, you will
            need your own brokerage account in order to use Passiv. We partner
            with select brokerage firms in order to provide the best experience.
          </Description>
          <AuthP>
            Follow a link below to create a brokerage account with one of our
            partners.
          </AuthP>
          <BrokerageOptions columns="repeat(2, auto)">
            {brokerageOptions.map((brokerage: any) => {
              return (
                <Brokerage>
                  {brokerage.teamPick && (
                    <Ribbon teamPick={true}>
                      <FontAwesomeIcon icon={faStar} color="white" />
                      <P>Team Pick</P>
                    </Ribbon>
                  )}

                  <OpenBox>
                    <BiggerLogoContainer>
                      <img
                        src={brokerage.logo}
                        alt={`${brokerage.name} Logo`}
                      />
                    </BiggerLogoContainer>
                    <GrowBox>{brokerage.description}</GrowBox>
                    <OpenAccountBtn
                      onClick={() => {
                        window.location = brokerage.openURL;
                      }}
                    >
                      Open
                      {'aeiou'.includes(brokerage.name[0].toLowerCase())}{' '}
                      {brokerage.displayName} Account
                    </OpenAccountBtn>
                  </OpenBox>
                </Brokerage>
              );
            })}
          </BrokerageOptions>
          <LinkContainer>
            <BackBtn onClick={() => dispatch(push('/welcome'))}>
              <FontAwesomeIcon icon={faLongArrowAltLeft} /> Go Back
            </BackBtn>
          </LinkContainer>
        </ShadowBox>
      );
    } else {
      output = (
        <React.Fragment>
          {contents}
          <React.Fragment>
            {onboarding ? (
              <LinkContainer>
                <VerticalPadding>
                  <Button onClick={() => dispatch(push('/connect/open'))}>
                    I don't have a brokerage account
                  </Button>
                </VerticalPadding>
                <VerticalPadding>
                  <BackBtn
                    onClick={() => dispatch(updateOnboardingStep(0, settings))}
                  >
                    <FontAwesomeIcon icon={faLongArrowAltLeft} /> Go Back
                  </BackBtn>
                  {authorized && (
                    <NextStep>
                      <Continue
                        onClick={() =>
                          dispatch(updateOnboardingStep(2, settings))
                        }
                      >
                        Next Step
                        <FontAwesomeIcon icon={faLongArrowAltRight} size="lg" />
                      </Continue>
                    </NextStep>
                  )}
                </VerticalPadding>
              </LinkContainer>
            ) : (
              <LinkContainer>
                <VerticalPadding>
                  <BackBtn onClick={() => dispatch(push('/settings'))}>
                    <FontAwesomeIcon icon={faLongArrowAltLeft} /> Go Back
                  </BackBtn>
                </VerticalPadding>
              </LinkContainer>
            )}
          </React.Fragment>
        </React.Fragment>
      );
    }
  }

  if (!onboarding) {
    return (
      <ShadowBox background="var(--brand-light-green)">{output}</ShadowBox>
    );
  } else {
    return output;
  }
};

export default ConnectBrokerage;
