
import React, { useState, useEffect } from 'react';
import { ThemeClasses, AccentColor } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface WeatherClockProps {
  themeClasses: ThemeClasses;
  accentColor: AccentColor;
}

const WeatherClock: React.FC<WeatherClockProps> = ({ themeClasses, accentColor }) => {
  const [time, setTime] = useState(new Date());
  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className={`flex flex-col items-end justify-center`}>
      <div className={`text-3xl font-bold tracking-tighter ${accentClasses.text} tabular-nums`}>
        {formatTime(time)}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-widest">
        {formatDate(time)}
      </div>
    </div>
  );
};

export default WeatherClock;
