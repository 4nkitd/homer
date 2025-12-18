
import React, { useState, useEffect } from 'react';
import { AccentColor, ThemeClasses } from '../types';
import { ACCENT_COLOR_CLASSES } from '../constants';

interface WeatherPillProps {
  weatherCity: string;
  accentColor: AccentColor;
  themeClasses: ThemeClasses;
}

const WEATHER_CACHE_KEY = 'dashboard-weather-cache';
const SIX_HOURS = 6 * 60 * 60 * 1000;

const WeatherPill: React.FC<WeatherPillProps> = ({ weatherCity, accentColor, themeClasses }) => {
  const [weather, setWeather] = useState<{ temp: string; desc: string } | null>(null);

  useEffect(() => {
    if (!weatherCity) return;

    const fetchWeather = async (force = false) => {
      try {
        if (!force) {
          const cached = localStorage.getItem(WEATHER_CACHE_KEY);
          if (cached) {
            const { data, timestamp, city } = JSON.parse(cached);
            if (city === weatherCity && Date.now() - timestamp < SIX_HOURS) {
              setWeather(data);
              return;
            }
          }
        }

        const res = await fetch(`https://wttr.in/${weatherCity}?format=%t+%C`);
        if (res.ok) {
          const text = await res.text();
          const [temp, ...descParts] = text.split(' ');
          const weatherData = { temp, desc: descParts.join(' ') };
          setWeather(weatherData);
          localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
            data: weatherData,
            timestamp: Date.now(),
            city: weatherCity
          }));
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
    const weatherTimer = setInterval(() => fetchWeather(true), SIX_HOURS);
    return () => clearInterval(weatherTimer);
  }, [weatherCity]);

  const accentClasses = ACCENT_COLOR_CLASSES[accentColor];

  if (!weather) return null;

  return (
    <div className="flex items-center space-x-3 text-gray-300 animate-fadeIn shrink-0">
      <div className={`flex items-center ${themeClasses.card} border ${themeClasses.border} rounded-xl px-4 py-2 shadow-sm h-[52px]`}>
        <span className={`${accentClasses.text} text-2xl font-bold mr-3`}>{weather.temp}</span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-gray-200 capitalize truncate max-w-[100px]">{weather.desc}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] truncate max-w-[100px]">{weatherCity}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherPill;
