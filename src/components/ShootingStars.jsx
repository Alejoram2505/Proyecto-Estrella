import { useEffect } from 'react';

export default function ShootingStars({ active, onBurst }) {
  useEffect(() => {
    if (!active) {
      return undefined;
    }

    let timeoutId;
    onBurst();

    const scheduleNextBurst = () => {
      timeoutId = window.setTimeout(() => {
        onBurst();
        scheduleNextBurst();
      }, 1600 + Math.random() * 2600);
    };

    scheduleNextBurst();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [active, onBurst]);

  return null;
}
