export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  directorId: string;
  createdBy: {
    id: string;
    userId: string;
    user: {
      id: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      profile: any;
      phoneNumber: string;
      gender: string | null;
      dateOfBirth: string | null;
      role: string;
    };
  };
}

export interface CalendarEventResponse {
  success: boolean;
  message: string;
  result: CalendarEvent[];
}

export interface CreateCalendarEventPayload {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  directorId: string;
}

export interface UpdateCalendarEventPayload extends CreateCalendarEventPayload {
  id: string;
} 