import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postData } from '../../api';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { loadGroupInfo, loadGroups, loadModelPortfolios } from '../../actions';
import NameInputAndEdit from '../NameInputAndEdit';
import { ModelAssetClass } from '../../types/modelAssetClass';
import { useHistory } from 'react-router';
import {
  selectGroupInfoForModelPortfolio,
  selectGroupsUsingAModel,
} from '../../selectors/modelPortfolios';
import { FieldArray, Form, Formik } from 'formik';
import Grid from '../../styled/Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SymbolSelector from '../PortfolioGroupTargets/TargetBar/SymbolSelector';
import { Button } from '../../styled/Button';
import AssetClassSelector from './AssetClassSelector';
import { A } from '../../styled/GlobalElements';
import RouteLeavingPrompt from '../RouteLeavingPrompt';

const NameInputAndEditStyle = styled(NameInputAndEdit)`
  @media (max-width: 900px) {
    padding: 0;
  }
`;
const GridStyle = styled(Grid)`
  @media (max-width: 900px) {
    background: #edf0f3;
    padding: 12px 10px;
    position: relative;
    margin-bottom: 14px;
  }
`;
const Delete = styled.button`
  @media (max-width: 900px) {
    position: absolute;
    right: 2px;
    top: 4px;
  }
`;
export const Box = styled.div`
  border: 1px solid #bfb6b6;
  padding: 10px;
  margin-bottom: 20px;
  @media (max-width: 900px) {
    margin-right: 0;
    padding: 0;
    border: none;
  }
`;

const MainContainer = styled.div`
  @media (min-width: 900px) {
    margin: 10px;
  }
`;

export const Cash = styled.div`
  border-left: 5px solid var(--brand-green);
  line-height: 30px;
  padding: 10px;
  margin-bottom: 20px;
`;

export const CashPercentage = styled.div`
  font-size: 20px;
  font-weight: 900;
`;

const FormContainer = styled.div`
  position: relative;
  @media (min-width: 900px) {
    display: flex;
    border-bottom: 1px solid var(--brand-blue);
    margin-top: 20px;
  }
`;

const Percentage = styled.div`
  position: relative;
  border-right: 1px solid var(--brand-blue);
  padding: 9px 0 6px;
  width: 111px;
  display: flex;
  @media (max-width: 900px) {
    border: none;
    border-bottom: 1px solid #023ca2;
  }
`;

const PercentageInput = styled.input`
  color: var(--brand-blue);
  font-weight: 600;
  font-size: 18px;
  text-align: right;
  width: 100%;
  padding-right: 24px;
  -webkit-appearance: none;
  @media (max-width: 900px) {
    font-size: 24px;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const PercentageLabel = styled.label`
  color: var(--brand-blue);
  font-weight: 600;
  font-size: 18px;
  position: absolute;
  right: 3px;
  top: 10px;
