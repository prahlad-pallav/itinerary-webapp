/**
 * SerpApi Google Flights API integration
 * Documentation: https://serpapi.com/google-flights-api
 */

const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';

/**
 * Search for flights using SerpApi Google Flights API
 * Documentation: https://serpapi.com/google-flights-api
 * @param {Object} params - Search parameters
 * @param {string} params.departureId - Departure airport code (e.g., 'LAX', 'PEK')
 * @param {string} params.arrivalId - Arrival airport code (e.g., 'AUS')
 * @param {string} params.outboundDate - Departure date (YYYY-MM-DD)
 * @param {string} params.returnDate - Return date (optional, YYYY-MM-DD)
 * @param {string} params.currency - Currency code (default: 'USD')
 * @param {number} params.adults - Number of adults (default: 1)
 * @param {string} params.apiKey - SerpApi API key
 * @param {string} params.hl - Language code (default: 'en')
 * @returns {Promise<Object>} Flight search results with best_flights and other_flights
 */
export async function searchFlights({
  departureId,
  arrivalId,
  outboundDate,
  returnDate,
  currency = 'USD',
  adults = 1,
  apiKey,
  hl = 'en'
}) {
  if (!apiKey) {
    throw new Error('SerpApi API key is required');
  }

  if (!departureId || !arrivalId || !outboundDate) {
    throw new Error('Departure ID, Arrival ID, and Outbound Date are required');
  }

  const params = new URLSearchParams({
    engine: 'google_flights',
    departure_id: departureId,
    arrival_id: arrivalId,
    outbound_date: outboundDate,
    currency: currency,
    adults: adults.toString(),
    hl: hl,
    api_key: apiKey
  });

  if (returnDate) {
    params.append('return_date', returnDate);
  }

  try {
    const response = await fetch(`${SERPAPI_BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    
    // Log for debugging (remove in production)
    console.log('SerpApi response:', {
      bestFlights: data.best_flights?.length || 0,
      otherFlights: data.other_flights?.length || 0
    });
    
    return data;
  } catch (error) {
    console.error('SerpApi flight search error:', error);
    throw error;
  }
}

/**
 * Transform SerpApi flight results to our component format
 * Handles both best_flights and other_flights from the API response
 * @param {Object} apiData - Raw API response
 * @param {string} outboundDate - Departure date for booking link
 * @returns {Array} Transformed flight results
 */
export function transformFlightResults(apiData, outboundDate = null) {
  if (!apiData) return [];

  // Combine best_flights and other_flights
  const allFlights = [
    ...(apiData.best_flights || []),
    ...(apiData.other_flights || []),
    ...(apiData.flights_results || []) // Fallback for older API format
  ];

  if (allFlights.length === 0) return [];

  return allFlights.map((flightOption, index) => {
    if (!flightOption.flights || !Array.isArray(flightOption.flights) || flightOption.flights.length === 0) {
      return null;
    }

    const firstLeg = flightOption.flights[0];
    const lastLeg = flightOption.flights[flightOption.flights.length - 1];
    
    const departure = firstLeg.departure_airport || {};
    const finalArrival = lastLeg.arrival_airport || {};

    // Format time from "2025-10-14 11:30" to "11:30"
    const formatTime = (timeString) => {
      if (!timeString) return '';
      const parts = timeString.split(' ');
      return parts.length > 1 ? parts[1] : timeString;
    };

    // Format duration from minutes to "Xh Ym"
    const formatDuration = (minutes) => {
      if (!minutes) return '';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
    };

    // Determine number of stops
    const numStops = flightOption.layovers ? flightOption.layovers.length : 
                     (flightOption.flights.length > 1 ? flightOption.flights.length - 1 : 0);
    const stopsText = numStops === 0 ? 'Non-stop' : 
                     numStops === 1 ? '1 stop' : 
                     `${numStops} stops`;

    // Get primary airline (first leg's airline, or "Multiple" if different airlines)
    const airlines = [...new Set(flightOption.flights.map(f => f.airline).filter(Boolean))];
    const primaryAirline = airlines.length === 1 ? airlines[0] : 'Multiple Airlines';

    // Build Google Flights booking URL
    const buildBookingLink = () => {
      const depCode = departure.id || '';
      const arrCode = finalArrival.id || '';
      const date = outboundDate || new Date().toISOString().split('T')[0];
      return `https://www.google.com/travel/flights?q=Flights%20${depCode}%20to%20${arrCode}%20on%20${date}`;
    };

    // Format layover information
    const layoverInfo = flightOption.layovers && flightOption.layovers.length > 0
      ? flightOption.layovers.map(l => `${l.name} (${l.id})`).join(', ')
      : '';

    return {
      id: `flight-${index}`,
      airline: primaryAirline,
      flightNumber: firstLeg.flight_number || '',
      origin: departure.name || departure.id || '',
      destination: finalArrival.name || finalArrival.id || '',
      departureTime: formatTime(departure.time),
      arrivalTime: formatTime(finalArrival.time),
      duration: formatDuration(flightOption.total_duration),
      date: outboundDate || new Date().toISOString().split('T')[0],
      price: flightOption.price || 0,
      class: firstLeg.travel_class || 'economy',
      stops: stopsText,
      layovers: layoverInfo,
      numLegs: flightOption.flights.length,
      airplane: firstLeg.airplane || '',
      legroom: firstLeg.legroom || '',
      carbonEmissions: flightOption.carbon_emissions?.this_flight || null,
      carbonEmissionsKg: flightOption.carbon_emissions?.this_flight 
        ? Math.round(flightOption.carbon_emissions.this_flight / 1000) 
        : null,
      airlineLogo: firstLeg.airline_logo || flightOption.airline_logo || '',
      extensions: firstLeg.extensions || [],
      bookingToken: flightOption.departure_token || '',
      bookingLink: buildBookingLink(),
      allLegs: flightOption.flights.map(leg => ({
        airline: leg.airline,
        flightNumber: leg.flight_number,
        departure: leg.departure_airport,
        arrival: leg.arrival_airport,
        duration: leg.duration,
        airplane: leg.airplane
      }))
    };
  }).filter(Boolean);
}

