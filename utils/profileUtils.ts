import { UserProfile } from "../types";

// Helper function to get API URL
const getApiUrl = (path: string) => {
  const protocol =
    typeof window === "undefined"
      ? process.env.NODE_ENV === "production"
        ? "https"
        : "http"
      : window.location.protocol.replace(":", "");

  const host =
    typeof window === "undefined"
      ? process.env.VERCEL_URL || "localhost:3000"
      : window.location.host;

  return `${protocol}://${host}${path}`;
};

// Get all profiles data
export const getProfilesData = async () => {
  try {
    const response = await fetch(getApiUrl("/api/profiles"));
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching profiles data:", error);
    return { profiles: [], interests: [], interactionStyles: [] };
  }
};

// Check if a user has a profile
export const hasUserProfile = async (userName: string): Promise<boolean> => {
  try {
    const response = await fetch(
      getApiUrl(`/api/profiles/${encodeURIComponent(userName)}`)
    );
    return response.ok;
  } catch (error) {
    console.error("Error checking user profile:", error);
    return false;
  }
};

// Get a user's profile
export const getUserProfile = async (
  userName: string
): Promise<UserProfile | null> => {
  try {
    const response = await fetch(
      getApiUrl(`/api/profiles/${encodeURIComponent(userName)}`)
    );
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Save a user's profile
export const saveUserProfile = async (
  profile: UserProfile
): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl("/api/profiles"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    return false;
  }
};

// Get all available interests
export const getInterests = async () => {
  try {
    const data = await getProfilesData();
    return data.interests || [];
  } catch (error) {
    console.error("Error fetching interests:", error);
    return [];
  }
};

// Get all available interaction styles
export const getInteractionStyles = async () => {
  try {
    const data = await getProfilesData();
    return data.interactionStyles || [];
  } catch (error) {
    console.error("Error fetching interaction styles:", error);
    return [];
  }
};

// Server-side only functions for direct data access
// These should only be used in getServerSideProps or API routes
export const getServerSideProfilesData = async () => {
  // For server-side, we'll use the API to maintain consistency
  return await getProfilesData();
};

export const getServerSideUserProfile = async (userName: string) => {
  return await getUserProfile(userName);
};

export const getServerSideHasUserProfile = async (userName: string) => {
  return await hasUserProfile(userName);
};
