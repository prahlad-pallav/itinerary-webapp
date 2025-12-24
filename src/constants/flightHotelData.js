// Mock flight data - Replace with real API calls
export const MOCK_FLIGHTS = [
  {
    airline: 'Air India',
    flightNumber: 'AI 101',
    origin: 'Mumbai',
    destination: 'Goa',
    departureTime: '08:00',
    arrivalTime: '09:30',
    duration: '1h 30m',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 3500,
    class: 'economy',
    stops: 'Non-stop',
    bookingLink: 'https://www.airindia.in/'
  },
  {
    airline: 'IndiGo',
    flightNumber: '6E 234',
    origin: 'Mumbai',
    destination: 'Goa',
    departureTime: '14:30',
    arrivalTime: '16:00',
    duration: '1h 30m',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 3200,
    class: 'economy',
    stops: 'Non-stop',
    bookingLink: 'https://www.goindigo.in/'
  },
  {
    airline: 'SpiceJet',
    flightNumber: 'SG 456',
    origin: 'Mumbai',
    destination: 'Goa',
    departureTime: '18:45',
    arrivalTime: '20:15',
    duration: '1h 30m',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 3800,
    class: 'economy',
    stops: 'Non-stop',
    bookingLink: 'https://www.spicejet.com/'
  },
  {
    airline: 'Vistara',
    flightNumber: 'UK 789',
    origin: 'Delhi',
    destination: 'Paris',
    departureTime: '02:00',
    arrivalTime: '08:30',
    duration: '9h 30m',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 45000,
    class: 'economy',
    stops: '1 stop',
    bookingLink: 'https://www.airvistara.com/'
  },
  {
    airline: 'Emirates',
    flightNumber: 'EK 501',
    origin: 'Mumbai',
    destination: 'Dubai',
    departureTime: '10:15',
    arrivalTime: '12:30',
    duration: '3h 15m',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 28000,
    class: 'economy',
    stops: 'Non-stop',
    bookingLink: 'https://www.emirates.com/'
  },
  {
    airline: 'Air France',
    flightNumber: 'AF 234',
    origin: 'New York',
    destination: 'Paris',
    departureTime: '22:00',
    arrivalTime: '11:30',
    duration: '7h 30m',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 65000,
    class: 'business',
    stops: 'Non-stop',
    bookingLink: 'https://www.airfrance.com/'
  },
  {
    airline: 'British Airways',
    flightNumber: 'BA 123',
    origin: 'London',
    destination: 'Santorini',
    departureTime: '09:00',
    arrivalTime: '15:30',
    duration: '4h 30m',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 42000,
    class: 'economy',
    stops: '1 stop',
    bookingLink: 'https://www.britishairways.com/'
  },
  {
    airline: 'Qatar Airways',
    flightNumber: 'QR 567',
    origin: 'Mumbai',
    destination: 'Bali',
    departureTime: '01:30',
    arrivalTime: '14:00',
    duration: '8h 30m',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 38000,
    class: 'economy',
    stops: '1 stop',
    bookingLink: 'https://www.qatarairways.com/'
  }
];

