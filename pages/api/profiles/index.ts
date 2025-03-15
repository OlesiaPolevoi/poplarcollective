import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { UserProfile } from "../../../types";

const PROFILES_FILE = path.join(process.cwd(), "data", "profiles.json");

// Helper function to read profiles data
const getProfilesData = () => {
  try {
    const fileContents = fs.readFileSync(PROFILES_FILE, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading profiles data:", error);
    return { profiles: [], interests: [], interactionStyles: [] };
  }
};

// Helper function to save profiles data
const saveProfilesData = (data: any) => {
  try {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error saving profiles data:", error);
    return false;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const data = getProfilesData();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: "Error fetching profiles data" });
      }
      break;

    case "POST":
      try {
        const profile: UserProfile = req.body;

        if (
          !profile ||
          !profile.name ||
          !profile.interests ||
          !profile.interactionStyles
        ) {
          return res.status(400).json({ error: "Invalid profile data" });
        }

        const data = getProfilesData();

        // Check if profile already exists
        const existingProfileIndex = data.profiles.findIndex(
          (p: UserProfile) => p.id === profile.id || p.name === profile.name
        );

        if (existingProfileIndex >= 0) {
          // Update existing profile
          data.profiles[existingProfileIndex] = profile;
        } else {
          // Add new profile
          data.profiles.push(profile);
        }

        const success = saveProfilesData(data);

        if (success) {
          res.status(200).json({ success: true, profile });
        } else {
          res.status(500).json({ error: "Error saving profile" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error saving profile" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
