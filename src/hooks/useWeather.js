import { useEffect, useState } from 'react';

/**
 * Custom hook for fetching weather data
 * @param {string} apiKey - WeatherAPI.com API key
 * @param {string} locationQuery - Location query string (city name or coordinates)
 * @returns {Object} Weather data, status, and error
 */
export const useWeather = (apiKey, locationQuery) => {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');

  useEffect(() => {
    if (!apiKey || !locationQuery) {
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      const fetchWeather = async () => {
        setStatus('loading');
        setError(null);
        try {
          const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(locationQuery)}&days=1&aqi=yes&alerts=no`;
          const res = await fetch(url, { signal: controller.signal });
          
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'Weather fetch failed');
          }
          
          const data = await res.json();
          
          // Update current location display
          setCurrentLocation(
            data.location?.name
              ? `${data.location.name}${data.location.country ? `, ${data.location.country}` : ''}`
              : locationQuery
          );
          
          setWeather({
            current: {
              temp: data.current.temp_c,
              feelslike: data.current.feelslike_c,
              humidity: data.current.humidity,
              wind: data.current.wind_kph,
              condition: data.current.condition.text,
              icon: data.current.condition.icon,
              aqi: data.current.air_quality
                ? {
                    us: data.current.air_quality['us-epa-index'] || 0,
                    pm25: data.current.air_quality.pm2_5 || 0,
                    pm10: data.current.air_quality.pm10 || 0,
                    o3: data.current.air_quality.o3 || 0,
                    no2: data.current.air_quality.no2 || 0,
                    co: data.current.air_quality.co || 0
                  }
                : null
            },
            hourly: data.forecast?.forecastday[0]?.hour
              ? data.forecast.forecastday[0].hour.slice(0, 6).map((h) => ({
                  temp: h.temp_c,
                  time: h.time
                }))
              : []
          });
          setStatus('ready');
        } catch (err) {
          if (err.name === 'AbortError') return;
          setStatus('error');
          setError(err.message);
        }
      };

      fetchWeather();
    }, locationQuery.includes(',') ? 0 : 500); // Debounce search input by 500ms

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [apiKey, locationQuery]);

  return { weather, status, error, currentLocation };
};

