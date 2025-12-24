# ✈️ Vacation Planner App

A modern, feature-rich vacation planning application built with React and Redux. Plan your trips, track expenses, check weather conditions, and manage your travel itinerary all in one place.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11.2-purple)
![Vite](https://img.shields.io/badge/Vite-6.0.1-green)

## 🌟 Features

### 🗺️ Destination Management
- Browse curated destinations (Indian & International)
- Search destinations by name or location
- Filter by tags (Beach, Culture, Adventure, etc.)
- Sort by price, rating, or featured
- View destination details with images, prices, and ratings

### 📅 Trip Planning
- Interactive trip builder
- Add/remove destinations to your plan
- Adjust number of nights (1-21 days)
- Real-time budget calculation
- View itinerary templates
- Track total trip cost

### 🌤️ Weather Integration
- Live weather data via WeatherAPI.com
- City search with debounced input
- Current weather conditions (temperature, humidity, wind)
- Hourly forecast (6-hour preview)
- Air Quality Index (AQI) with color-coded levels
- Detailed pollutant information (PM2.5, PM10, O3, NO2, CO)

### 💰 Expense Splitting (Splitwise-style)
- Manage group members
- Track expenses with descriptions and categories
- Equal split between selected participants
- Track who paid for each expense
- Multiple expense categories (Food, Transport, Accommodation, etc.)
- Automatic balance calculation per person
- Simplified settlement suggestions (who owes whom)
- Individual balance display
- Total expenses summary

### 🎨 Theme System
- Dark/Light mode toggle
- Redux-powered theme management
- Theme persistence (localStorage)
- Smooth theme transitions
- Responsive design

### 📅 Trip Calendar
- Visual calendar display for trip dates
- Auto-generate events from trip plan
- Add custom events (flights, hotels, activities)
- Click on dates to view/add events
- Sync with Google Calendar
- OAuth integration for Google Calendar
- View upcoming events sidebar
- Event statistics and tracking
- Mark events as synced to Google Calendar

### 🎯 UI/UX Features
- Modern glassmorphism design
- Fully responsive (mobile, tablet, desktop)
- Smooth scrolling navigation
- Modal components for user interactions
- Loading states and error handling
- Form validation
- Hover effects and animations

## 🛠️ Tech Stack

- **Frontend Framework:** React 18.3.1
- **State Management:** Redux Toolkit 2.11.2
- **Build Tool:** Vite 6.0.1
- **Styling:** CSS with BEM methodology
- **API Integration:** WeatherAPI.com
- **Code Quality:** ESLint, Prettier
- **Type Checking:** PropTypes

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prahlad-pallav/itinerary-webapp.git
   cd itinerary-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_WEATHER_API_KEY=your_weather_api_key_here
   ```
   
   Get your API key from [WeatherAPI.com](https://www.weatherapi.com/)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
vacation-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Filters.jsx
│   │   ├── DestinationCard.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── Modal.jsx
│   │   ├── InputModal.jsx
│   │   └── AlertModal.jsx
│   ├── pages/               # Page-level components
│   │   ├── HeroSection.jsx
│   │   ├── DestinationGrid.jsx
│   │   ├── WeatherWidget.jsx
│   │   ├── TripPlanner.jsx
│   │   ├── ExpenseSplitter.jsx
│   │   ├── PackingEssentials.jsx
│   │   ├── TripCalendar.jsx
│   │   ├── CalendarPage.jsx
│   │   └── PackingPage.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useWeather.js
│   │   └── useExpenseBalances.js
│   ├── store/               # Redux store
│   │   ├── store.js
│   │   └── slices/
│   │       └── themeSlice.js
│   ├── constants/           # Data constants
│   │   └── destinations.js
│   ├── utils/               # Utility functions
│   │   ├── formatters.js
│   │   └── aqi.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WEATHER_API_KEY` | WeatherAPI.com API key | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google Calendar API client ID | No (optional for Google Calendar sync) |
| `VITE_SERPAPI_KEY` | SerpApi API key for flight search | No (optional, falls back to mock data) |

### Getting Weather API Key

1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/)
2. Navigate to your dashboard
3. Copy your API key
4. Add it to your `.env` file

