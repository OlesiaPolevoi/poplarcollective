import React from "react";
import { GetServerSideProps } from "next";
import { Typography, Grid, Box } from "@mui/material";
import EventCard from "../components/EventCard";
import { Event } from "../types";
import Divider from "@mui/material/Divider";
import { log } from "console";

interface HomeProps {
  events: Event[];
  history: Event[];
}

export default function Home({ events, history }: HomeProps) {
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Like a strong tree, your connections grow here
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            color="text.secondary"
            gutterBottom
          >
            Olesia, attend local events handpicked just for you!
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
            Event history
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            color="text.secondary"
            gutterBottom
          >
            Every connection is a branch on your journey. Revisit the moments
            that helped you grow.
          </Typography>
        </Box>

        {history.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: "center", my: 4 }}>
            No history found. Attend an event and make connections!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {history.map((history) => (
              <Grid item key={history.id} xs={12} sm={6} md={4}>
                <EventCard event={history} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Divider></Divider>

      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
          🌳 Balance: 5 Credits
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Earn, grow, and unlock rewards!
        </Typography>
        <Box
          sx={{ textAlign: "left", maxWidth: "500px", margin: "0 auto", mt: 2 }}
        >
          <Typography>
            <strong>- Attend Events</strong> – Earn credits for showing up.
          </Typography>
          <Typography>
            <strong>- Quests</strong> – Earn credits by sharing your hobby with
            two attendees and creating connections naturally.
          </Typography>
          <Typography>
            <strong>- Redeem Rewards</strong> – Use credits to unlock Skill
            Builder sessions & Connection Maker.
          </Typography>
        </Box>
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
    const history = [
      {
        title: "Good Reads & Slow Sips: February Book Club",
        description:
          "Cozy up with fellow book lovers for an afternoon of meaningful conversation over coffee. This month, we explored 'Atomic Habits' by James Clear—a practical guide on how small changes lead to remarkable results. Whether you finished the book or just dropped in to listen, it was a great time to connect and reflect!",
        date: "2025-02-17T15:00",
        location: "Cozy Coffee House, 789 Literary Lane",
        organizer: "Bill Gates",
        id: "1742061121839",
        attendees: [
          "Olesia Polevoi",
          "Olivia Okinczyc",
          "Acaica Dunkley",
          "Samantha Green",
          "Michael Carter",
          "Lena Brooks",
        ],
        createdAt: "2025-02-10T17:52:01.838Z",
        agenda: [
          {
            time: "15:00",
            activity: "Welcome & Grab a Drink – Get comfy and settle in",
          },
          {
            time: "15:15",
            activity:
              "Book Discussion – Breaking down key takeaways from 'Atomic Habits'",
          },
          {
            time: "16:00",
            activity:
              "Personal Habit Challenges – Share insights on how to implement better habits",
          },
          {
            time: "16:30",
            activity:
              "Next Read Selection – Vote on our next book and chat about upcoming plans",
          },
        ],
        bring: [
          "A copy of 'Atomic Habits' (if you have one)",
          "Your favorite takeaway or habit idea from the book",
          "A book recommendation for next month’s meeting",
        ],
      },
    ];

    // Sort events by date (newest first)
    events.sort(
      (a: Event, b: Event) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      props: {
        events,
        history,
      },
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      props: {
        events: [],
        history: [],
      },
    };
  }
};
