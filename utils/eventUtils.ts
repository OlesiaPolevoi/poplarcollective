import { Event, EventFormData } from "../types";

// This is a client-safe way to import Node.js modules
// They will only be imported on the server side
const getNodeModules = () => {
  if (typeof window === "undefined") {
    // Server-side only
    const fs = require("fs");
    const path = require("path");
    const eventsFilePath = path.join(process.cwd(), "data", "events.json");
    return { fs, path, eventsFilePath };
  }
  return null;
};

// Read events from JSON file
export const getEvents = (): Event[] => {
  if (typeof window === "undefined") {
    // Server-side only
    try {
      const { fs, eventsFilePath } = getNodeModules()!;
      const fileContents = fs.readFileSync(eventsFilePath, "utf8");
      const data = JSON.parse(fileContents);
      return data.events || [];
    } catch (error) {
      console.error("Error reading events file:", error);
      return [];
    }
  }

  // Client-side: Return empty array or fetch from API
  return [];
};

// Get a single event by ID
export const getEventById = (id: string): Event | null => {
  const events = getEvents();
  return events.find((event) => event.id === id) || null;
};

// Save events to JSON file
export const saveEvents = (events: Event[]): void => {
  if (typeof window === "undefined") {
    // Server-side only
    try {
      const { fs, eventsFilePath } = getNodeModules()!;
      fs.writeFileSync(
        eventsFilePath,
        JSON.stringify({ events }, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error("Error writing events file:", error);
    }
  }
};

// Create a new event
export const createEvent = (eventData: EventFormData): Event => {
  const events = getEvents();

  const newEvent: Event = {
    ...eventData,
    id: Date.now().toString(),
    attendees: [],
    createdAt: new Date().toISOString(),
  };

  events.push(newEvent);
  saveEvents(events);

  return newEvent;
};

// Add an attendee to an event
export const addAttendee = (
  eventId: string,
  attendeeName: string
): Event | null => {
  const events = getEvents();
  const eventIndex = events.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) return null;

  // Check if attendee already exists
  if (!events[eventIndex].attendees.includes(attendeeName)) {
    events[eventIndex].attendees.push(attendeeName);
    saveEvents(events);
  }

  return events[eventIndex];
};
