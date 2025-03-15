import type { NextApiRequest, NextApiResponse } from "next";
import { addAttendee, getEventById } from "../../../utils/eventUtils";

type ResponseData = {
  success: boolean;
  message: string;
  event?: any;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { eventId, attendeeName } = req.body;

    // Validate input
    if (
      !eventId ||
      !attendeeName ||
      typeof attendeeName !== "string" ||
      !attendeeName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Event ID and attendee name are required.",
      });
    }

    // Check if event exists
    const eventExists = getEventById(eventId);
    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Add attendee to event
    const updatedEvent = addAttendee(eventId, attendeeName.trim());

    return res.status(200).json({
      success: true,
      message: "Successfully RSVP'd to event",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("RSVP API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
