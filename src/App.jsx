import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PackingPage from './pages/PackingPage';
import CalendarPage from './pages/CalendarPage';
import FlightHotelPage from './pages/FlightHotelPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packing" element={<PackingPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/flights-hotels" element={<FlightHotelPage />} />
      </Routes>
    </BrowserRouter>
  );
}