// Mock hotel data - Replace with real API calls
export const MOCK_HOTELS = [
  {
    name: 'Taj Exotica Resort & Spa',
    location: 'Goa',
    description: 'Luxury beachfront resort with spa, multiple restaurants, and private beach access.',
    pricePerNight: 12000,
    rating: 5,
    reviews: 1245,
    amenities: ['Beach Access', 'Spa', 'Pool', 'WiFi', 'Restaurant', 'Parking'],
    bookingLink: 'https://www.tajhotels.com/'
  },
  {
    name: 'Park Hyatt Paris-Vendôme',
    location: 'Paris',
    description: 'Elegant 5-star hotel in the heart of Paris, near the Louvre and Champs-Élysées.',
    pricePerNight: 35000,
    rating: 5,
    reviews: 892,
    amenities: ['WiFi', 'Spa', 'Gym', 'Restaurant', 'Room Service', 'Concierge'],
    bookingLink: 'https://www.hyatt.com/'
  },
  {
    name: 'Grace Hotel Santorini',
    location: 'Santorini',
    description: 'Boutique hotel with stunning caldera views, infinity pool, and luxury suites.',
    pricePerNight: 28000,
    rating: 5,
    reviews: 567,
    amenities: ['Infinity Pool', 'WiFi', 'Restaurant', 'Spa', 'Sea View', 'Breakfast'],
    bookingLink: 'https://www.gracehotels.com/'
  },
  {
    name: 'The Oberoi Udaivilas',
    location: 'Udaipur',
    description: 'Palace hotel on the banks of Lake Pichola with traditional architecture and modern amenities.',
    pricePerNight: 25000,
    rating: 5,
    reviews: 1234,
    amenities: ['Lake View', 'Spa', 'Pool', 'WiFi', 'Restaurant', 'Yoga'],
    bookingLink: 'https://www.oberoihotels.com/'
  },
  {
    name: 'The Leela Palace',
    location: 'Udaipur',
    description: 'Luxury heritage hotel with lake views, fine dining, and royal treatment.',
    pricePerNight: 18000,
    rating: 5,
    reviews: 987,
    amenities: ['Lake View', 'Spa', 'Pool', 'WiFi', 'Restaurant', 'Gym'],
    bookingLink: 'https://www.theleela.com/'
  },
  {
    name: 'Bali Beach Resort',
    location: 'Bali',
    description: 'Beachfront resort with tropical gardens, multiple pools, and Balinese spa treatments.',
    pricePerNight: 15000,
    rating: 4,
    reviews: 756,
    amenities: ['Beach Access', 'Spa', 'Pool', 'WiFi', 'Restaurant', 'Yoga'],
    bookingLink: 'https://www.booking.com/'
  },
  {
    name: 'Dubai Marina Hotel',
    location: 'Dubai',
    description: 'Modern hotel in Dubai Marina with stunning views, rooftop pool, and easy beach access.',
    pricePerNight: 22000,
    rating: 4,
    reviews: 1123,
    amenities: ['Marina View', 'Pool', 'Gym', 'WiFi', 'Restaurant', 'Spa'],
    bookingLink: 'https://www.booking.com/'
  },
  {
    name: 'Budget Inn Goa',
    location: 'Goa',
    description: 'Affordable hotel near the beach with clean rooms, WiFi, and friendly service.',
    pricePerNight: 2500,
    rating: 3,
    reviews: 456,
    amenities: ['WiFi', 'Parking', 'Restaurant', 'AC'],
    bookingLink: 'https://www.booking.com/'
  },
  {
    name: 'Paris City Center Hotel',
    location: 'Paris',
    description: 'Charming boutique hotel in the heart of Paris, close to major attractions.',
    pricePerNight: 18000,
    rating: 4,
    reviews: 678,
    amenities: ['WiFi', 'Breakfast', 'Concierge', 'Restaurant'],
    bookingLink: 'https://www.booking.com/'
  },
  {
    name: 'Santorini Sunset View Hotel',
    location: 'Santorini',
    description: 'Traditional cave hotel with caldera views, perfect for watching sunsets.',
    pricePerNight: 22000,
    rating: 4,
    reviews: 445,
    amenities: ['Sunset View', 'WiFi', 'Breakfast', 'Pool'],
    bookingLink: 'https://www.booking.com/'
  }
];

// Helper function to generate more mock data dynamically
export const generateMockFlights = (origin, destination, date) => {
  const airlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia', 'Emirates', 'Qatar Airways', 'British Airways', 'Lufthansa'];
  const flights = [];
  
  for (let i = 0; i < 5; i++) {
    const hour = 6 + i * 3;
    const departureTime = `${hour.toString().padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`;
    const arrivalHour = hour + Math.floor(Math.random() * 3) + 1;
    const arrivalMins = (i * 15) % 60;
    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMins.toString().padStart(2, '0')}`;
    const durationHours = arrivalHour - hour;
    const durationMins = arrivalMins;
    
    const airline = airlines[i % airlines.length];
    const flightNumber = `${airline.substring(0, 2).toUpperCase().replace(' ', '')} ${100 + i}`;
    
    flights.push({
      id: `generated-${Date.now()}-${i}`,
      airline: airline,
      flightNumber: flightNumber,
      origin: origin,
      destination: destination,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      duration: `${durationHours}h ${durationMins}m`,
      date: date,
      price: Math.floor(Math.random() * 50000) + 5000,
      class: ['economy', 'business', 'first'][i % 3],
      stops: i % 3 === 0 ? 'Non-stop' : `${i % 2 + 1} stop${i % 2 === 0 ? '' : 's'}`,
      bookingLink: `https://www.google.com/travel/flights?q=Flights%20${origin}%20to%20${destination}%20on%20${date}`
    });
  }
  
  return flights;
};

