import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Snackbar,
  Alert,
  Container,
  Avatar,
  Divider,
} from "@mui/material";
import { UserInterest, InteractionStyle, UserProfile } from "../types";
import {
  getInterests,
  getInteractionStyles,
  hasUserProfile,
  saveUserProfile,
  getProfilesData,
} from "../utils/profileUtils";

interface ProfilePageProps {
  interests: UserInterest[];
  interactionStyles: InteractionStyle[];
  userName: string;
}

export default function ProfilePage({
  interests,
  interactionStyles,
  userName,
}: ProfilePageProps) {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleSaveProfile = async () => {
    if (selectedInterests.length === 0) {
      setSnackbarMessage("Please select at least one interest");
      setSnackbarOpen(true);
      return;
    }

    if (selectedStyles.length === 0) {
      setSnackbarMessage("Please select at least one interaction style");
      setSnackbarOpen(true);
      return;
    }

    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: userName,
      interests: selectedInterests,
      interactionStyles: selectedStyles,
      createdAt: new Date().toISOString(),
    };

    const success = await saveUserProfile(newProfile);

    if (success) {
      router.push("/");
    } else {
      setSnackbarMessage("Error saving profile. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome to Poplar Collective!
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          color="text.secondary"
        >
          Let's set up your profile to personalize your experience
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Select Your Interests
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            Choose topics that interest you to discover relevant events and
            connect with like-minded people.
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4 }}>
            {interests.map((interest) => (
              <Chip
                key={interest.id}
                label={interest.name}
                onClick={() => handleInterestToggle(interest.id)}
                color={
                  selectedInterests.includes(interest.id)
                    ? "primary"
                    : "default"
                }
                variant={
                  selectedInterests.includes(interest.id)
                    ? "filled"
                    : "outlined"
                }
                sx={{
                  borderRadius: "24px",
                  padding: "20px 10px",
                  fontSize: "1rem",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            How Do You Prefer to Connect?
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            Select your preferred ways to interact with others in the community.
          </Typography>

          <Grid container spacing={2}>
            {interactionStyles.map((style) => (
              <Grid item xs={12} sm={6} key={style.id}>
                <Card
                  raised={selectedStyles.includes(style.id)}
                  sx={{
                    borderColor: selectedStyles.includes(style.id)
                      ? "primary.main"
                      : "transparent",
                    borderWidth: 2,
                    borderStyle: "solid",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleStyleToggle(style.id)}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {style.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {style.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSaveProfile}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "28px",
              fontSize: "1.1rem",
            }}
          >
            Save Profile & Continue
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // In a real app, you would get the user from the session/auth
  // For this example, we'll use a hardcoded username
  const userName = "Olesia"; // This would come from auth in a real app

  try {
    // Check if user already has a profile
    const userHasProfile = await hasUserProfile(userName);

    // If user already has a profile, redirect to home page
    if (userHasProfile) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    // Get interests and interaction styles
    const data = await getProfilesData();
    const interests = data.interests || [];
    const interactionStyles = data.interactionStyles || [];

    return {
      props: {
        interests,
        interactionStyles,
        userName,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);

    // Return empty arrays if there's an error
    return {
      props: {
        interests: [],
        interactionStyles: [],
        userName,
      },
    };
  }
};
