'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from 'lucide-react';
import { useGetAttendanceHistory } from '@/queries/attendance/queries';

// Type definitions based on provided data structure
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  role: 'STUDENT';
}

interface GradeLevel {
  id: string;
  level: string;
}

interface Section {
  id: string;
  name: string;
  gradeLevelId: string;
  teacherId: string;
  gradeLevel: GradeLevel;
}

interface Student {
  id: string;
  userId: string;
  sectionId: string;
  parentId: string | null;
  user: User;
}

interface Attendance {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  studentId: string;
  sectionId: string;
  student: Student;
  section: Section;
}

interface AttendanceHistoryTabProps {
  studentId: string;
}

// Dummy data based on provided structure
const dummyAttendanceHistory: Attendance[] = [
  {
    id: 'cmayx90o3000ebz26opplbx86',
    date: '2025-05-22T05:18:21.000Z',
    status: 'ABSENT',
    studentId: 'cma2fau1l0005d826etz11oh4',
    sectionId: 'cma5p8ayw0007d62ononz9918',
    student: {
      id: 'cma2fau1l0005d826etz11oh4',
      userId: 'cma2fau0m0003d8268t434vog',
      sectionId: 'cma5p8ayw0007d62ononz9918',
      parentId: 'cma0411sf0002bt264uzrl5p6',
      user: {
        id: 'cma2fau0m0003d8268t434vog',
        email: 'test6@gmail.com',
        firstName: 'STUDENT',
        lastName: 'Chala',
        phoneNumber: '123456789',
        gender: null,
        dateOfBirth: null,
        role: 'STUDENT',
      },
    },
    section: {
      id: 'cma5p8ayw0007d62ononz9918',
      name: 'H',
      gradeLevelId: 'cma5m0k4i0001cf2pbsrx7atv',
      teacherId: 'cma2fk58x0008d826uz20etuz',
      gradeLevel: {
        id: 'cma5m0k4i0001cf2pbsrx7atv',
        level: '123',
      },
    },
  },
  {
    id: 'cmayx90o3000ebz26opplbx87',
    date: '2025-05-21T08:30:00.000Z',
    status: 'PRESENT',
    studentId: 'cma2fau1l0005d826etz11oh4',
    sectionId: 'cma5p8ayw0007d62ononz9918',
    student: {
      id: 'cma2fau1l0005d826etz11oh4',
      userId: 'cma2fau0m0003d8268t434vog',
      sectionId: 'cma5p8ayw0007d62ononz9918',
      parentId: 'cma0411sf0002bt264uzrl5p6',
      user: {
        id: 'cma2fau0m0003d8268t434vog',
        email: 'test6@gmail.com',
        firstName: 'STUDENT',
        lastName: 'Chala',
        phoneNumber: '123456789',
        gender: null,
        dateOfBirth: null,
        role: 'STUDENT',
      },
    },
    section: {
      id: 'cma5p8ayw0007d62ononz9918',
      name: 'H',
      gradeLevelId: 'cma5m0k4i0001cf2pbsrx7atv',
      teacherId: 'cma2fk58x0008d826uz20etuz',
      gradeLevel: {
        id: 'cma5m0k4i0001cf2pbsrx7atv',
        level: '123',
      },
    },
  },
  {
    id: 'cmayx90o3000ebz26opplbx88',
    date: '2025-05-20T09:15:00.000Z',
    status: 'LATE',
    studentId: 'cma2fau1l0005d826etz11oh4',
    sectionId: 'cma5p8ayw0007d62ononz9918',
    student: {
      id: 'cma2fau1l0005d826etz11oh4',
      userId: 'cma2fau0m0003d8268t434vog',
      sectionId: 'cma5p8ayw0007d62ononz9918',
      parentId: 'cma0411sf0002bt264uzrl5p6',
      user: {
        id: 'cma2fau0m0003d8268t434vog',
        email: 'test6@gmail.com',
        firstName: 'STUDENT',
        lastName: 'Chala',
        phoneNumber: '123456789',
        gender: null,
        dateOfBirth: null,
        role: 'STUDENT',
      },
    },
    section: {
      id: 'cma5p8ayw0007d62ononz9918',
      name: 'H',
      gradeLevelId: 'cma5m0k4i0001cf2pbsrx7atv',
      teacherId: 'cma2fk58x0008d826uz20etuz',
      gradeLevel: {
        id: 'cma5m0k4i0001cf2pbsrx7atv',
        level: '123',
      },
    },
  },
];

const AttendanceHistoryTab: React.FC<AttendanceHistoryTabProps> = ({ studentId }) => {
  const { data, isLoading } = useGetAttendanceHistory(studentId);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);

  useEffect(() => {
    if (data) {
      setAttendanceRecords(data.result);
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <Card className='shadow-none'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Attendance History for {attendanceRecords[0]?.student.user.firstName}{' '}
            {attendanceRecords[0]?.student.user.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Grade Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'PRESENT'
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'ABSENT'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell>{record.section.name}</TableCell>
                    <TableCell>{record.section.gradeLevel.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No attendance records found for this student.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistoryTab;