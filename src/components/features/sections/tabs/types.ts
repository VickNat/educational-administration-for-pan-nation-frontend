// Type definitions based on provided data structure
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  role: 'STUDENT';
}

interface Attendance {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  studentId: string;
  sectionId: string;
}

interface Student {
  id: string;
  userId: string;
  sectionId: string;
  parentId: string | null;
  user: User;
  attendance: Attendance | null;
}
