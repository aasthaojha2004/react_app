import { useEffect, useState } from 'react';
import Widget from './Widget';
import { useLocalStorage } from '../hooks/useLocalStorage'; 
import { useSettings } from '../context/SettingsContext'; // ✅ Import theme context

function WeatherWidget({ id }) {
  const [weather, setWeather] = useLocalStorage(`weather-${id}`, null); 
  const [loading, setLoading] = useState(!weather);
  const [error, setError] = useState(null);

  const { settings } = useSettings(); // ✅ Access theme
  const isDark = settings.theme === "dark";

  useEffect(() => {
    if (weather) return; 

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.weatherapi.com/v1/current.json?key=1962b6514b7b42c296544645251308&q=Bengaluru'
        );
        const data = await res.json();
        setWeather(data); 
      } catch (err) {
        setError('Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [weather, setWeather]);

  return (
    <Widget
      id={id}
      description="Get the current weather conditions for your location."
    >
      {loading ? (
        <p className={isDark ? "text-gray-400" : "text-gray-500"}>
          Loading weather...
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className={isDark ? "text-gray-200" : "text-gray-700"}>
          <p className="text-xl font-semibold">
            {weather.location.name}, {weather.location.region}
          </p>
          <p className="text-2xl mt-2">
            {weather.current.temp_c}°C - {weather.current.condition.text}
          </p>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
            className="mt-2"
          />
        </div>
      )}
    </Widget>
  );
}

export default WeatherWidget;
