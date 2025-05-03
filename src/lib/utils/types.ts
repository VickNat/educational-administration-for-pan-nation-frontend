export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'DIRECTOR' | 'TEACHER' | 'PARENT';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  result: {
    user: User;
    token: string;
  };
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface Parent {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'PARENT';
  };
  students: any[];
}

export interface UpdateParentInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface CreateParentInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface Student {
  id: string;
  userId: string;
  sectionId: string | null;
  parentId: string;
  user: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'STUDENT';
  };
}

export interface Teacher {
  id: string;
  isActivated: boolean;
  userId: string;
  user: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'TEACHER';
  };
}

export interface Subject {
  id: string;
  name: string;
  gradeLevelId: string | null;
}

export interface GradeLevel {
  id: string;
  level: string;
  subjectList: Subject[];
}

export interface Section {
  id: string;
  name: string;
  gradeLevelId?: string;
  teacherId?: string;
  students?: Student[];
  gradeLevel?: {
    id: string;
    level: string;
  };
  homeRoom?: {
    id: string;
    isActivated: boolean;
    userId: string;
    user: {
      id: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      profile?: string | null;
      phoneNumber: string;
      gender?: string | null;
      dateOfBirth?: string | null;
      role: 'TEACHER';
    };
  };
}

