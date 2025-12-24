import { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';
import AlertModal from '../components/AlertModal';
import InputModal from '../components/InputModal';
import SectionHeader from '../components/common/SectionHeader';
import StatsCard from '../components/common/StatsCard';
import FormField from '../components/common/FormField';
import FormGrid from '../components/common/FormGrid';
import FormActions from '../components/common/FormActions';
import './TripCalendar.css';
import 'react-calendar/dist/Calendar.css';

export default function TripCalendar({ plan = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tripEvents, setTripEvents] = useState([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    location: ''
  });
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('tripCalendarEvents');
    if (savedEvents) {
      try {
        setTripEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('Error loading calendar events:', error);
      }
    }

    // Check if Google Calendar is connected
    const googleToken = localStorage.getItem('googleCalendarToken');
    setIsGoogleConnected(!!googleToken);
  }, []);

  // Auto-generate events from trip plan
  useEffect(() => {
    if (plan.length > 0) {
      const generatedEvents = plan.map((destination, index) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + index * 7); // Space them a week apart
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + destination.nights);

        return {
          id: `plan-${destination.id}`,
          title: destination.name,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          description: destination.description,
          location: destination.location,
          type: 'trip',
          source: 'plan'
        };
      });

      // Merge with existing events, avoiding duplicates
      setTripEvents((prev) => {
        const existingIds = new Set(prev.map((e) => e.id));
        const newEvents = generatedEvents.filter((e) => !existingIds.has(e.id));
        const merged = [...prev, ...newEvents];
        localStorage.setItem('tripCalendarEvents', JSON.stringify(merged));
        return merged;
      });
    }
  }, [plan]);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tripCalendarEvents', JSON.stringify(tripEvents));
  }, [tripEvents]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const eventOnDate = tripEvents.find(
      (event) =>
        new Date(event.startDate) <= date && new Date(event.endDate || event.startDate) >= date
    );
    if (eventOnDate) {
      setAlertMessage(
        `Event: ${eventOnDate.title}\n${eventOnDate.location ? `Location: ${eventOnDate.location}\n` : ''}${eventOnDate.description ? `Description: ${eventOnDate.description}` : ''}`
      );
      setShowAlertModal(true);
    } else {
      setNewEvent({
        title: '',
        startDate: date.toISOString().split('T')[0],
        endDate: date.toISOString().split('T')[0],
        description: '',
        location: ''
      });
      setShowAddEventModal(true);
    }
  };

  const handleAddEvent = (title) => {
    if (!title || !title.trim()) {
      setAlertMessage('Event title cannot be empty.');
      setShowAlertModal(true);
      return;
    }

    if (!newEvent.startDate) {
      setAlertMessage('Please select a start date.');
      setShowAlertModal(true);
      return;
    }

    const event = {
      id: `event-${Date.now()}`,
      title: title.trim(),
      startDate: newEvent.startDate,
      endDate: newEvent.endDate || newEvent.startDate,
      description: newEvent.description,
      location: newEvent.location,
      type: 'custom',
      source: 'user'
    };

    setTripEvents([...tripEvents, event]);
    setShowAddEventModal(false);
    setNewEvent({
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      location: ''
    });
  };

  const handleDeleteEvent = (eventId) => {
    setTripEvents(tripEvents.filter((e) => e.id !== eventId));
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tripEvents.filter(
      (event) =>
        dateStr >= event.startDate && dateStr <= (event.endDate || event.startDate)
    );
  };

  // Tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const events = getEventsForDate(date);
      if (events.length > 0) {
        return (
          <div className="TripCalendar__DateMarker">
            {events.map((event) => (
              <div
                key={event.id}
                className={`TripCalendar__EventDot ${
                  event.type === 'trip' ? 'TripCalendar__EventDot--trip' : 'TripCalendar__EventDot--custom'
                }`}
                title={event.title}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // Connect to Google Calendar
  const handleConnectGoogle = () => {
    // Google Calendar OAuth flow
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setAlertMessage(
        'Google Calendar API client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file.'
      );
      setShowAlertModal(true);
      return;
    }

    const redirectUri = window.location.origin + '/calendar';
    const scope = 'https://www.googleapis.com/auth/calendar.events';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${encodeURIComponent(scope)}&access_type=offline`;

    window.location.href = authUrl;
  };

  // Handle OAuth callback
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const error = params.get('error');
      
      if (error) {
        setAlertMessage(`Google Calendar authorization failed: ${error}. Please try again.`);
        setShowAlertModal(true);
        // Clean up URL
        window.history.replaceState({}, document.title, '/calendar');
      } else if (accessToken) {
        localStorage.setItem('googleCalendarToken', accessToken);
        setIsGoogleConnected(true);
        setAlertMessage('Successfully connected to Google Calendar!');
        setShowAlertModal(true);
        // Clean up URL
        window.history.replaceState({}, document.title, '/calendar');
      }
    }
  }, []);

  // Sync events to Google Calendar
  const handleSyncToGoogle = async () => {
    const token = localStorage.getItem('googleCalendarToken');
    if (!token) {
      setAlertMessage('Please connect to Google Calendar first.');
      setShowAlertModal(true);
      return;
    }

    setIsSyncing(true);
    try {
      const eventsToSync = tripEvents.filter((e) => !e.syncedToGoogle);

      for (const event of eventsToSync) {
        const startDateTime = new Date(event.startDate);
        startDateTime.setHours(9, 0, 0, 0); // 9 AM
        const endDateTime = new Date(event.endDate || event.startDate);
        endDateTime.setHours(17, 0, 0, 0); // 5 PM

        const googleEvent = {
          summary: event.title,
          description: event.description || '',
          location: event.location || '',
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        };

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(googleEvent)
        });

        if (response.ok) {
          // Mark as synced
          setTripEvents((prev) =>
            prev.map((e) => (e.id === event.id ? { ...e, syncedToGoogle: true } : e))
          );
        } else {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to sync event');
        }
      }

      setAlertMessage(`Successfully synced ${eventsToSync.length} event(s) to Google Calendar!`);
      setShowAlertModal(true);
    } catch (error) {
      setAlertMessage(`Error syncing to Google Calendar: ${error.message}`);
      setShowAlertModal(true);
    } finally {
      setIsSyncing(false);
    }
  };

  // Disconnect Google Calendar
  const handleDisconnectGoogle = () => {
    localStorage.removeItem('googleCalendarToken');
    setIsGoogleConnected(false);
    setAlertMessage('Disconnected from Google Calendar.');
    setShowAlertModal(true);
  };

  // Get upcoming events
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tripEvents
      .filter((event) => new Date(event.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5);
  }, [tripEvents]);

  return (
    <div className="TripCalendar">
      <SectionHeader
        pill="Trip Calendar"
        title="Plan your trip dates"
        description="Visualize your trip schedule, add custom events, and sync with Google Calendar."
      >
        {!isGoogleConnected ? (
          <button className="Button Button--primary" onClick={handleConnectGoogle}>
            Connect Google Calendar
          </button>
        ) : (
          <>
            <button
              className="Button Button--primary"
              onClick={handleSyncToGoogle}
              disabled={isSyncing || tripEvents.length === 0}
            >
              {isSyncing ? 'Syncing...' : 'Sync to Google Calendar'}
            </button>
            <button className="Button Button--ghost" onClick={handleDisconnectGoogle}>
              Disconnect
            </button>
          </>
        )}
      </SectionHeader>

      <div className="TripCalendar__Content">
        <div className="TripCalendar__CalendarWrapper">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            onClickDay={handleDateClick}
            tileContent={tileContent}
            className="TripCalendar__Calendar"
          />
          <div className="TripCalendar__Legend">
            <div className="TripCalendar__LegendItem">
              <div className="TripCalendar__EventDot TripCalendar__EventDot--trip" />
              <span>Trip Destination</span>
            </div>
            <div className="TripCalendar__LegendItem">
              <div className="TripCalendar__EventDot TripCalendar__EventDot--custom" />
              <span>Custom Event</span>
            </div>
          </div>
        </div>

        <div className="TripCalendar__Sidebar">
          <div className="TripCalendar__Upcoming">
            <h3>Upcoming Events</h3>
            {upcomingEvents.length === 0 ? (
              <p className="Hint">No upcoming events. Click on a date to add one.</p>
            ) : (
              <div className="TripCalendar__EventList">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="TripCalendar__EventCard">
                    <div className="TripCalendar__EventCardHeader">
                      <h4>{event.title}</h4>
                      {event.syncedToGoogle && (
                        <span className="TripCalendar__SyncedBadge" title="Synced to Google Calendar">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="Label">
                      {new Date(event.startDate).toLocaleDateString()}
                      {event.endDate && event.endDate !== event.startDate
                        ? ` - ${new Date(event.endDate).toLocaleDateString()}`
                        : ''}
                    </p>
                    {event.location && <p className="Hint">📍 {event.location}</p>}
                    {event.description && <p className="Description">{event.description}</p>}
                    {event.source === 'user' && (
                      <button
                        className="Button Button--ghost Button--small"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="TripCalendar__Stats">
            <StatsCard label="Total Events" value={tripEvents.length} large />
            <StatsCard
              label="Trip Destinations"
              value={tripEvents.filter((e) => e.type === 'trip').length}
              large
            />
            <StatsCard
              label="Custom Events"
              value={tripEvents.filter((e) => e.type === 'custom').length}
              large
            />
          </div>
        </div>
      </div>

      {showAddEventModal && (
        <div className="TripCalendar__AddForm">
          <h3>Add Event</h3>
          <FormField
            label="Event Title"
            name="title"
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="e.g., Flight departure, Hotel check-in"
            required
          />
          <FormGrid>
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              required
            />
            <FormField
              label="End Date"
              name="endDate"
              type="date"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              min={newEvent.startDate}
            />
          </FormGrid>
          <FormField
            label="Location"
            name="location"
            type="text"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            placeholder="e.g., Airport, Hotel name"
          />
          <FormField
            label="Description"
            name="description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          >
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Additional notes..."
              rows="3"
            />
          </FormField>
          <FormActions>
            <button
              className="Button Button--ghost"
              onClick={() => {
                setShowAddEventModal(false);
                setNewEvent({
                  title: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  location: ''
                });
              }}
            >
              Cancel
            </button>
            <button className="Button Button--primary" onClick={() => handleAddEvent(newEvent.title)}>
              Add Event
            </button>
          </FormActions>
        </div>
      )}

      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Notice"
        message={alertMessage}
        type="info"
      />
    </div>
  );
}

TripCalendar.propTypes = {
  plan: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      nights: PropTypes.number.isRequired
    })
  )
};

