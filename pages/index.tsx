import React from "react";
import { GetServerSideProps } from "next";
import { Typography, Grid, Box, Chip } from "@mui/material";
import EventCard from "../components/EventCard";
import { Event, UserProfile } from "../types";
import {
  hasUserProfile,
  getUserProfile,
  getInterests,
  getProfilesData,
} from "../utils/profileUtils";

interface HomeProps {
  events: Event[];
  userProfile: UserProfile | null;
  interests: any[];
}

export default function Home({ events, userProfile, interests }: HomeProps) {
  // Get interest names for display
  const userInterestNames =
    userProfile?.interests.map((interestId) => {
      const interest = interests.find((i) => i.id === interestId);
      return interest ? interest.name : interestId;
    }) || [];

  return (
    <>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Like a strong tree, your connections grow here.
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          color="text.secondary"
          gutterBottom
        >
          {userProfile
            ? `${userProfile.name}, local events that align with your interests. Handpicked just for you!`
            : "Discover local events and connect with your community."}
        </Typography>

        {userProfile && userInterestNames.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {userInterestNames.map((interest, index) => (
              <Chip
                key={index}
                label={interest}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        )}
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
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // In a real app, you would get the user from the session/auth
  // For this example, we'll use a hardcoded username
  const userName = "Olesia"; // This would come from auth in a real app

  try {
    // Check if user has a profile
    const userHasProfile = await hasUserProfile(userName); //!HERE
    // const userHasProfile = true;

    // If user doesn't have a profile, redirect to profile creation page
    if (!userHasProfile) {
      return {
        redirect: {
          destination: "/profile",
          permanent: false,
        },
      };
    }

    // Get user profile
    const userProfile = await getUserProfile(userName);

    // Get all interests for display
    const data = await getProfilesData();
    const interests = data.interests || [];

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
          userProfile,
          interests,
        },
      };
    } catch (error) {
      console.error("Error fetching events:", error);
      return {
        props: {
          events: [],
          userProfile,
          interests,
        },
      };
    }
  } catch (error) {
    console.error("Error checking user profile:", error);

    // If there's an error with profile operations, still try to fetch events
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = process.env.VERCEL_URL || "localhost:3000";
    const url = `${protocol}://${host}/api/events`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const events = data.events || [];

      events.sort(
        (a: Event, b: Event) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return {
        props: {
          events,
          userProfile: null,
          interests: [],
        },
      };
    } catch (fetchError) {
      return {
        props: {
          events: [],
          userProfile: null,
          interests: [],
        },
      };
    }
  }
};
