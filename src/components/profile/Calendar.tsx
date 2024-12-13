import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../forms/FormInput';
import { formatDate } from '../../utils/date';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00'
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title) {
      const event: Event = {
        id: Date.now().toString(),
        ...newEvent
      };
      setEvents([...events, event]);
      setShowEventForm(false);
      setNewEvent({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00'
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Calendar</h2>
        <Button onClick={() => setShowEventForm(!showEventForm)}>
          Add Event
        </Button>
      </div>

      {showEventForm && (
        <Card className="mb-4">
          <form onSubmit={handleAddEvent} className="space-y-4">
            <FormInput
              label="Event Title"
              name="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Date"
                name="date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
              />
              <FormInput
                label="Time"
                name="time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEventForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Event
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(event.date)} at {event.time}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setEvents(events.filter(e => e.id !== event.id))}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}

        {events.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No events scheduled
          </p>
        )}
      </div>
    </div>
  );
}