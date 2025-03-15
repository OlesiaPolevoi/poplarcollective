import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { EventFormData } from "../../types";
import { createEvent } from "../../utils/eventUtils";

export default function CreateEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    location: "",
    organizer: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof EventFormData, string>>
  >({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof EventFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};
    let isValid = true;

    // Validate each field
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key as keyof EventFormData] = "This field is required";
        isValid = false;
      }
    });

    // Additional validation for date
    if (formData.date && new Date(formData.date) < new Date()) {
      newErrors.date = "Event date cannot be in the past";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Use the API endpoint instead of direct function call
        const response = await fetch("/api/events/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setShowSuccess(true);

          // Reset form
          setFormData({
            title: "",
            description: "",
            date: "",
            location: "",
            organizer: "",
          });

          // Redirect to home page after a short delay
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          const errorData = await response.json();
          console.error("Error creating event:", errorData.message);
        }
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create a New Event
      </Typography>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                name="title"
                label="Event Title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title || ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                name="description"
                label="Event Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description || ""}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="date"
                name="date"
                label="Event Date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date || ""}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="location"
                name="location"
                label="Event Location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location || ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="organizer"
                name="organizer"
                label="Organizer Name"
                value={formData.organizer}
                onChange={handleChange}
                error={!!errors.organizer}
                helperText={errors.organizer || ""}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Create Event
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Event created successfully!
        </Alert>
      </Snackbar>
    </>
  );
}
