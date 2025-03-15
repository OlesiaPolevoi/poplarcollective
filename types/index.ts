export interface Event {
  agenda: any;
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  attendees: string[];
  createdAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
}

export interface UserInterest {
  id: string;
  name: string;
  icon?: string;
}

export interface InteractionStyle {
  id: string;
  name: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  interests: string[]; // Array of interest IDs
  interactionStyles: string[]; // Array of interaction style IDs
  createdAt: string;
}
