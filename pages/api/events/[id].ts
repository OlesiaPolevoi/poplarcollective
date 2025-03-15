import type { NextApiRequest, NextApiResponse } from "next";
import { getEventById } from "../../../utils/eventUtils";

type ResponseData = {
  success: boolean;
  event?: any;
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
      message: "Method not allowed",
    });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const event = getEventById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event API error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
