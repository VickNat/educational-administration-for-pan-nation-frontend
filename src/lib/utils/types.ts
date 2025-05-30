export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'DIRECTOR' | 'TEACHER' | 'PARENT';
  gender?: string | null;
  dateOfBirth?: string | null;
  profile?: string | null;
}

export interface UserMe {
  roleId: string;
  isActivated?: boolean;
  user: User;
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
    roleId: string;
  };
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profile?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
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
    profile?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
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
    profile?: string | null;
  };
}

export interface Subject {
  id: string;
  name: string;
  gradeLevelId: string | null;
}

export interface GradeLevelSection {
  id: string;
  name: string;
  gradeLevelId: string;
  teacherId: string;
}

export interface GradeLevel {
  id: string;
  level: string;
  subjectList: Subject[];
  Section?: GradeLevelSection[];
}

export interface TeacherSectionSubject {
  id: string;
  teacherId: string;
  subjectId: string;
  sectionId: string;
  studentId: string | null;
  teacher: Teacher;
  subject: Subject;
  section: {
    id: string;
    name: string;
    gradeLevelId: string;
    teacherId: string;
  };
}
export interface Section {
  id: string;
  name: string;
  gradeLevelId?: string;
  teacherId?: string;
  subject?: string;
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
  teacherSectionSubject?: TeacherSectionSubject[];
}

export interface Result {
  id: string;
  test1: number;
  test2: number;
  mid: number;
  final: number;
  assignment: number;
  quiz: number;
  teacherId: string;
  studentId: string;
  sectionId: string;
  subjectId: string;
  collectiveResultId: string | null;
  student?: Student;
  subject?: Subject;
  section?: GradeLevelSection;
}

export interface Announcement {
  id: string;
  topic: string;
  description: string;
  image: string | null;
  directorId: string;
}

export interface CollectiveResult {
  id: string;
  conduct: string | null;
  rank: number;
  feedback: string | null;
  roasterId: string | null;
  studentId: string;
  sectionId: string;
  isAvailable: boolean;
  totalScore: number;
}

export interface CollectiveResultByStudent {
  id: string;
  conduct: string | null;
  rank: number;
  feedback: string | null;
  roasterId: string | null;
  studentId: string;
  sectionId: string;
  isAvailable: boolean;
  totalScore: number;
  average: number;
  result: Result[];
  student: {
    id: string;
    userId: string;
    sectionId: string;
    parentId: string;
    user: {
      id: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      profile: string | null;
      phoneNumber: string;
      gender: string | null;
      dateOfBirth: string | null;
      role: 'STUDENT';
    };
  };
}

export interface GradeLevelMessage {
  id: string;
  content: string;
  image: string;
  createdAt: string;
  gradeLevelId: string;
  senderId: string;
  sender: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profile: string | null;
    phoneNumber: string;
    gender: string | null;
    dateOfBirth: string | null;
    role: 'DIRECTOR';
  };
  gradeLevel: {
    id: string;
    level: string;
  };
}

