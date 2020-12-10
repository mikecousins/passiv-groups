import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JoyRide from 'react-joyride';
import { postData } from '../../api';
import { selectShowInAppTour } from '../../selectors/features';
import { selectContextualMessages, selectTakeTour } from '../../selectors';
import { loadSettings } from '../../actions';
import { toast } from 'react-toastify';

type Props = {
  steps: any;
  name: string;
};

const Tour = ({ steps, name }: Props) => {
  const dispatch = useDispatch();
  const showInAppTour = useSelector(selectShowInAppTour);
  const messages = useSelector(selectContextualMessages);
  const showTour = useSelector(selectTakeTour);
  const [showMessage, setShowMessage] = useState(false);

  const handleJoyrideCallback = (data: any) => {
    if (
      data.action === 'skip' ||
      (data.action === 'next' && data.status === 'finished')
    ) {
      postData(`/api/v1/contextualMessages`, {
        name: [name],
      })
        .then(() => {
          dispatch(loadSettings());
        })
        .catch(() => {
          toast.error(`Failed to skip tour "${name}".`);
        });
    }
  };

  useEffect(() => {
    if (messages) {
      messages.map((msg: string) => {
        if (msg === name) {
          setShowMessage(true);
        }
        return null;
      });
    }
  }, [messages, name]);

  return (
    <>
      {/* show tour if: user have access to this feature, the message hasn't been
      acknowledged, and the tour is not off */}
      {showInAppTour && showTour && showMessage && (
        <JoyRide
          callback={handleJoyrideCallback}
          steps={steps}
          showProgress
          continuous={true}
          showSkipButton={true}
          disableScrolling
          locale={{
            last: 'Hide tour',
            skip: 'Hide tour',
            close: 'Hide tour',
          }}
          styles={{
            tooltip: {
              fontSize: 18,
            },
            options: {
              primaryColor: 'orange',
            },
            buttonBack: {
              color: 'var(--brand-blue)',
            },
            buttonNext: {
              backgroundColor: 'var(--brand-blue)',
            },
          }}
        />
      )}
    </>
  );
};

export default Tour;