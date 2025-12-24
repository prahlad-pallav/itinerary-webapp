import { useState, useEffect } from 'react';
import TripCalendar from './TripCalendar';

export default function CalendarPage() {
  const [plan, setPlan] = useState([]);

  // Try to load plan from localStorage or get from Home component state
  useEffect(() => {
    // Check if plan data is available in localStorage
    const savedPlan = localStorage.getItem('tripPlan');
    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan));
      } catch (error) {
        console.error('Error loading trip plan:', error);
      }
    }
  }, []);

  return (
    <div className="Page">
      <TripCalendar plan={plan} />
    </div>
  );
}