`;

const Symbol = styled.span`
  font-size: 16px;
  margin-left: 10px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  padding-top: 13px;
  span {
    padding: 1px 3px;
    border: 1px solid #2a2e33;
    font-weight: 600;
    margin-right: 6px;
  }
  @media (max-width: 900px) {
    text-align: left;
    display: inline-block;
    margin-left: 0;
    white-space: inherit;
    line-height: 1.5;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 50px;
`;

const ApplyModelBtn = styled(Button)`
  font-weight: 600;
  background-color: transparent;
  color: var(--brand-blue);
  border: 1px solid var(--brand-blue);
  float: right;
  @media (max-width: 900px) {
    float: none;
    margin-top: 20px;
  }
`;

const CancelButton = styled(A)`
  margin-left: 20px;
  font-weight: 600;
`;

const ErroMsg = styled.ul`
  li {
    margin-top: 15px;
    padding-left: 10px;
    color: red;
  }
`;

export const StyledContainer = styled.div`
  background: #fff;
  display: inline-block;
  position: relative;
  top: -24px;
  margin-bottom: -7px;
  @media (min-width: 900px) {
    padding: 0 15px;
  }
`;

export const StyledName = styled.span`
  font-weight: 600;
  font-size: 30px;
`;

const EditModel = styled(Button)`
  font-weight: 600;
`;

type Props = {
  modelPortfolio: any;
  assetClasses: ModelAssetClass[];
  securityBased: boolean;
  modelTypeChanged: boolean;
};

const ModelPortoflioBox = ({
  modelPortfolio,
  assetClasses,
  securityBased,
}: Props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [modelPortfolioName, setModelPortfolioName] = useState(
    modelPortfolio.model_portfolio.name,
  );
  const [editName, setEditName] = useState(false);
  const [clearInputSelector, setClearInputSelector] = useState(0);

  const group = useSelector(selectGroupInfoForModelPortfolio);
  const groupsUsingModel = useSelector(selectGroupsUsingAModel);

  const groupInfo = group.groupInfo;
  const groupId = groupInfo?.groupId;
  const editMode = group.edit;
  const applyMode = group.apply;

  let model: any = modelPortfolio.model_portfolio_asset_class;
  if (securityBased) {
    model = modelPortfolio.model_portfolio_security;
  }
  const modelId = modelPortfolio.model_portfolio.id;
  const assignedPortfolioGroups =
    modelPortfolio.model_portfolio.total_assigned_portfolio_groups;

  const toggleEditMode = () => {
    if (editMode) {
      history.replace(`/app/model-portfolio/${modelId}`);
    } else {
      history.replace(`/app/model-portfolio/${modelId}?edit=true`);
    }
  };

  const finishEditingName = () => {
    if (
      modelPortfolioName !== modelPortfolio.model_portfolio.name &&
      modelPortfolioName!.trim().length > 0
    ) {
      modelPortfolio.model_portfolio.name = modelPortfolioName;
      postData(
        `/api/v1/modelPortfolio/${modelPortfolio.model_portfolio.id}`,
        modelPortfolio,
      )
        .then(() => {
          dispatch(loadModelPortfolios());
          dispatch(loadGroupInfo());
        })
        .catch(() => {
          dispatch(loadModelPortfolios());
          toast.error(
            `${modelPortfolio.model_portfolio.name} Model Portfolio Name Update Failed`,
            { autoClose: 3000 },
          );
        });
    } else {
      setModelPortfolioName(modelPortfolio.model_portfolio.name);
    }
    setEditName(false);
  };

  const applyModel = () => {
    let gpId = groupId;
    if (modelId && !groupId) {
      gpId = groupsUsingModel?.[modelId]?.groups[0].id;
    }
    postData(`api/v1/portfolioGroups/${gpId}/modelPortfolio/${modelId}`, {})
      .then((res) => {
        dispatch(loadGroups()); // need to load all groups to have an updated list of groups using a model in my models page
        dispatch(loadModelPortfolios());
        if (editMode) {
          toast.success(
            `Changes are saved for "${modelPortfolio.model_portfolio.name}"`,
          );
        } else {
          toast.success(
            `"${modelPortfolio.model_portfolio.name}" applied to "${groupInfo?.name}"`,
          );
        }
        if (securityBased && groupId) {
          history.push(`/app/group/${gpId}`);
        }
        if (!securityBased && (gpId || applyMode)) {
          history.push(`/app/priorities/${gpId}`);
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.detail);
        } else {
          toast.error('Cannot apply model');
        }
      });
  };
  return (
    <Box>
      <NameInputAndEditStyle
        value={modelPortfolioName}
        edit={editName}
        allowEdit={true}
        editBtnTxt={'Edit Name'}
        onChange={(e: any) => setModelPortfolioName(e.target.value)}
        onKeyPress={(e: any) => e.key === 'Enter' && finishEditingName()}
        onClickDone={() => finishEditingName()}
        onClickEdit={() => setEditName(true)}
        StyledName={StyledName}
        StyledContainer={StyledContainer}
      />
      <MainContainer>
        <Formik
          initialValues={{
            targets: model,
            newTargetPercent: 0,
            cash: 0,
          }}
          enableReinitialize
          initialStatus={{ submitted: false }}
          validate={(values) => {
            const errors: any = {};
            const total = values.targets.reduce((sum: string, target: any) => {
              if (target.percent) {
                return (+sum + +target.percent).toFixed(3);
              }
              return sum;
            }, values.newTargetPercent);

            const cashPercentage = (100 - +total).toFixed(3);
            const roundedCashPercentage =
              Math.round(+cashPercentage * 1000) / 1000;
            if (roundedCashPercentage < -0 || roundedCashPercentage > 100) {
              errors.cash = 'Cash percentage should be between 0 and 100';
            }

            if (values.newTargetPercent < 0 || values.newTargetPercent > 100) {
              errors.newTargetPercent =
                'Percentage should be between 0 and 100';
            } else if (typeof values.newTargetPercent === 'string') {
              errors.newTargetPercent = 'Percentage should be a number';
            }
            return errors;
          }}
          onSubmit={(values, actions) => {
            if (securityBased) {
              modelPortfolio.model_portfolio_security = values.targets;
            } else {
              modelPortfolio.model_portfolio_asset_class = values.targets;
            }
            postData(`/api/v1/modelPortfolio/${modelId}`, modelPortfolio)
              .then(() => {
                dispatch(loadModelPortfolios());
                if (editMode && assignedPortfolioGroups > 0) {
                  applyModel();
                }
                actions.resetForm();
                actions.setSubmitting(false);
                actions.setStatus({ submitted: true });
                if (editMode) {
                  toggleEditMode();
                }
              })
              .catch((err) => {
                dispatch(loadModelPortfolios());
                if (err.response) {
                  toast.error(err.response.data.detail);
                }
              });
          }}
        >
          {(props) => (
            <Form>
              <FieldArray
                name="targets"
                render={(arrayHelpers) => {
                  const total = props.values.targets.reduce(
                    (sum: string, target: any) => {
                      if (target.percent) {
                        return (+sum + +target.percent).toFixed(3);
                      }
                      return sum;
                    },
                    props.values.newTargetPercent,
                  );
                  const cashPercentage = (100 - +total).toFixed(3);

                  let availableAssetClasses: any = [];
                  if (!securityBased) {
                    const usedAssetClasses = props.values.targets.map(
                      (astCls: any) => {
                        return astCls.model_asset_class?.id;
                      },
                    );
                    // filter out the asset classes that have been already added
                    availableAssetClasses = assetClasses.filter(
                      (ast) => !usedAssetClasses.includes(ast.id),
                    );
                  }

                  const handleAddToModel = (symbol: any) => {
                    if (props.isValid) {
                      if (securityBased) {
                        arrayHelpers.push({
                          symbol,
                          percent: props.values.newTargetPercent,
                        });
                      } else {
                        arrayHelpers.push({
                          model_asset_class: symbol,
                          percent: props.values.newTargetPercent,
                        });
                      }
                      props.setFieldValue('newTargetPercent', 0);
                      setClearInputSelector(clearInputSelector + 1);
                    }
                  };

                  return (
                    <>
                      <div>
                        <Cash key="cash">
                          <CashPercentage>
                            {cashPercentage}% Cash
                          </CashPercentage>
                        </Cash>
                      </div>
                      {props.values.targets.map(
                        (target: any, index: number) => {
                          if (editMode || applyMode) {
                            return (
                              <GridStyle columns="1fr 50px" key={index}>
                                <FormContainer
                                  style={{ borderColor: '#beb6b6' }}
                                >
                                  <Percentage>
                                    <PercentageInput
                                      type="number"
                                      name={`targets.${index}`}
                                      value={
                                        props.values.targets[index].percent
                                      }
                                      onChange={(e) =>
                                        props.setFieldValue(
                                          `targets.${index}.percent` as 'targets',
                                          parseFloat(e.target.value),
                                        )
                                      }
                                      required
                                    />
                                    <PercentageLabel htmlFor="percentage">
                                      %
                                    </PercentageLabel>
                                  </Percentage>
                                  <Symbol>
                                    {securityBased ? (
                                      <>
                                        <span>
                                          {
                                            props.values.targets[index].symbol
                                              ?.symbol
                                          }
                                        </span>
                                        {
                                          props.values.targets[index].symbol
                                            ?.description
                                        }
                                      </>
                                    ) : (
                                      <span>
                                        {
                                          props.values.targets[index]
                                            .model_asset_class?.name
                                        }
                                      </span>
                                    )}
                                  </Symbol>

                                  <br></br>
                                </FormContainer>
                                {(editMode || applyMode) && (
                                  <Delete
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    title="remove"
                                    aria-label="remove"
                                  >
                                    <FontAwesomeIcon
                                      icon={faTimes}
                                      size="lg"
                                      color="var(--grey-darkest)"
                                    />
                                  </Delete>
                                )}
                              </GridStyle>
                            );
                          } else {
                            return (
                              <Cash key={index}>
                                <CashPercentage style={{ fontWeight: 500 }}>
                                  {target.percent}%{' '}
                                  {securityBased
                                    ? target.symbol.symbol
                                    : target.model_asset_class.name}
                                </CashPercentage>
                              </Cash>
                            );
                          }
                        },
                      )}
                      {(editMode || applyMode) && (
                        <div style={{ marginTop: '30px' }}>
                          <FormContainer>
                            <Percentage>
                              <PercentageInput
                                id="percent"
                                name="newTargetPercent"
                                type="number"
                                onChange={props.handleChange}
                                value={props.values.newTargetPercent}
                                required
                              />
                              <PercentageLabel htmlFor="percentage">
                                %
                              </PercentageLabel>
                            </Percentage>
                            {securityBased ? (
                              <SymbolSelector
                                value={null}
                                onSelect={(symbol) => {
                                  handleAddToModel(symbol);
                                }}
                                clearInput={clearInputSelector}
                                groupId={
                                  groupId
                                    ? groupId
                                    : groupsUsingModel?.[modelId]?.groups[0].id
                                }
                                forModelSecurity={true}
                              />
                            ) : (
                              <AssetClassSelector
                                name="newTarget.model_asset_class"
                                id="symbol"
                                availableAssetClasses={availableAssetClasses}
                                clearInput={clearInputSelector}
                                onSelect={(symbol: any) => {
                                  handleAddToModel(symbol);
                                }}
                              />
                            )}
                          </FormContainer>
                          <ErroMsg>
                            {props.errors.newTargetPercent && (
                              <li>{props.errors.newTargetPercent}</li>
                            )}
                            {props.errors.cash && <li>{props.errors.cash}</li>}
                          </ErroMsg>
                        </div>
                      )}
                    </>
                  );
                }}
              />
              <ButtonContainer>
                {(editMode || applyMode) && (
                  <>
                    <EditModel
                      type="button"
                      onClick={() => {
                        props.handleSubmit();
                      }}
                      disabled={!props.dirty || !props.isValid}
                    >
                      Save Changes
                    </EditModel>
                  </>
                )}
                {editMode && (
                  <CancelButton
                    type="button"
                    onClick={() => {
                      toggleEditMode();
                      props.handleReset();
                    }}
                  >
                    Cancel
                  </CancelButton>
                )}
                {!props.dirty && applyMode && (
                  <ApplyModelBtn onClick={applyModel} type="button">
                    Apply to {groupInfo?.name}
                  </ApplyModelBtn>
                )}
              </ButtonContainer>
              <RouteLeavingPrompt
                when={props.dirty}
                navigate={(path) => history.push(path)}
              />
            </Form>
          )}
        </Formik>
        {!editMode && !applyMode && (
          <EditModel
            type="button"
            onClick={toggleEditMode}
            disabled={assignedPortfolioGroups > 1}
          >
            Edit Model
          </EditModel>
        )}
      </MainContainer>
    </Box>
  );
};

export default ModelPortoflioBox;
