// import React, { useState } from "react";
// import { GetServerSideProps } from "next";
// import { useRouter } from "next/router";
// import {
//   Typography,
//   Box,
//   Paper,
//   Button,
//   Divider,
//   Chip,
//   List,
//   ListItem,
//   ListItemText,
//   TextField,
//   Alert,
//   Snackbar,
//   Grid,
// } from "@mui/material";
// import { CalendarMonth, LocationOn, Person, Group } from "@mui/icons-material";
// import { Event } from "../../types";

// interface EventDetailsProps {
//   event: Event | null;
// }

// export default function EventDetails({ event }: EventDetailsProps) {
//   const router = useRouter();
//   const [attendeeName, setAttendeeName] = useState("");
//   const [nameError, setNameError] = useState("");
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [currentEvent, setCurrentEvent] = useState<Event | null>(event);

//   if (!currentEvent) {
//     return (
//       <Box sx={{ textAlign: "center", my: 4 }}>
//         <Typography variant="h5" component="h1" gutterBottom>
//           Event not found
//         </Typography>
//         <Button variant="contained" onClick={() => router.push("/")}>
//           Back to Home
//         </Button>
//       </Box>
//     );
//   }

//   const formattedDate = new Date(currentEvent.date).toLocaleDateString(
//     "en-US",
//     {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }
//   );

//   const handleRSVP = async () => {
//     if (!attendeeName.trim()) {
//       setNameError("Please enter your name");
//       return;
//     }

//     try {
//       // Use the API endpoint to RSVP
//       const response = await fetch("/api/events/rsvp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           eventId: currentEvent.id,
//           attendeeName: attendeeName.trim(),
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.event) {
//           setCurrentEvent(data.event);
//           setAttendeeName("");
//           setShowSuccess(true);
//         }
//       } else {
//         const errorData = await response.json();
//         console.error("Error RSVPing to event:", errorData.message);
//       }
//     } catch (error) {
//       console.error("Error RSVPing to event:", error);
//     }
//   };

//   return (
//     <>
//       <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           {currentEvent.title}
//         </Typography>

//         <Grid container spacing={3} sx={{ mb: 3 }}>
//           <Grid item xs={12} sm={4}>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <CalendarMonth sx={{ mr: 1 }} />
//               <Typography variant="body1">{formattedDate}</Typography>
//             </Box>
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <LocationOn sx={{ mr: 1 }} />
//               <Typography variant="body1">{currentEvent.location}</Typography>
//             </Box>
//           </Grid>

//           <Grid item xs={12} sm={4}>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <Person sx={{ mr: 1 }} />
//               <Typography variant="body1">
//                 Organized by: {currentEvent.organizer}
//               </Typography>
//             </Box>
//           </Grid>
//         </Grid>

//         <Typography variant="body1" paragraph sx={{ mb: 4 }}>
//           {currentEvent.description}
//         </Typography>

//         <Divider sx={{ my: 3 }} />

//         <Box sx={{ mb: 4 }}>
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <Group sx={{ mr: 1 }} />
//             <Typography variant="h6" component="h2">
//               Attendees ({currentEvent.attendees.length})
//             </Typography>
//           </Box>

//           {currentEvent.attendees.length > 0 ? (
//             <List dense>
//               {currentEvent.attendees.map((attendee, index) => (
//                 <ListItem key={index}>
//                   <ListItemText primary={attendee} />
//                 </ListItem>
//               ))}
//             </List>
//           ) : (
//             <Typography variant="body2" color="text.secondary">
//               No attendees yet. Be the first to RSVP!
//             </Typography>
//           )}
//         </Box>

//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             RSVP to this event
//           </Typography>

//           <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
//             <TextField
//               label="Your Name"
//               variant="outlined"
//               fullWidth
//               value={attendeeName}
//               onChange={(e) => {
//                 setAttendeeName(e.target.value);
//                 if (e.target.value.trim()) setNameError("");
//               }}
//               error={!!nameError}
//               helperText={nameError}
//               sx={{ flexGrow: 1 }}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleRSVP}
//               sx={{ height: 56 }}
//             >
//               RSVP
//             </Button>
//           </Box>
//         </Box>
//       </Paper>

//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <Button variant="outlined" onClick={() => router.push("/")}>
//           Back to Events
//         </Button>
//       </Box>

//       <Snackbar
//         open={showSuccess}
//         autoHideDuration={4000}
//         onClose={() => setShowSuccess(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert severity="success" sx={{ width: "100%" }}>
//           You have successfully RSVP'd to this event!
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { id } = context.params as { id: string };

//   // Use the API endpoint to fetch the event
//   const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
//   const host = process.env.VERCEL_URL || "localhost:3000";
//   const url = `${protocol}://${host}/api/events/${id}`;

//   try {
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`Error fetching event: ${response.statusText}`);
//     }

//     const data = await response.json();

//     return {
//       props: {
//         event: data.event || null,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching event:", error);
//     return {
//       props: {
//         event: null,
//       },
//     };
//   }
// };

import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  TextField,
  Alert,
  Snackbar,
  Grid,
} from "@mui/material";
import { CalendarMonth, LocationOn, Person, Group } from "@mui/icons-material";
import { Event } from "../../types";

interface EventDetailsProps {
  event: Event | null;
}

export default function EventDetails({ event }: EventDetailsProps) {
  const router = useRouter();
  const [attendeeName, setAttendeeName] = useState("");
  const [nameError, setNameError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(event);

  if (!currentEvent) {
    return (
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Event not found
        </Typography>
        <Button variant="contained" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  const formattedDate = new Date(currentEvent.date).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {currentEvent.title}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarMonth sx={{ mr: 1 }} />
              <Typography variant="body1">{formattedDate}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationOn sx={{ mr: 1 }} />
              <Typography variant="body1">{currentEvent.location}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="body1">
                Organized by: {currentEvent.organizer}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          {currentEvent.description}
        </Typography>

        {/* 📌 Display Agenda Here */}
        {currentEvent.agenda && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold">
              Agenda:
            </Typography>
            <List>
              {currentEvent.agenda.map(
                (
                  item: { time: any; activity: any },
                  index: React.Key | null | undefined
                ) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemText
                      primary={`🕑 ${item.time} - ${item.activity}`}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                    />
                  </ListItem>
                )
              )}
            </List>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Group sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Attendees ({currentEvent.attendees.length})
            </Typography>
          </Box>

          {currentEvent.attendees.length > 0 ? (
            <List dense>
              {currentEvent.attendees.map((attendee, index) => (
                <ListItem key={index}>
                  <ListItemText primary={attendee} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No attendees yet. Be the first to RSVP!
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            RSVP to this event
          </Typography>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <TextField
              label="Your Name"
              variant="outlined"
              fullWidth
              value={attendeeName}
              onChange={(e) => {
                setAttendeeName(e.target.value);
                if (e.target.value.trim()) setNameError("");
              }}
              error={!!nameError}
              helperText={nameError}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {} /* Add RSVP Logic */}
              sx={{ height: 56 }}
            >
              RSVP
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button variant="outlined" onClick={() => router.push("/")}>
          Back to Events
        </Button>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          You have successfully RSVP'd to this event!
        </Alert>
      </Snackbar>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = process.env.VERCEL_URL || "localhost:3000";
  const url = `${protocol}://${host}/api/events/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching event: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      props: {
        event: data.event || null,
      },
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      props: {
        event: null,
      },
    };
  }
};
