import React, { useEffect, useState } from "react";

interface TimerProps {
  expiryDate: string;
  onExpire: () => void; // Callback function when the timer expires
}

const Timer: React.FC<TimerProps> = ({ expiryDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, new Date(expiryDate).getTime() - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = Math.max(0, new Date(expiryDate).getTime() - Date.now());
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        clearInterval(interval);
        onExpire(); // Trigger the callback when the timer expires
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate, onExpire]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return <span>{formatTime(timeLeft)}</span>;
};

export default Timer;