import type { NextApiRequest, NextApiResponse } from "next";
import { getEvents } from "../../../utils/eventUtils";

type ResponseData = {
  success: boolean;
  events: any[];
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      events: [],
      message: "Method not allowed",
    });
  }

  try {
    const events = getEvents();

    // Sort events by date (newest first)
    events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get events API error:", error);
    return res.status(500).json({
      success: false,
      events: [],
      message: "Internal server error",
    });
  }
}
