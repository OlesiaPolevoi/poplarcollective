import React from "react";
import { GetServerSideProps } from "next";
import { Typography, Grid, Box } from "@mui/material";
import EventCard from "../components/EventCard";
import { Event } from "../types";
import Divider from "@mui/material/Divider";

interface HomeProps {
  events: Event[];
}

export default function Home({ events }: HomeProps) {
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Like a strong tree, your connections grow here.{" "}
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            color="text.secondary"
            gutterBottom
          >
            Olesia, local events that align with your interests. Handpicked just
            for you!
          </Typography>
        </Box>

        {events.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center", my: 4 }}>
            No events found. Be the first to create an event!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Divider></Divider>
      <Box>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h4" gutterBottom>
            Event history.
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            color="text.secondary"
            gutterBottom
          >
            See the events you've attended.
          </Typography>
        </Box>

        {events.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center", my: 4 }}>
            No events found. Be the first to create an event!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Use the API endpoint to fetch events
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = process.env.VERCEL_URL || "localhost:3000";
  const url = `${protocol}://${host}/api/events`;

  try {
    // In server-side code, we can use node-fetch or the native fetch in newer Node.js versions
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.statusText}`);
    }

    const data = await response.json();
    const events = data.events || [];

    // Sort events by date (newest first)
    events.sort(
      (a: Event, b: Event) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      props: {
        events,
      },
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      props: {
        events: [],
      },
    };
  }
};
