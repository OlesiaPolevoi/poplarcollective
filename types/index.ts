export interface Event {
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
