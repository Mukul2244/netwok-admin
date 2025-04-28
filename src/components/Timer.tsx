
import React, { useEffect, useState } from "react";

interface TimerProps {
  expiryDate: string;
  onExpire: () => void; // Callback function when the timer expires
}

const Timer: React.FC<TimerProps> = ({ expiryDate, onExpire }) => {
  const calculateTimeRemaining = () => {
    const now = new Date();
    const targetDate = new Date(expiryDate);
    return Math.max(0, targetDate.getTime() - now.getTime());
  };

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = calculateTimeRemaining();
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
    
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds.toString().padStart(2, "0")}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds.toString().padStart(2, "0")}s`;
    } else {
      return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
    }
  };

  return <span>{formatTime(timeLeft)}</span>;
};

export default Timer;