# Poplar Collective

Poplar Collective is an MVP event platform built with Next.js, TypeScript, and Material UI. Users can create events, view a list of events, RSVP, and see the number of attendees.

## Features

- View a list of upcoming events
- Create new events with details like title, description, date, location, and organizer
- View detailed information about specific events
- RSVP to events
- See the number of attendees for each event

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Library**: Material UI
- **Data Storage**: Local JSON file (no database required)

## Project Structure

- `/components`: Reusable UI components
- `/data`: JSON data storage
- `/pages`: Next.js pages and API routes
- `/styles`: Global styles
- `/types`: TypeScript type definitions
- `/utils`: Utility functions for data operations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd poplar-collective
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the Development Server

```
npm run dev
```

or

```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Routes

The application includes the following API endpoints:

- `GET /api/events`: Get all events
- `GET /api/events/[id]`: Get a specific event by ID
- `POST /api/events/create`: Create a new event
- `POST /api/events/rsvp`: RSVP to an event

## Future Enhancements

- User authentication
- Event categories and tags. Groups - once profile data is gatherewd.
- Search and filtering functionality
- Image uploads for events
- Email notifications for event updates
- Integration with a database
