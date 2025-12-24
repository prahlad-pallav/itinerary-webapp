import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../components/common/SectionHeader';
import FormField from '../components/common/FormField';
import FormGrid from '../components/common/FormGrid';
import FormActions from '../components/common/FormActions';
import AlertModal from '../components/AlertModal';
import { MOCK_FLIGHTS, MOCK_HOTELS, generateMockFlights } from '../constants/flightHotelData';
import { searchFlights, transformFlightResults, getAirportSuggestions, extractAirportCode } from '../utils/serpApi';
import './FlightHotelSearch.css';

export default function FlightHotelSearch({ selectedDestination }) {
  const [activeTab, setActiveTab] = useState('flights'); // 'flights' or 'hotels'
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [useRealAPI, setUseRealAPI] = useState(true);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  
  const serpApiKey = import.meta.env.VITE_SERPAPI_KEY || '';

  // Flight search state
  const [flightSearch, setFlightSearch] = useState({
    origin: '',
    destination: selectedDestination?.location || '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  // Hotel search state
  const [hotelSearch, setHotelSearch] = useState({
    location: selectedDestination?.location || '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });

  // Set destination from props if available
  useEffect(() => {
    if (selectedDestination) {
      setFlightSearch(prev => ({ ...prev, destination: selectedDestination.location }));
      setHotelSearch(prev => ({ ...prev, location: selectedDestination.location }));
    }
  }, [selectedDestination]);

  // Update airport suggestions as user types
  useEffect(() => {
    if (flightSearch.origin) {
      setOriginSuggestions(getAirportSuggestions(flightSearch.origin));
    } else {
      setOriginSuggestions([]);
    }
  }, [flightSearch.origin]);

  useEffect(() => {
    if (flightSearch.destination) {
      setDestinationSuggestions(getAirportSuggestions(flightSearch.destination));
    } else {
      setDestinationSuggestions([]);
    }
  }, [flightSearch.destination]);


  const handleFlightSearch = async () => {
    if (!flightSearch.origin || !flightSearch.destination || !flightSearch.departureDate) {
      setAlertMessage('Please fill in all required fields (Origin, Destination, Departure Date).');
      setShowAlert(true);
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      // Extract airport codes (handle both plain input and datalist format "CODE - City")
      let originInput = flightSearch.origin;
      let destInput = flightSearch.destination;
      
      // Extract code from datalist format "CODE - City"
      const originMatch = originInput.match(/^([A-Z]{3})\s*-\s*/i);
      if (originMatch) originInput = originMatch[1];
      
      const destMatch = destInput.match(/^([A-Z]{3})\s*-\s*/i);
      if (destMatch) destInput = destMatch[1];
      
      const departureId = extractAirportCode(originInput);
      const arrivalId = extractAirportCode(destInput);

      if (!departureId || !arrivalId) {
        // Get suggestions for better error message
        const originSuggestions = getAirportSuggestions(originInput);
        const destSuggestions = getAirportSuggestions(destInput);
        
        let errorMsg = 'Could not determine airport codes. ';
        const suggestions = [];
        
        if (!departureId) {
          if (originSuggestions.length > 0) {
            suggestions.push(`Origin: Try "${originSuggestions[0].code}" for ${originSuggestions[0].city}`);
          } else {
            suggestions.push(`Origin: Please enter a valid airport code (e.g., LAX, BOM) or city name`);
          }
        }
        
        if (!arrivalId) {
          if (destSuggestions.length > 0) {
            suggestions.push(`Destination: Try "${destSuggestions[0].code}" for ${destSuggestions[0].city}`);
          } else {
            suggestions.push(`Destination: Please enter a valid airport code (e.g., AUS, DEL) or city name`);
          }
        }
        
        errorMsg += suggestions.join('. ');
        throw new Error(errorMsg);
      }

      // Use real API if key is available, otherwise fallback to mock
      if (useRealAPI && serpApiKey) {
        try {
          const apiData = await searchFlights({
            departureId,
            arrivalId,
            outboundDate: flightSearch.departureDate,
            returnDate: flightSearch.returnDate || null,
            adults: flightSearch.passengers,
            apiKey: serpApiKey
          });

          const transformedResults = transformFlightResults(apiData, flightSearch.departureDate);
          
          if (transformedResults.length > 0) {
            setSearchResults(transformedResults);
            setIsSearching(false);
            return;
          } else {
            // If no results from API, fallback to mock
            console.warn('No results from SerpApi, using mock data');
            setUseRealAPI(false);
          }
        } catch (apiError) {
          console.error('SerpApi error:', apiError);
          // Fallback to mock data on API error
          setUseRealAPI(false);
          setAlertMessage(`API Error: ${apiError.message}. Using sample data.`);
          setShowAlert(true);
        }
      }

      // Fallback to mock data - be more lenient with matching
      let results = [];
      const originCode = extractAirportCode(flightSearch.origin);
      const destCode = extractAirportCode(flightSearch.destination);
      
      // First, try to match with existing mock flights (very lenient matching)
      results = MOCK_FLIGHTS.filter(flight => {
        const originLower = flight.origin.toLowerCase().trim();
        const destLower = flight.destination.toLowerCase().trim();
        const searchOriginLower = flightSearch.origin.toLowerCase().trim();
        const searchDestLower = flightSearch.destination.toLowerCase().trim();
        
        // Very flexible matching - check if any part matches
        const matchesOrigin = 
          originLower.includes(searchOriginLower) || 
          searchOriginLower.includes(originLower) ||
          (originCode && originLower.includes(originCode.toLowerCase())) ||
          (originCode && searchOriginLower.includes(originCode.toLowerCase()));
        
        const matchesDestination = 
          destLower.includes(searchDestLower) || 
          searchDestLower.includes(destLower) ||
          (destCode && destLower.includes(destCode.toLowerCase())) ||
          (destCode && searchDestLower.includes(destCode.toLowerCase()));
        
        // Date is optional for matching
        return matchesOrigin && matchesDestination;
      });

      // If still no results, generate sample flights dynamically (always show something)
      if (results.length === 0) {
        const originName = originCode || flightSearch.origin || 'Origin';
        const destName = destCode || flightSearch.destination || 'Destination';
        const flightDate = flightSearch.departureDate || 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        results = generateMockFlights(originName, destName, flightDate);
      }

      // Sort by price
      results.sort((a, b) => (a.price || 0) - (b.price || 0));
      setSearchResults(results);
      setIsSearching(false);

      // Show helpful message if using sample data
      if ((!useRealAPI || !serpApiKey) && results.length > 0) {
        setTimeout(() => {
          setAlertMessage(`Showing ${results.length} sample flight(s). Add VITE_SERPAPI_KEY to your .env file for real-time flight data from Google Flights.`);
          setShowAlert(true);
        }, 500);
      }
    } catch (error) {
      setIsSearching(false);
      setAlertMessage(error.message || 'An error occurred while searching for flights.');
      setShowAlert(true);
    }
  };

  const handleHotelSearch = () => {
    if (!hotelSearch.location || !hotelSearch.checkIn || !hotelSearch.checkOut) {
      setAlertMessage('Please fill in all required fields (Location, Check-in, Check-out).');
      setShowAlert(true);
      return;
    }

    setIsSearching(true);
    // Simulate API call delay
    setTimeout(() => {
      const results = MOCK_HOTELS.filter(hotel => {
        const matchesLocation = hotel.location.toLowerCase().includes(hotelSearch.location.toLowerCase());
        return matchesLocation;
      });

      // Sort by price
      results.sort((a, b) => a.pricePerNight - b.pricePerNight);
      setSearchResults(results);
      setIsSearching(false);

      if (results.length === 0) {
        setAlertMessage('No hotels found. Try adjusting your search criteria.');
        setShowAlert(true);
      }
    }, 1000);
  };

  const handleSearch = () => {
    if (activeTab === 'flights') {
      handleFlightSearch();
    } else {
      handleHotelSearch();
    }
  };

  const calculateTotalNights = () => {
    if (!hotelSearch.checkIn || !hotelSearch.checkOut) return 0;
    const checkIn = new Date(hotelSearch.checkIn);
    const checkOut = new Date(hotelSearch.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getLowestPrice = () => {
    if (searchResults.length === 0) return null;
    return activeTab === 'flights'
      ? Math.min(...searchResults.map(f => f.price))
      : Math.min(...searchResults.map(h => h.pricePerNight * calculateTotalNights()));
  };

  const getHighestPrice = () => {
    if (searchResults.length === 0) return null;
    return activeTab === 'flights'
      ? Math.max(...searchResults.map(f => f.price))
      : Math.max(...searchResults.map(h => h.pricePerNight * calculateTotalNights()));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <section id="flight-hotel-search" className="FlightHotelSearch">
      <SectionHeader
        pill="Flight & Hotel Search"
        title="Find the best deals"
        description="Search for flights and hotels, compare prices, and book your travel."
      >
        {serpApiKey && (
          <span className="FlightHotelSearch__APIStatus" title="Using SerpApi for real-time flight data">
            ✓ Real-time API
          </span>
        )}
      </SectionHeader>

      <div className="FlightHotelSearch__Tabs">
        <button
          className={`FlightHotelSearch__Tab ${activeTab === 'flights' ? 'FlightHotelSearch__Tab--active' : ''}`}
          onClick={() => {
            setActiveTab('flights');
            setSearchResults([]);
          }}
        >
          ✈️ Flights
        </button>
        <button
          className={`FlightHotelSearch__Tab ${activeTab === 'hotels' ? 'FlightHotelSearch__Tab--active' : ''}`}
          onClick={() => {
            setActiveTab('hotels');
            setSearchResults([]);
          }}
        >
          🏨 Hotels
        </button>
      </div>

      <div className="FlightHotelSearch__SearchForm">
        {activeTab === 'flights' ? (
          <FormGrid>
            <FormField
              label="From (Origin)"
              name="origin"
              type="text"
              value={flightSearch.origin}
              onChange={(e) => setFlightSearch({ ...flightSearch, origin: e.target.value })}
              placeholder="e.g., LAX, Mumbai, New York"
              required
            >
              <input
                type="text"
                value={flightSearch.origin}
                onChange={(e) => setFlightSearch({ ...flightSearch, origin: e.target.value })}
                placeholder="e.g., LAX, Mumbai, New York"
                required
                className="FormField__Input"
                list="origin-suggestions"
              />
              <datalist id="origin-suggestions">
                {originSuggestions.map((airport, idx) => (
                  <option key={idx} value={`${airport.code} - ${airport.city}`} />
                ))}
              </datalist>
              {originSuggestions.length > 0 && (
                <p className="Hint" style={{ marginTop: '4px', fontSize: '12px' }}>
                  Suggestions: {originSuggestions.slice(0, 3).map(a => `${a.code} (${a.city})`).join(', ')}
                </p>
              )}
            </FormField>
            <FormField
              label="To (Destination)"
              name="destination"
              type="text"
              value={flightSearch.destination}
              onChange={(e) => setFlightSearch({ ...flightSearch, destination: e.target.value })}
              placeholder="e.g., AUS, Paris, Goa"
              required
            >
              <input
                type="text"
                value={flightSearch.destination}
                onChange={(e) => setFlightSearch({ ...flightSearch, destination: e.target.value })}
                placeholder="e.g., AUS, Paris, Goa"
                required
                className="FormField__Input"
                list="destination-suggestions"
              />
              <datalist id="destination-suggestions">
                {destinationSuggestions.map((airport, idx) => (
                  <option key={idx} value={`${airport.code} - ${airport.city}`} />
                ))}
              </datalist>
              {destinationSuggestions.length > 0 && (
                <p className="Hint" style={{ marginTop: '4px', fontSize: '12px' }}>
                  Suggestions: {destinationSuggestions.slice(0, 3).map(a => `${a.code} (${a.city})`).join(', ')}
                </p>
              )}
            </FormField>
            <FormField
              label="Departure Date"
              name="departureDate"
              type="date"
              value={flightSearch.departureDate}
              onChange={(e) => setFlightSearch({ ...flightSearch, departureDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <FormField
              label="Return Date (Optional)"
              name="returnDate"
              type="date"
              value={flightSearch.returnDate}
              onChange={(e) => setFlightSearch({ ...flightSearch, returnDate: e.target.value })}
              min={flightSearch.departureDate || new Date().toISOString().split('T')[0]}
            />
            <FormField
              label="Passengers"
              name="passengers"
              type="number"
              min="1"
              max="9"
              value={flightSearch.passengers}
              onChange={(e) => setFlightSearch({ ...flightSearch, passengers: parseInt(e.target.value) || 1 })}
            />
            <FormField
              label="Class"
              name="class"
              value={flightSearch.class}
              onChange={(e) => setFlightSearch({ ...flightSearch, class: e.target.value })}
            >
              <select
                value={flightSearch.class}
                onChange={(e) => setFlightSearch({ ...flightSearch, class: e.target.value })}
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </FormField>
          </FormGrid>
        ) : (
          <FormGrid>
            <FormField
              label="Location"
              name="location"
              type="text"
              value={hotelSearch.location}
              onChange={(e) => setHotelSearch({ ...hotelSearch, location: e.target.value })}
              placeholder="e.g., Paris, Goa, New York"
              required
            />
            <FormField
              label="Check-in Date"
              name="checkIn"
              type="date"
              value={hotelSearch.checkIn}
              onChange={(e) => setHotelSearch({ ...hotelSearch, checkIn: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <FormField
              label="Check-out Date"
              name="checkOut"
              type="date"
              value={hotelSearch.checkOut}
              onChange={(e) => setHotelSearch({ ...hotelSearch, checkOut: e.target.value })}
              min={hotelSearch.checkIn || new Date().toISOString().split('T')[0]}
              required
            />
            <FormField
              label="Guests"
              name="guests"
              type="number"
              min="1"
              max="10"
              value={hotelSearch.guests}
              onChange={(e) => setHotelSearch({ ...hotelSearch, guests: parseInt(e.target.value) || 1 })}
            />
            <FormField
              label="Rooms"
              name="rooms"
              type="number"
              min="1"
              max="5"
              value={hotelSearch.rooms}
              onChange={(e) => setHotelSearch({ ...hotelSearch, rooms: parseInt(e.target.value) || 1 })}
            />
          </FormGrid>
        )}

        <FormActions>
          <button
            className="Button Button--primary"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </FormActions>
      </div>

      {searchResults.length > 0 && (
        <div className="FlightHotelSearch__Results">
          <div className="FlightHotelSearch__ResultsHeader">
            <h3>
              {activeTab === 'flights' ? 'Flight' : 'Hotel'} Results ({searchResults.length})
            </h3>
            {getLowestPrice() && getHighestPrice() && (
              <div className="FlightHotelSearch__PriceRange">
                <span className="Label">Price Range:</span>
                <span className="Value">
                  {formatCurrency(getLowestPrice())} - {formatCurrency(getHighestPrice())}
                </span>
              </div>
            )}
          </div>

          <div className="FlightHotelSearch__ResultsGrid">
            {activeTab === 'flights'
              ? searchResults.map((flight, index) => (
                  <div key={index} className="FlightHotelSearch__ResultCard">
                    <div className="FlightHotelSearch__ResultCardHeader">
                      <div>
                        <h4>{flight.airline}</h4>
                        <p className="Label">{flight.flightNumber}</p>
                      </div>
                      <div className="FlightHotelSearch__Price">
                        <p className="Value Value--large">{formatCurrency(flight.price)}</p>
                        <p className="Hint">per person</p>
                      </div>
                    </div>
                    <div className="FlightHotelSearch__ResultCardBody">
                      <div className="FlightHotelSearch__Route">
                        <div>
                          <p className="Value Value--large">{flight.departureTime}</p>
                          <p className="Label">{flight.origin}</p>
                        </div>
                        <div className="FlightHotelSearch__RouteArrow">→</div>
                        <div>
                          <p className="Value Value--large">{flight.arrivalTime}</p>
                          <p className="Label">{flight.destination}</p>
                        </div>
                      </div>
                      <div className="FlightHotelSearch__FlightDetails">
                        <span className="Hint">Duration: {flight.duration}</span>
                        <span className="Hint">Class: {flight.class}</span>
                        <span className="Hint">Stops: {flight.stops}</span>
                        {flight.numLegs > 1 && (
                          <span className="Hint" title={`${flight.numLegs} flight legs`}>
                            {flight.numLegs} Legs
                          </span>
                        )}
                      </div>
                      {flight.layovers && flight.layovers.length > 0 && (
                        <div className="FlightHotelSearch__Layovers">
                          <p className="Hint" style={{ fontSize: '12px', marginTop: '8px' }}>
                            Via: {flight.layovers}
                          </p>
                        </div>
                      )}
                      {flight.carbonEmissionsKg && (
                        <div className="FlightHotelSearch__CarbonInfo">
                          <p className="Hint" style={{ fontSize: '12px', marginTop: '4px' }}>
                            🌱 CO₂: {flight.carbonEmissionsKg}kg
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="FlightHotelSearch__ResultCardActions">
                      <a
                        href={flight.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="Button Button--primary"
                      >
                        Book Now
                      </a>
                      {flight.numLegs > 1 && (
                        <span className="Hint" style={{ fontSize: '11px', marginLeft: '8px' }}>
                          {flight.numLegs} flight{flight.numLegs > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              : searchResults.map((hotel, index) => {
                  const totalNights = calculateTotalNights();
                  const totalPrice = hotel.pricePerNight * totalNights * hotelSearch.rooms;
                  return (
                    <div key={index} className="FlightHotelSearch__ResultCard">
                      <div className="FlightHotelSearch__ResultCardHeader">
                        <div>
                          <h4>{hotel.name}</h4>
                          <p className="Label">{hotel.location}</p>
                          <div className="FlightHotelSearch__HotelRating">
                            {'⭐'.repeat(hotel.rating)}
                            <span className="Hint">({hotel.reviews} reviews)</span>
                          </div>
                        </div>
                        <div className="FlightHotelSearch__Price">
                          <p className="Value Value--large">{formatCurrency(hotel.pricePerNight)}</p>
                          <p className="Hint">per night</p>
                          {totalNights > 0 && (
                            <>
                              <p className="Value" style={{ marginTop: '4px' }}>
                                {formatCurrency(totalPrice)}
                              </p>
                              <p className="Hint">for {totalNights} nights</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="FlightHotelSearch__ResultCardBody">
                        <p className="Description">{hotel.description}</p>
                        <div className="FlightHotelSearch__HotelAmenities">
                          {hotel.amenities.map((amenity, i) => (
                            <span key={i} className="FlightHotelSearch__AmenityTag">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="FlightHotelSearch__ResultCardActions">
                        <a
                          href={hotel.bookingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="Button Button--primary"
                        >
                          Book Now
                        </a>
                        <button className="Button Button--ghost">View Details</button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      )}

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Notice"
        message={alertMessage}
        type="warning"
      />
    </section>
  );
}

FlightHotelSearch.propTypes = {
  selectedDestination: PropTypes.shape({
    location: PropTypes.string
  })
};

