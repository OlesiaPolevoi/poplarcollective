import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Container,
  Button,
} from "@mui/material";
import Layout from "../components/Layout";
import Link from "next/link";

// Define the interests and interaction styles
const interests = [
  "Books",
  "Gardening",
  "Pickleball",
  "Tech",
  "Cooking",
  "Hiking",
  "Music",
  "Art",
  "Travel",
  "Photography",
];

const interactionStyles = [
  "One-on-one",
  "Small groups",
  "Hosting events",
  "Large gatherings",
];

export default function Profile() {
  // State for selected interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // State for selected interaction style
  const [interactionStyle, setInteractionStyle] = useState<string | null>(null);

  // Handle interest selection
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Handle interaction style selection
  const handleInteractionStyleChange = (
    event: React.MouseEvent<HTMLElement>,
    newInteractionStyle: string | null
  ) => {
    setInteractionStyle(newInteractionStyle);
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Your Profile
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Customize your preferences to enhance your experience
      </Typography>

      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Interests
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select the topics you're interested in to find relevant events and
            connect with like-minded people.
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {interests.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                onClick={() => handleInterestToggle(interest)}
                color={
                  selectedInterests.includes(interest) ? "primary" : "default"
                }
                variant={
                  selectedInterests.includes(interest) ? "filled" : "outlined"
                }
                sx={{
                  borderRadius: "16px",
                  fontSize: "0.9rem",
                  py: 2.5,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            ))}
          </Box>

          {selectedInterests.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Selected interests:
              </Typography>
              <Typography variant="body1">
                {selectedInterests.join(", ")}
              </Typography>
            </Box>
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Preferred Interaction Style
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            How do you prefer to interact with others? This helps us recommend
            events that match your social preferences.
          </Typography>

          <ToggleButtonGroup
            value={interactionStyle}
            exclusive
            onChange={handleInteractionStyleChange}
            aria-label="interaction style"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              "& .MuiToggleButtonGroup-grouped": {
                m: 1,
                flexGrow: 1,
                borderRadius: "8px !important",
                py: 1.5,
              },
            }}
          >
            {interactionStyles.map((style) => (
              <ToggleButton
                key={style}
                value={style}
                sx={{
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                {style}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {interactionStyle && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Selected interaction style:
              </Typography>
              <Typography variant="body1">{interactionStyle}</Typography>
            </Box>
          )}
        </Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Link href="/" passHref color="inherit">
            <Button
              color="inherit"
              component="a"
              style={{ backgroundColor: "green", color: "white" }}
            >
              Submit Profile
            </Button>
          </Link>
        </Box>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Your preferences are saved and will be used to personalize your
            experience.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
