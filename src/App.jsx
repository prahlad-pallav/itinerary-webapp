import { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import ExpenseSplitter from './pages/ExpenseSplitter';
import HeroSection from './pages/HeroSection';
import Filters from './components/Filters';
import DestinationGrid from './pages/DestinationGrid';
import WeatherWidget from './pages/WeatherWidget';
import TripPlanner from './pages/TripPlanner';
import { DESTINATIONS, WEATHER_LOCATIONS } from './constants/destinations';
import { useWeather } from './hooks/useWeather';

const destinations = DESTINATIONS;
const weatherLocations = WEATHER_LOCATIONS;

export default function App() {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState('featured');
  const [plan, setPlan] = useState([]);
  const [weatherLocation, setWeatherLocation] = useState(weatherLocations[0]);
  const [weatherCitySearch, setWeatherCitySearch] = useState('');
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY || '';

  const locationQuery = weatherCitySearch.trim() || weatherLocation.query;
  const { weather, status: weatherStatus, currentLocation: currentWeatherLocation } = useWeather(
    apiKey,
    locationQuery
  );

  const filtered = useMemo(() => {
    let list = destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase())
    );

    if (tag !== 'All') {
      list = list.filter((d) => d.tags.includes(tag));
    }

    if (sort === 'price') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [search, tag, sort]);


  const addToPlan = (destination) => {
    setPlan((prev) => {
      const exists = prev.find((p) => p.id === destination.id);
      if (exists) {
        return prev.map((p) =>
          p.id === destination.id ? { ...p, nights: Math.min(p.nights + 1, 14) } : p
        );
      }
      return [...prev, { ...destination, nights: 5 }];
    });
  };

  const updateNights = (id, delta) => {
    setPlan((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nights = Math.min(21, Math.max(1, item.nights + delta));
          return { ...item, nights };
        })
        .filter((item) => item.nights > 0)
    );
  };

  const removeFromPlan = (id) => setPlan((prev) => prev.filter((item) => item.id !== id));

  const featuredDestination = destinations[0]; // Santorini Escape

  return (
    <div className="Page">
      <Navbar />
      <HeroSection featuredDestination={featuredDestination} />

      <WeatherWidget
        apiKey={apiKey}
        weather={weather}
        weatherStatus={weatherStatus}
        currentWeatherLocation={currentWeatherLocation}
        weatherCitySearch={weatherCitySearch}
        setWeatherCitySearch={setWeatherCitySearch}
        weatherLocation={weatherLocation}
        setWeatherLocation={setWeatherLocation}
      />

      <Filters search={search} setSearch={setSearch} tag={tag} setTag={setTag} sort={sort} setSort={setSort} />

      <DestinationGrid destinations={filtered} onAddToPlan={addToPlan} />

      <TripPlanner plan={plan} updateNights={updateNights} removeFromPlan={removeFromPlan} />

      <ExpenseSplitter />

      <footer className="Footer">
        <div>
          <h3>Ready to lock dates?</h3>
          <p className="Lede Lede--small">
            Finalize your shortlist, copy the itinerary, and share it with your travel crew.
          </p>
        </div>
        <div className="Footer__CtaRow">
          <button className="Button Button--primary">Share plan</button>
          <button className="Button Button--ghost">Download PDF</button>
        </div>
      </footer>
    </div>
  );
}

