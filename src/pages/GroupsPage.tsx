import React from 'react';
import { Link } from 'react-router-dom';
import AccountsManager from '../components/AccountsManager';
import OnboardingProgress from '../components/OnboardingProgress';
import SubscriptionManager from '../components/SubscriptionManager';

const GroupsPage = () => (
  <div>
    <h1>Setup Your Account Groups</h1>
    <p>
      It's a good idea to create account groups so that you can set a target on
      top of multiple groups. For instance combine your spouse and your RRSPs
      and TFSAs into one group called retirement with one common target.
    </p>
    <p>This is a paid feature so you'll need to pay for it.</p>
    <SubscriptionManager />
    <button>Pay Now</button>
    <h3>Setup your groups</h3>
    <p>Here's the account drag and drop thingy.</p>
    <AccountsManager />
    <OnboardingProgress step={3} />
    <Link to="/app/initial-targets">Next</Link>
  </div>
);

export default GroupsPage;
