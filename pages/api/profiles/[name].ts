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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Invalid user name" });
  }

  switch (method) {
    case "GET":
      try {
        const data = getProfilesData();
        const profile = data.profiles.find((p: UserProfile) => p.name === name);

        if (profile) {
          res.status(200).json({ profile });
        } else {
          res.status(404).json({ error: "Profile not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Error fetching profile" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
