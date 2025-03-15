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
