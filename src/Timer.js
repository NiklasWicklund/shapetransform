import React, { useState, useEffect } from 'react';

const Timer = ({ isSolved,start,timerStarted }) => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setMilliseconds(prevMilliseconds => prevMilliseconds + 10);
      }, 10);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    setIsRunning(!isSolved)
  }, [isSolved]);
  useEffect(() => {
    if (start) {
      timerStarted();
      setIsRunning(true);
      setMilliseconds(0);
    }
  }, [start]);

  // Calculate seconds and milliseconds
  const seconds = Math.floor(milliseconds / 1000);
  const formattedMilliseconds = String(milliseconds % 1000).padStart(3, '0').slice(0, 2); // Get only 2 decimal places

  return (
    <div>
      <div>
        {seconds < 10 ? '0' + seconds : seconds}:{formattedMilliseconds}
      </div>
    </div>
  );
};

export default Timer;
