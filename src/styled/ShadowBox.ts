import styled from '@emotion/styled';
import { css } from '@emotion/core';

type Props = {
  background?: string;
};

const dynamicColor = ({ background }: Props) =>
  css`
    background: ${background};
  `;

const ShadowBox = styled.div<Props>`
  background: var(--white);
  border-radius: 4px;
  box-shadow: var(--box-shadow);
  padding: 20px 20px 20px;
  margin-bottom: 20px;
  @media (max-width: 900px) {
    padding: 10px;
  }
  ${dynamicColor};
`;

export default ShadowBox;
