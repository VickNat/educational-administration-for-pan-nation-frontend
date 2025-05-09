export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: string | null;
  phoneNumber: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  role: string;
}

export interface DirectorRelatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roleSpecificId: string;
}

export interface ParentRelatedUser {
  id: string;
  userId: string;
  user: User;
}

export interface TeacherRelatedUser {
  id: string;
  isActivated: boolean;
  userId: string;
  user: User;
}

export interface ParentRelatedUsersResponse {
  directors: ParentRelatedUser[];
  teachers: TeacherRelatedUser[];
}

export interface TeacherRelatedUsersResponse {
  parents: TeacherRelatedUser[];
  director: ParentRelatedUser[];
}

export interface DirectorRelatedUsersResponse {
  result: DirectorRelatedUser[];
}

export interface ParentRelatedUsersResponse {
  result: ParentRelatedUsersResponse;
}

export interface TeacherRelatedUsersResponse {
  result: TeacherRelatedUsersResponse;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  seen: boolean;
  images: string[];
  sender: User;
  receiver: User;
}

export interface MessagesResponse {
  success: boolean;
  message: string;
  result: Message[];
} 