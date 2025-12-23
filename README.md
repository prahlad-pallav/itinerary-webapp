# ✈️ Vacation Planner App

A modern, feature-rich vacation planning application built with React and Redux. Plan your trips, track expenses, check weather conditions, and manage your travel itinerary all in one place.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11.2-purple)
![Vite](https://img.shields.io/badge/Vite-6.0.1-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

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
│   │   └── ExpenseSplitter.jsx
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

### Getting Weather API Key

1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/)
2. Navigate to your dashboard
3. Copy your API key
4. Add it to your `.env` file

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