### Setting Up Google Calendar Integration (Optional)

To enable Google Calendar sync functionality:

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Calendar API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173/calendar` (for development)
     - `https://your-domain.com/calendar` (for production)
   - Copy the Client ID

4. **Add to Environment Variables**
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```

5. **Restart Development Server**
   ```bash
   npm run dev
   ```

**Note:** The calendar feature works without Google Calendar integration. You can still create and manage events locally. Google Calendar sync is an optional enhancement.

### Setting Up SerpApi for Flight Search (Optional)

To enable real-time flight search using [SerpApi Google Flights API](https://serpapi.com/google-flights-api):

1. **Sign up for SerpApi**
   - Go to [serpapi.com](https://serpapi.com/)
   - Create an account (free tier available with 100 searches/month)
   - Navigate to your dashboard

2. **Get Your API Key**
   - Go to "API Key" section in your account
   - Copy your API key

3. **Add to Environment Variables**
   ```env
   VITE_SERPAPI_KEY=your_serpapi_key_here
   ```

4. **Restart Development Server**
   ```bash
   npm run dev
   ```

**Note:** The flight search feature works without SerpApi integration. It will use sample/mock data if the API key is not provided. SerpApi integration provides real-time flight prices and availability from Google Flights.

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy via Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variable: `VITE_WEATHER_API_KEY`
   - Click "Deploy"

### Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## 📱 Usage

### Planning a Trip

1. Browse destinations in the **Destinations** section
2. Use filters to narrow down options
3. Click "Add to Plan" on desired destinations
4. Adjust nights in the **My Plan** section
5. View total budget in real-time

### Checking Weather

1. Navigate to the **Weather** section
2. Search for a city or select from presets
3. View current conditions and forecast
4. Check AQI for air quality information

### Splitting Expenses

1. Go to the **Expenses** section
2. Add group members using "+ Add Member"
3. Click "+ Add Expense" to track costs
4. Select participants and enter amount
5. View balances and settlement suggestions

### Switching Themes

- Click the theme toggle button in the navbar
- Your preference is automatically saved

### Using Trip Calendar

1. Navigate to the **Calendar** page from the navbar
2. View your trip plan automatically converted to calendar events
3. Click on any date to:
   - View existing events on that date
   - Add a new custom event (flights, hotels, activities)
4. **Connect Google Calendar** (optional):
   - Click "Connect Google Calendar"
   - Authorize the app in the Google OAuth popup
   - Click "Sync to Google Calendar" to add all events
5. View upcoming events in the sidebar
6. Track event statistics (total events, trip destinations, custom events)

## 🎨 Design System

- **CSS Methodology:** BEM (Block Element Modifier)
- **Color Scheme:** Supports both light and dark themes
- **Typography:** Inter font family
- **Spacing:** Consistent padding and margins
- **Shadows:** Layered shadows for depth
- **Animations:** Smooth transitions and hover effects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Quality

- ESLint for code linting
- Prettier for code formatting
- PropTypes for type checking
- BEM methodology for CSS organization
- Component-based architecture

## 🔒 Security

- API keys stored in environment variables
- `.env` file excluded from version control
- Secure API calls with proper error handling

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Prahlad Pallav**

- GitHub: [@prahlad-pallav](https://github.com/prahlad-pallav)
- Project: [itinerary-webapp](https://github.com/prahlad-pallav/itinerary-webapp)

## 🙏 Acknowledgments

- [WeatherAPI.com](https://www.weatherapi.com/) for weather data
- [Unsplash](https://unsplash.com/) for destination images
- React and Redux communities for excellent documentation

## 📞 Support

If you have any questions or issues, please open an issue on GitHub.

---

Made with ❤️ using React and Redux
