import React, { useState, useEffect } from 'react';

export default function Timer({ expiryDate }: { expiryDate: string }) {
  const [remainingTime, setRemainingTime] = useState("00:00");

  const updateRemainingTime = () => {
    const expiryTime = new Date(expiryDate).getTime();
    const currentTime = new Date().getTime();
    // time in milliseconds
    const timeDifference = expiryTime - currentTime;

    if (timeDifference <= 0) {
      // Token expired
      setRemainingTime("00:00");
      return;
    }

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    setRemainingTime(
      `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    );
  };

  useEffect(() => {
    // Initialize and update every second
    const timer = setInterval(updateRemainingTime, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timer);
  }, [expiryDate]);

  return (
    <span>{remainingTime}</span>
  );
}

