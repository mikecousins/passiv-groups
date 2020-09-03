import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthorizations } from '../selectors';
import ShadowBox from '../styled/ShadowBox';
import styled from '@emotion/styled';
import { selectReferralCode } from '../selectors/referrals';
import { getData } from '../api';
import { Chart } from 'react-charts';

interface Referral {
  created_date: Date;
  validated: boolean;
  amount?: any;
  validation_timestamp?: Date;
  currency?: any;
}

export const ReferralHeading = styled.h3`
  background: #fff;
  display: inline-block;
  position: relative;
  padding: 0 15px;
  margin-bottom: 20px;
  font-size: 2.5em;
`;

const AffiliateTermDiv = styled.div`
  font-size: 1.4em;
  padding-bottom: 20px;
  line-height: 1.4;
  ul li {
    margin-left: 20px;
    list-style-type: disc;
  }
`;

const ReferralManager = () => {
  const authorizations = useSelector(selectAuthorizations);
  const referralCode = useSelector(selectReferralCode);
  const referralURL = 'https://passiv.com/?ref=' + referralCode;
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [signUpData, setSignUpData] = useState<(number | string)[][]>([]);
  const [validationData, setValidationData] = useState<(number | string)[][]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [success, setSuccess] = useState(false);

  if (loading === false && success === false) {
    setLoading(true);
    getData('/api/v1/referrals/')
      .then(response => {
        setReferrals(response.data);
        setLoading(false);
        setSuccess(true);
        setSignUpData(getSignUpData(referrals));
        setValidationData(getValidationData(referrals));
      })
      .catch(err => {
        setLoading(false);
        setError(err.response.data);
        console.log(error);
      });
  }

  const eliteUpgrades = referrals.filter((x, i) => x.validated).length;
  const numberOfSignups = referrals.length;

  let data = React.useMemo(
    () => [
      {
        label: 'Signups',
        data: signUpData,
        color: '#003ba2',
      },
      {
        label: 'Elite Upgrades',
        data: validationData,
        color: '#04a286',
      },
    ],
    [signUpData, validationData],
  );

  const series = React.useMemo(() => ({ type: 'bar' }), []);

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom', stacked: true },
      { type: 'linear', position: 'left' },
    ],
    [],
  );

  if (!authorizations) {
    return null;
  } else if (authorizations.length === 0) {
    return null;
  }

  return (
    <ShadowBox>
      <ReferralHeading>The Passiv Referral Program</ReferralHeading>
      <AffiliateTermDiv>
        <p>
          We're excited to announce a new program through which you can earn
          money for signing your friends up for Passiv!
        </p>
      </AffiliateTermDiv>
      <AffiliateTermDiv>
        <ul>
          <li>
            Your custom referral link is:{' '}
            <a href={referralURL}>{referralURL}</a>
          </li>
          <li>
            Every Passiv user that signs up and upgrades to Elite using your
            link will <strong>earn you $20!</strong>.
          </li>
          <li>We send out payments each quarter.</li>
          <li>
            You can read the terms and conditions of our affiliate program{' '}
            <a href="https://passiv-files.s3.ca-central-1.amazonaws.com/Affiliates+-+Terms+and+Conditions.pdf">
              here
            </a>
            . By referring users to Passiv, you agree to be bound to this
            agreement.
          </li>
        </ul>
      </AffiliateTermDiv>
      <AffiliateTermDiv>
        <p>You can find information about your past referrals below:</p>
      </AffiliateTermDiv>

      <AffiliateTermDiv>
        <ul>
          <li>
            {numberOfSignups} {numberOfSignups === 1 ? 'person' : 'people'} have
            signed up using your referral link
          </li>
          <li>
            {eliteUpgrades} {eliteUpgrades === 1 ? 'person' : 'people'} have
            upgraded to Passiv Elite
          </li>
          <li>This has earned you ${eliteUpgrades * 20}</li>
        </ul>
      </AffiliateTermDiv>
      {signUpData?.length > 1 && (
        <div
          style={{
            height: '240px',
            margin: '5px',
          }}
        >
          <Chart data={data} axes={axes} series={series} tooltip />
        </div>
      )}
    </ShadowBox>
  );
};

export default ReferralManager;

const getSignUpData = (referrals: Referral[]) => {
  if (referrals.length === 0) {
    return [];
  }
  let weekNumber = 1;
  referrals = referrals.sort((a, b) => +a.created_date - +b.created_date);
  let startOfCurrentWeek = new Date(referrals[0].created_date);
  const today = new Date();
  const data = [];

  while (startOfCurrentWeek < today) {
    const oneWeekLater = new Date(startOfCurrentWeek.getTime() + 604800000);
    let numSignUps = getNumSignUps(referrals, startOfCurrentWeek, oneWeekLater);
    data.push([
      'Week ' + weekNumber + ' (' + formatDate(startOfCurrentWeek) + ')',
      numSignUps,
    ]);
    startOfCurrentWeek = oneWeekLater;
    weekNumber += 1;
  }

  return data;
};

const getValidationData = (referrals: Referral[]) => {
  if (referrals.length === 0) {
    return [];
  }
  let weekNumber = 1;
  referrals = referrals.sort((a, b) => +a.created_date - +b.created_date);
  let startOfCurrentWeek = new Date(referrals[0].created_date);
  const today = new Date();
  const data = [];

  while (startOfCurrentWeek < today) {
    const oneWeekLater = new Date(startOfCurrentWeek.getTime() + 604800000);
    let numValidated = getNumValidated(
      referrals,
      startOfCurrentWeek,
      oneWeekLater,
    );
    data.push([
      'Week ' + weekNumber + ' (' + formatDate(startOfCurrentWeek) + ')',
      numValidated,
    ]);
    startOfCurrentWeek = oneWeekLater;
    weekNumber += 1;
  }

  return data;
};

const getNumSignUps = (
  referrals: Referral[],
  startOfCurrentWeek: Date,
  oneWeekLater: Date,
) => {
  return referrals.filter(
    r =>
      new Date(r.created_date) >= startOfCurrentWeek &&
      new Date(r.created_date) < oneWeekLater,
  ).length;
};

const getNumValidated = (
  referrals: Referral[],
  startOfCurrentWeek: Date,
  oneWeekLater: Date,
) => {
  return referrals.filter(
    r =>
      r.validated === true &&
      r.validation_timestamp !== undefined &&
      new Date(r.validation_timestamp) >= startOfCurrentWeek &&
      new Date(r.validation_timestamp) < oneWeekLater,
  ).length;
};

const dtfMonth = new Intl.DateTimeFormat('en', { month: 'short' });

const formatDate = (date: Date) => {
  if (typeof date !== 'object') {
    return date;
  } else {
    return dtfMonth.format(date) + ' ' + date.getDate();
  }
};