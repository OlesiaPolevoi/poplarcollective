import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { Event } from "../types";
import Link from "next/link";
import { CalendarMonth, LocationOn, Person } from "@mui/icons-material";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card
      sx={{ mb: 3, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {event.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CalendarMonth fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOn fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Person fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {event.organizer}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description.length > 150
            ? `${event.description.substring(0, 150)}...`
            : event.description}
        </Typography>

        <Chip
          label={`${event.attendees.length} ${
            event.attendees.length === 1 ? "attendee" : "attendees"
          }`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </CardContent>

      <CardActions>
        <Link href={`/events/${event.id}`} passHref>
          <Button size="small" component="a">
            View Details
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default EventCard;