/**
 * Comprehensive airport database
 * Expanded list of common airports with multiple aliases
 */
const AIRPORTS_DATABASE = [
  // US Airports
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', aliases: ['los angeles', 'la', 'lax'] },
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', aliases: ['new york', 'nyc', 'jfk', 'kennedy'] },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', aliases: ['laguardia', 'lga'] },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', aliases: ['newark', 'ewr'] },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', aliases: ['san francisco', 'sf', 'sfo'] },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', aliases: ['chicago', 'ohare', 'ord'] },
  { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', aliases: ['dallas', 'dfw', 'fort worth'] },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', aliases: ['atlanta', 'atl'] },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami', aliases: ['miami', 'mia'] },
  { code: 'LAS', name: 'McCarran International Airport', city: 'Las Vegas', aliases: ['las vegas', 'vegas', 'las'] },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', aliases: ['seattle', 'sea', 'tacoma'] },
  { code: 'BOS', name: 'Logan International Airport', city: 'Boston', aliases: ['boston', 'bos'] },
  { code: 'AUS', name: 'Austin-Bergstrom International Airport', city: 'Austin', aliases: ['austin', 'aus'] },
  
  // Indian Airports
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', aliases: ['mumbai', 'bombay', 'bom'] },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', aliases: ['delhi', 'new delhi', 'del'] },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', aliases: ['bangalore', 'bengaluru', 'blr'] },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', aliases: ['kolkata', 'calcutta', 'ccu'] },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', aliases: ['chennai', 'madras', 'maa'] },
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', aliases: ['hyderabad', 'hyd'] },
  { code: 'GOI', name: 'Goa International Airport', city: 'Goa', aliases: ['goa', 'dabolim', 'goi'] },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', aliases: ['pune', 'pnq'] },
  { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', aliases: ['kochi', 'cochin', 'cok'] },
  { code: 'IXC', name: 'Chandigarh Airport', city: 'Chandigarh', aliases: ['chandigarh', 'ixc'] },
  { code: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', aliases: ['udaipur', 'udr'] },
  
  // European Airports
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', aliases: ['london', 'heathrow', 'lhr'] },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', aliases: ['gatwick', 'lgw'] },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', aliases: ['paris', 'cdg', 'charles de gaulle'] },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', aliases: ['orly', 'ory'] },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', aliases: ['frankfurt', 'fra'] },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', aliases: ['amsterdam', 'schiphol', 'ams'] },
  { code: 'FCO', name: 'Leonardo da Vinci Airport', city: 'Rome', aliases: ['rome', 'fiumicino', 'fco'] },
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', aliases: ['madrid', 'mad'] },
  { code: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', aliases: ['barcelona', 'bcn'] },
  { code: 'ATH', name: 'Athens International Airport', city: 'Athens', aliases: ['athens', 'ath'] },
  { code: 'JTR', name: 'Santorini (Thira) National Airport', city: 'Santorini', aliases: ['santorini', 'thira', 'jtr'] },
  
  // Middle East & Asia
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', aliases: ['dubai', 'dxb'] },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', aliases: ['abu dhabi', 'auh'] },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', aliases: ['doha', 'doh'] },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', aliases: ['singapore', 'sin', 'changi'] },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', aliases: ['bangkok', 'bkk'] },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', aliases: ['kuala lumpur', 'kul'] },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', aliases: ['hong kong', 'hkg'] },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', aliases: ['tokyo', 'narita', 'nrt'] },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', aliases: ['seoul', 'incheon', 'icn'] },
  { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', aliases: ['beijing', 'pek'] },
  { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', aliases: ['shanghai', 'pvg'] },
  
  // Other Popular Destinations
  { code: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali', aliases: ['bali', 'denpasar', 'dps'] },
  { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', aliases: ['sydney', 'syd'] },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', aliases: ['melbourne', 'mel'] },
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', aliases: ['toronto', 'yyz'] },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', aliases: ['vancouver', 'yvr'] }
];

/**
 * Get airport suggestions/autocomplete
 * @param {string} query - Search query
 * @returns {Array} Airport suggestions
 */
export function getAirportSuggestions(query) {
  if (!query) return AIRPORTS_DATABASE.slice(0, 10);

  const lowerQuery = query.toLowerCase().trim();
  
  // First, try exact code match
  const exactCodeMatch = AIRPORTS_DATABASE.find(
    (airport) => airport.code.toLowerCase() === lowerQuery
  );
  if (exactCodeMatch) return [exactCodeMatch];

  // Then search in aliases, city, name, and code
  return AIRPORTS_DATABASE.filter((airport) => {
    const searchFields = [
      airport.code.toLowerCase(),
      airport.city.toLowerCase(),
      airport.name.toLowerCase(),
      ...(airport.aliases || [])
    ];
    
    return searchFields.some((field) => field.includes(lowerQuery));
  }).slice(0, 10);
}

/**
 * Extract airport code from user input
 * @param {string} input - User input (city name, airport code, or airport name)
 * @returns {string|null} Airport code or null if not found
 */
export function extractAirportCode(input) {
  if (!input) return null;
  
  const trimmedInput = input.trim();
  if (!trimmedInput) return null;
  
  const upperInput = trimmedInput.toUpperCase();
  
  // Check if input is already a 3-letter code
  if (upperInput.length === 3 && /^[A-Z]{3}$/.test(upperInput)) {
    const airport = AIRPORTS_DATABASE.find(a => a.code === upperInput);
    if (airport) return upperInput;
  }
  
  // Try to find matching airport
  const lowerInput = trimmedInput.toLowerCase();
  
  // Check exact matches first
  const exactMatch = AIRPORTS_DATABASE.find((airport) => {
    return (
      airport.code.toLowerCase() === lowerInput ||
      airport.city.toLowerCase() === lowerInput ||
      airport.name.toLowerCase() === lowerInput ||
      (airport.aliases && airport.aliases.includes(lowerInput))
    );
  });
  
  if (exactMatch) return exactMatch.code;
  
  // Try partial matches
  const partialMatch = AIRPORTS_DATABASE.find((airport) => {
    const searchFields = [
      airport.city.toLowerCase(),
      airport.name.toLowerCase(),
      ...(airport.aliases || [])
    ];
    
    return searchFields.some((field) => field.includes(lowerInput) || lowerInput.includes(field));
  });
  
  if (partialMatch) return partialMatch.code;
  
  // If input contains airport code in format like "LAX - Los Angeles"
  const codeMatch = trimmedInput.match(/\b([A-Z]{3})\b/);
  if (codeMatch) {
    const code = codeMatch[1];
    const airport = AIRPORTS_DATABASE.find(a => a.code === code);
    if (airport) return code;
  }
  
  return null;
}

