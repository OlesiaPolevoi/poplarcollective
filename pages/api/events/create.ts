import type { NextApiRequest, NextApiResponse } from "next";
import { createEvent } from "../../../utils/eventUtils";
import { EventFormData } from "../../../types";

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
    const { title, description, date, location, organizer } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || !organizer) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate date is not in the past
    if (new Date(date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Event date cannot be in the past",
      });
    }

    const eventData: EventFormData = {
      title,
      description,
      date,
      location,
      organizer,
    };

    // Create the event
    const newEvent = createEvent(eventData);

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Create event API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
