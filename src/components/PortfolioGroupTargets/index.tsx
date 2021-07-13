import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadGroup, loadModelPortfolios } from '../../actions';
import OrderTargetAllocations from '../PortfolioGroupSettings/OrderTargetAllocations';
import {
  selectCurrentGroupId,
  selectCurrentGroupTargetInitialized,
  selectCurrentGroupPositions,
  selectCurrentGroupInfoLoading,
  selectCurrentGroupTarget,
  selectGroupedAccounts,
  selectCurrentGroupInfo,
} from '../../selectors/groups';
import { Button } from '../../styled/Button';
import {
  H2,
  H3,
  P,
  OverlayContainer,
  DisabledBox,
} from '../../styled/GlobalElements';
import { getData, postData } from '../../api';
import styled from '@emotion/styled';
import ShadowBox from '../../styled/ShadowBox';
import LoadingOverlay from '../LoadingOverlay';
import TargetSelector from './TargetSelector';
import Tour from '../Tour/Tour';
import { SetupSteps } from '../Tour/TourSteps';
import { replace } from 'connected-react-router';
import Grid from '../../styled/Grid';
import { toast } from 'react-toastify';
import { selectModelPortfolios } from '../../selectors/modelPortfolios';
import { selectModelPortfolioFeature } from '../../selectors/features';
import { TypeBadge } from '../../pages/MyModelPortfoliosPage';

export const TargetContainer = styled.div`
  h2 {
    margin-bottom: 20px;
  }
  min-height: 200px;
`;

const H3LowProfile = styled(H3)`
  line-height: 1.3em;
  height: 3em;
  font-weight: 300;
  font-size: 24px;
`;

const CenteredDiv = styled.div`
  text-align: center;
  padding-top: 10px;
`;

const BorderBox = styled.div`
  text-align: center;
  padding: 20px;
  margin-top: 30px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #04a386;
`;

const Header = styled(Grid)`
  margin-bottom: 30px;
`;

const OrderTargetsContainer = styled.div`
  justify-self: end;
  @media (max-width: 900px) {
    margin-top: 20px;
  }
`;

const PortfolioInfo = styled.div`
  display: flex;
  @media (max-width: 900px) {
    margin-bottom: 30px;
    display: inline-block;
  }
`;

const ModelName = styled.div`
  font-weight: 700;
  font-size: 20px;
  margin-right: 10px;
  @media (max-width: 900px) {
    margin-bottom: 10px;
  }
`;

const TypeBadgeSmall = styled(TypeBadge)`
  font-size: 13px;
`;

type Props = {
  error: any | null;
};

