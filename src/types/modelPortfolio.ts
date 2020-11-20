import { Symbol } from './groupInfo';
import { ModelAssetClass } from './modelAssetClass';

export type ModelPortfolioDetailsType = {
  model_portfolio: ModelPortfolio;
  model_portfolio_asset_class: ModelAssetClassWithPercentage[];
  model_portfolio_security: TargetWithPercentage[];
};

export type ModelPortfolio = {
  id?: string;
  name: string;
  model_type: number;
};

export type TargetWithPercentage = {
  symbol: Symbol;
  percent: number;
};

export type ModelAssetClassWithPercentage = {
  model_asset_class: ModelAssetClass;
  percent: number;
};