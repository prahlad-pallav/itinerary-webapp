import PropTypes from 'prop-types';
import { WEATHER_LOCATIONS } from '../constants/destinations';
import { getAQILevel } from '../utils/aqi';
import './WeatherWidget.css';

/**
 * Weather widget component
 * @param {string} apiKey - WeatherAPI.com API key
 * @param {Object} weather - Weather data object
 * @param {string} weatherStatus - Weather loading status
 * @param {string} currentWeatherLocation - Current location name
 * @param {string} weatherCitySearch - City search input value
 * @param {Function} setWeatherCitySearch - Function to update city search
 * @param {Object} weatherLocation - Selected weather location
 * @param {Function} setWeatherLocation - Function to update weather location
 */
export default function WeatherWidget({
  apiKey,
  weather,
  weatherStatus,
  currentWeatherLocation,
  weatherCitySearch,
  setWeatherCitySearch,
  weatherLocation,
  setWeatherLocation
}) {
  return (
    <section id="weather" className="Weather">
      <div className="Weather__Header">
        <div>
          <p className="Pill Pill--dark">Live weather</p>
          <h2>Check conditions before you book</h2>
          <p className="Lede Lede--small">
            Powered by{' '}
            <a
              href="https://www.weatherapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#60a5fa', textDecoration: 'underline' }}
            >
              WeatherAPI.com
            </a>
            . Weather data loaded from environment configuration.
          </p>
        </div>
        <div className="Weather__Controls">
          <div className="Weather__InputGroup">
            <label>Search City</label>
            <input
              type="text"
              value={weatherCitySearch}
              onChange={(e) => {
                setWeatherCitySearch(e.target.value);
                if (e.target.value.trim()) {
                  setWeatherLocation(WEATHER_LOCATIONS[0]);
                }
              }}
              placeholder="Enter city name (e.g., New York, London)"
              disabled={!apiKey}
              style={{ fontSize: '14px', padding: '10px 12px' }}
            />
          </div>
          <div className="Weather__InputGroup">
            <label>Or Select Location</label>
            <select
              value={weatherLocation.id}
              onChange={(e) => {
                setWeatherLocation(
                  WEATHER_LOCATIONS.find((loc) => loc.id === e.target.value) ?? WEATHER_LOCATIONS[0]
                );
                setWeatherCitySearch('');
              }}
              disabled={!apiKey || !!weatherCitySearch.trim()}
            >
              {WEATHER_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="Weather__Grid">
        <div className="WeatherCard">
          {!apiKey && (
            <div className="Weather__Placeholder">
              <p className="Hint">
                Weather API key not configured. Please add VITE_WEATHER_API_KEY to your .env file.
              </p>
            </div>
          )}
          {apiKey && weatherStatus === 'loading' && <p className="Hint">Loading weather...</p>}
          {apiKey && weatherStatus === 'error' && (
            <p className="Hint">Unable to load weather. Please check your API key and try again.</p>
          )}
          {weatherStatus === 'ready' && weather?.current && (
            <>
              <div className="WeatherCard__Main">
                <div>
                  <p className="Eyebrow">{currentWeatherLocation}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {weather.current.icon && (
                      <img
                        src={weather.current.icon}
                        alt={weather.current.condition}
                        style={{ width: '48px', height: '48px' }}
                      />
                    )}
                    <div>
                      <h3>{Math.round(weather.current.temp)}°C</h3>
                      <p className="Hint" style={{ margin: '4px 0 0', fontSize: '13px' }}>
                        {weather.current.condition}
                      </p>
                    </div>
                  </div>
                  <p className="Hint" style={{ marginTop: '8px' }}>
                    Feels like {Math.round(weather.current.feelslike)}°C
                  </p>
                </div>
                <div className="MiniMetrics">
                  <div>
                    <p className="Label">Humidity</p>
                    <p className="Value">{Math.round(weather.current.humidity)}%</p>
                  </div>
                  <div>
                    <p className="Label">Wind</p>
                    <p className="Value">{Math.round(weather.current.wind)} km/h</p>
                  </div>
                </div>
              </div>
              {weather.current.aqi && (
                <div className="AqiSection">
                  <div className="AqiSection__Main">
                    <div>
                      <p className="Label">Air Quality Index</p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginTop: '4px'
                        }}
                      >
                        <span
                          className="AqiBadge"
                          style={{
                            backgroundColor: getAQILevel(weather.current.aqi.us).bg,
                            color: getAQILevel(weather.current.aqi.us).color,
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '18px'
                          }}
                        >
                          {weather.current.aqi.us}
                        </span>
                        <span
                          style={{
                            color: getAQILevel(weather.current.aqi.us).color,
                            fontWeight: '600',
                            fontSize: '13px'
                          }}
                        >
                          {getAQILevel(weather.current.aqi.us).level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="AqiSection__Details">
                    <div className="AqiDetailItem">
                      <p className="Label">PM2.5</p>
                      <p className="Value">{weather.current.aqi.pm25.toFixed(1)}</p>
                    </div>
                    <div className="AqiDetailItem">
                      <p className="Label">PM10</p>
                      <p className="Value">{weather.current.aqi.pm10.toFixed(1)}</p>
                    </div>
                    <div className="AqiDetailItem">
                      <p className="Label">O₃</p>
                      <p className="Value">{weather.current.aqi.o3.toFixed(1)}</p>
                    </div>
                    <div className="AqiDetailItem">
                      <p className="Label">NO₂</p>
                      <p className="Value">{weather.current.aqi.no2.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              )}
              {weather.hourly.length > 0 && (
                <div className="WeatherCard__Subgrid">
                  {weather.hourly.map((hour, idx) => {
                    const time = new Date(hour.time);
                    const hourStr = time.getHours().toString().padStart(2, '0') + ':00';
                    return (
                      <div key={idx} className="MiniCard">
                        <p className="Label">{hourStr}</p>
                        <p className="Value">{Math.round(hour.temp)}°C</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        <div className="WeatherNote">
          <p className="Pill Pill--dark">Tip</p>
          <p className="Lede Lede--small">
            Use live temps to pick the best shoulder seasons. Cooler days often mean smaller crowds
            and better rates—perfect for flexible travelers.
          </p>
        </div>
      </div>
    </section>
  );
}

WeatherWidget.propTypes = {
  apiKey: PropTypes.string.isRequired,
  weather: PropTypes.object,
  weatherStatus: PropTypes.string.isRequired,
  currentWeatherLocation: PropTypes.string.isRequired,
  weatherCitySearch: PropTypes.string.isRequired,
  setWeatherCitySearch: PropTypes.func.isRequired,
  weatherLocation: PropTypes.object.isRequired,
  setWeatherLocation: PropTypes.func.isRequired
};