const PortfolioGroupTargets = ({ error }: Props) => {
  const [loading, setLoading] = useState(false);
  const [showImportOverlay, setShowImportOverlay] = useState(false);
  const [showResetOverlay, setShowResetOverlay] = useState(false);
  const [model, setModel] = useState<string>();

  const groupId = useSelector(selectCurrentGroupId);
  const target = useSelector(selectCurrentGroupTarget);
  const targetInitialized = useSelector(selectCurrentGroupTargetInitialized);
  const positions = useSelector(selectCurrentGroupPositions);
  const loadingGroupInfo = useSelector(selectCurrentGroupInfoLoading);
  const groups = useSelector(selectGroupedAccounts);
  const groupInfo = useSelector(selectCurrentGroupInfo);
  const modelPortfolios = useSelector(selectModelPortfolios);
  const modelPortfolioFeature = useSelector(selectModelPortfolioFeature);

  const dispatch = useDispatch();

  const importDisabled = () => {
    return (
      positions !== null && positions !== undefined && positions.length === 0
    );
  };

  const isAssetClassBased = target?.isAssetClassBased;

  let targets: any;
  if (isAssetClassBased) {
    targets = target?.currentAssetClass;
  } else {
    targets = target?.currentTarget;
  }

  const modelChoices = [
    {
      id: 'IMPORT',
      name: modelPortfolioFeature
        ? 'Import your current holdings as a model'
        : 'Import your current holdings as a target',
      tourClass: 'tour-import-holdings',
      button: (
        <React.Fragment>
          <Button
            onClick={() => {
              if (modelPortfolioFeature) {
                importHoldingsAsAModel();
              } else {
                importTarget();
              }
            }}
            disabled={importDisabled()}
          >
            Import
          </Button>
          {importDisabled() && (
            <DisabledBox>
              Importing a target is not available because there are no open
              positions in your account.
            </DisabledBox>
          )}
        </React.Fragment>
      ),
    },
    {
      id: 'MANUAL',
      name: 'Build your target portfolio manually',
      button: (
        <Button
          onClick={() => {
            setModel('MANUAL');
            dispatch(replace(`/group/${groupId}?edit=true`));
          }}
        >
          Build
        </Button>
      ),
    },
    {
      id: 'NEW_MODEL',
      tourClass: 'tour-build-model',
      name: 'Create a new model',
      button: <Button onClick={() => newModel()}>New Model</Button>,
    },
    {
      id: 'USE_MODEL',
      name: 'Use an existing model',
      button: (
        <Button
          onClick={() => {
            setModel('USE_MODEL');
            dispatch(replace(`/models/group/${groupId}`));
          }}
        >
          Models
        </Button>
      ),
    },
  ];

  useEffect(() => {
    setModel(undefined);
  }, [groupId, targets, targetInitialized, error]);

  useEffect(() => {
    setShowImportOverlay(false);
    setShowResetOverlay(false);
  }, [targetInitialized]);

  const importTarget = () => {
    setLoading(true);
    setShowImportOverlay(true);
    postData('/api/v1/portfolioGroups/' + groupId + '/import/', {})
      .then(() => {
        setLoading(false);
        dispatch(loadGroup({ ids: [groupId] }));
      })
      .catch(() => {
        setLoading(false);
        setShowImportOverlay(false);
      });
  };
  const importHoldingsAsAModel = () => {
    let group: any;
    group = groups?.find((gp) => gp.groupId === groupId);

    setLoading(true);
    setShowImportOverlay(true);
    const importing = getData(
      '/api/v1/portfolioGroups/' + groupId + '/import/',
    );
    const createNewModel = postData('api/v1/modelPortfolio', {});

    Promise.all([importing, createNewModel])
      .then((responses) => {
        const holdings = responses[0].data;
        const model = responses[1].data;
        const modelId = model.model_portfolio.id;
        model.model_portfolio.name = `${group?.name} - Model Portfolio`;
        model.model_portfolio_security = holdings;

        postData(`api/v1/modelPortfolio/${modelId}`, model)
          .then(() => {
            dispatch(loadModelPortfolios());
            dispatch(
              replace(
                `/model-portfolio/${modelId}/group/${groupId}?apply=true`,
              ),
            );
          })
          .catch(() => {
            toast.error('Unable to import holdings');
            setLoading(false);
            setShowImportOverlay(false);
          });
      })
      .catch(() => {
        toast.error('Unable to import holdings');
        setLoading(false);
        setShowImportOverlay(false);
      });
  };

  const newModel = () => {
    postData('api/v1/modelPortfolio', {})
      .then((res) => {
        dispatch(loadModelPortfolios());
        dispatch(
          replace(
            `/model-portfolio/${res.data.model_portfolio.id}/group/${groupId}?apply=true`,
          ),
        );
      })
      .catch(() => toast.error('Unable to create a new model'));
  };

  const generateTargetForm = (lockable: boolean) => {
    let form;
    if (isAssetClassBased !== undefined) {
      form = (
        <TargetSelector
          isAssetClassBased={isAssetClassBased}
          target={targets}
          lockable={lockable}
          onReset={() => setShowResetOverlay(true)}
        />
      );
    }
    if (
      !targetInitialized ||
      (!loading &&
        target &&
        targets.filter((t: any) => t.is_supported === true).length === 0)
    ) {
      form = <ShadowBox>{form}</ShadowBox>;
    }
    return form;
  };

  const renderTargetChooser = () => {
    switch (model) {
      case 'CHOOSE':
        return <P>This shouldn't be visible ever.</P>;
      case 'IMPORT':
        return <P>This shouldn't be visible ever.</P>;
      case 'MANUAL':
        return generateTargetForm(false);
      default:
        return <P>This shouldn't be visible ever.</P>;
    }
  };

  const excludedErrorCodes = [2001];
  let excludedError = null;

  if (error !== null) {
    let errorCode = Number(error.code);
    excludedError = excludedErrorCodes.includes(errorCode);
  }

  if (error !== null && !excludedError) {
    return null;
  }

  // show a spinner if we don't have our data yet
  if (loadingGroupInfo) {
    return (
      <OverlayContainer>
        <ShadowBox>
          <TargetContainer>
            <H2>
              {modelPortfolioFeature ? 'Model Portfolio' : 'Target Portfolio'}
            </H2>
            <span>
              <FontAwesomeIcon icon={faSpinner} spin />
            </span>
          </TargetContainer>
        </ShadowBox>
        <LoadingOverlay />
      </OverlayContainer>
    );
  }

  // help them set a target if they don't have one yet
  if (
    !(targetInitialized && targets) &&
    !loading &&
    ((targets &&
      targets.filter(
        (t: any) => t.is_supported === true && t.is_excluded === false,
      ).length === 0) ||
      !target)
  ) {
    return (
      <OverlayContainer>
        <ShadowBox background="#DBFCF6">
          <H2>
            {' '}
            {modelPortfolioFeature ? 'Model Portfolio' : 'Target Portfolio'}
          </H2>
          {!model ? (
            <React.Fragment>
              <Tour steps={SetupSteps} name="setup_portfolio_tour" />
              <P>
                A{' '}
                {modelPortfolioFeature ? 'model Portfolio' : 'target Portfolio'}{' '}
                is how you tell Passiv what you want. You will need to choose
                which securities you want to hold and how you want your assets
                divided across those securities. Passiv will perform
                calculations to figure out what trades need to be made in order
                to follow your{' '}
                {modelPortfolioFeature ? 'model Portfolio' : 'target Portfolio'}
                .
              </P>
              <P>
                There is no{' '}
                {modelPortfolioFeature ? 'model Portfolio' : 'target Portfolio'}{' '}
                set for this account. Please choose one of the following
                options:
              </P>
              <Grid columns="1fr 1fr 1fr">
                {modelChoices.map((m) => {
                  if (m.id === 'MANUAL' && modelPortfolioFeature) {
                    return <></>;
                  }
                  if (
                    (m.id === 'USE_MODEL' || m.id === 'NEW_MODEL') &&
                    !modelPortfolioFeature
                  ) {
                    return <></>;
                  }
                  // do not show `Use existing models` option if there're no models
                  if (m.id === 'USE_MODEL' && modelPortfolios.length === 0) {
                    return <></>;
                  }
                  return (
                    <BorderBox key={m.id}>
                      <H3LowProfile className={m.tourClass}>
                        {m.name}
                      </H3LowProfile>
                      <CenteredDiv>{m.button}</CenteredDiv>
                    </BorderBox>
                  );
                })}
              </Grid>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <H3>{modelChoices.find((m: any) => m.id === model)!.name}</H3>
              {renderTargetChooser()}
              <Button onClick={() => setModel(undefined)}>Back</Button>
            </React.Fragment>
          )}
        </ShadowBox>
        {(showImportOverlay || showResetOverlay) && <LoadingOverlay />}
      </OverlayContainer>
    );
  }

  return (
    <OverlayContainer>
      <ShadowBox>
        <TargetContainer>
          <Header columns="1fr 1fr">
            <div>
              <H2>
                {modelPortfolioFeature ? 'Model Portfolio' : 'Target Portfolio'}
              </H2>
              {modelPortfolioFeature && groupInfo?.model_portfolio !== null && (
                <PortfolioInfo>
                  <ModelName>{groupInfo?.model_portfolio.name}</ModelName>{' '}
                  <TypeBadgeSmall>
                    {groupInfo?.model_portfolio.model_type === 0
                      ? 'Security Based Model'
                      : 'Asset Class Based Model'}
                  </TypeBadgeSmall>
                </PortfolioInfo>
              )}
            </div>
            <OrderTargetsContainer>
              <OrderTargetAllocations />
            </OrderTargetsContainer>
          </Header>

          {loading ? (
            <P>
              Importing targets... <FontAwesomeIcon icon={faSpinner} spin />
            </P>
          ) : (
            generateTargetForm(true)
          )}
        </TargetContainer>
      </ShadowBox>
      {(showImportOverlay || showResetOverlay) && <LoadingOverlay />}
    </OverlayContainer>
  );
};

export default PortfolioGroupTargets;
